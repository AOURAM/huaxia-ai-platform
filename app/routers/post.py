import json
import math
import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.models.comment import Comment
from app.models.post_reaction import PostReaction
from app.schemas.post import (
    PostResponse,
    HybridSearchRequest,
    GlobalSearchRequest,
    PostReactionRequest,
    PostDetailResponse,
)
from app.core.dependencies import get_current_user
from app.services.ai_service import analyze_post
from app.services.embedding_service import generate_embedding
from app.schemas.comment import CommentDetailResponse

router = APIRouter(prefix="/posts", tags=["Posts"])


def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))

    if norm1 == 0 or norm2 == 0:
        return 0.0

    return dot_product / (norm1 * norm2)


def parse_tags(tags_value):
    if tags_value is None:
        return None
    if isinstance(tags_value, list):
        return tags_value
    if isinstance(tags_value, str):
        try:
            return json.loads(tags_value)
        except json.JSONDecodeError:
            return []
    return []


def save_uploaded_image(image: UploadFile | None) -> str | None:
    if image is None:
        return None

    os.makedirs("uploads/posts", exist_ok=True)

    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = os.path.join("uploads", "posts", filename)

    with open(file_path, "wb") as f:
        f.write(image.file.read())

    return f"/uploads/posts/{filename}"


def serialize_post_response(post: Post) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "page_name": post.page_name,
        "content_type": post.content_type,
        "category": post.category,
        "ai_analysis": post.ai_analysis,
        "summary": post.summary,
        "tags": parse_tags(post.tags),
        "image_url": post.image_url,
        "likes_count": post.likes_count,
        "dislikes_count": post.dislikes_count,
        "created_at": post.created_at,
        "user_id": post.user_id,
    }

def serialize_comment_detail(comment: Comment, username: str) -> dict:
    return {
        "id": comment.id,
        "content": comment.content,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "user_id": comment.user_id,
        "post_id": comment.post_id,
        "username": username,
    }

@router.post("/", response_model=PostResponse)
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    page_name: str = Form(...),
    content_type: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    page_name = page_name.strip().lower()
    content_type = content_type.strip().lower()

    allowed_pages = {"cities", "universities", "culture", "daily_life"}
    allowed_content_types = {"question", "guide", "experience", "news", "tip"}

    if page_name not in allowed_pages:
        raise HTTPException(
            status_code=400,
            detail="page_name must be one of: cities, universities, culture, daily_life",
        )

    if content_type not in allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail="content_type must be one of: question, guide, experience, news, tip",
        )

    image_url = save_uploaded_image(image)

    ai_result = analyze_post(content)
    embedding = generate_embedding(content)

    new_post = Post(
        title=title,
        content=content,
        page_name=page_name,
        content_type=content_type,
        category=ai_result["category"],
        ai_analysis=ai_result["analysis"],
        summary=ai_result["summary"],
        tags=json.dumps(ai_result["tags"]),
        embedding=json.dumps(embedding),
        image_url=image_url,
        user_id=current_user.id,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    db.execute(
        text(
            """
            UPDATE posts
            SET search_vector = to_tsvector(
                'english',
                coalesce(title, '') || ' ' || coalesce(content, '')
            )
            WHERE id = :post_id
            """
        ),
        {"post_id": new_post.id},
    )
    db.commit()
    db.refresh(new_post)

    return serialize_post_response(new_post)


@router.get("/", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return [serialize_post_response(post) for post in posts]


@router.get("/my-posts", response_model=list[PostResponse])
def get_current_user_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    posts = db.query(Post).filter(Post.user_id == current_user.id).all()
    return [serialize_post_response(post) for post in posts]


@router.post("/search")
def search_posts(
    request: HybridSearchRequest,
    db: Session = Depends(get_db),
):
    query_embedding = generate_embedding(request.query)

    sql = """
        SELECT
            id,
            title,
            content,
            page_name,
            content_type,
            category,
            ai_analysis,
            summary,
            tags,
            image_url,
            created_at,
            user_id,
            embedding,
            likes_count,
            dislikes_count,
            ts_rank(search_vector, plainto_tsquery('english', :query)) AS keyword_score
        FROM posts
        WHERE 1=1
    """

    params = {"query": request.query}

    if request.page_name:
        sql += " AND page_name = :page_name"
        params["page_name"] = request.page_name

    if request.content_type:
        sql += " AND content_type = :content_type"
        params["content_type"] = request.content_type

    sql += " ORDER BY keyword_score DESC"

    keyword_results = db.execute(text(sql), params).mappings().all()

    scored_posts = []

    for post in keyword_results:
        if not post["embedding"]:
            continue

        post_embedding = json.loads(post["embedding"])
        semantic_score = cosine_similarity(query_embedding, post_embedding)

        raw_keyword_score = (
            float(post["keyword_score"]) if post["keyword_score"] is not None else 0.0
        )
        keyword_score = min(raw_keyword_score * 20, 1.0)

        final_score = (semantic_score * 0.7) + (keyword_score * 0.3)

        scored_posts.append(
            {
                "id": post["id"],
                "title": post["title"],
                "content": post["content"],
                "page_name": post["page_name"],
                "content_type": post["content_type"],
                "category": post["category"],
                "ai_analysis": post["ai_analysis"],
                "summary": post["summary"],
                "tags": parse_tags(post["tags"]),
                "image_url": post["image_url"],
                "created_at": post["created_at"],
                "user_id": post["user_id"],
                "likes_count": post["likes_count"],
                "dislikes_count": post["dislikes_count"],
                "semantic_score": semantic_score,
                "keyword_score": keyword_score,
                "final_score": final_score,
            }
        )

    scored_posts.sort(key=lambda x: x["final_score"], reverse=True)

    return {"results": scored_posts[: request.limit]}


@router.post("/search/global")
def search_posts_globally(
    request: GlobalSearchRequest,
    db: Session = Depends(get_db),
):
    query_embedding = generate_embedding(request.query)

    sql = """
        SELECT
            id,
            title,
            content,
            page_name,
            content_type,
            category,
            ai_analysis,
            summary,
            tags,
            image_url,
            created_at,
            user_id,
            embedding,
            likes_count,
            dislikes_count,
            ts_rank(search_vector, plainto_tsquery('english', :query)) AS keyword_score
        FROM posts
        ORDER BY keyword_score DESC
    """

    all_posts = db.execute(text(sql), {"query": request.query}).mappings().all()

    grouped_results = {
        "cities": [],
        "universities": [],
        "culture": [],
        "daily_life": [],
    }

    for post in all_posts:
        if not post["embedding"]:
            continue

        post_embedding = json.loads(post["embedding"])
        semantic_score = cosine_similarity(query_embedding, post_embedding)

        raw_keyword_score = (
            float(post["keyword_score"]) if post["keyword_score"] is not None else 0.0
        )
        keyword_score = min(raw_keyword_score * 20, 1.0)

        final_score = (semantic_score * 0.7) + (keyword_score * 0.3)

        if final_score < request.min_score:
            continue

        page = post["page_name"]
        if page not in grouped_results:
            continue

        grouped_results[page].append(
            {
                "id": post["id"],
                "title": post["title"],
                "content": post["content"],
                "page_name": post["page_name"],
                "content_type": post["content_type"],
                "category": post["category"],
                "ai_analysis": post["ai_analysis"],
                "summary": post["summary"],
                "tags": parse_tags(post["tags"]),
                "image_url": post["image_url"],
                "created_at": post["created_at"],
                "user_id": post["user_id"],
                "likes_count": post["likes_count"],
                "dislikes_count": post["dislikes_count"],
                "semantic_score": semantic_score,
                "keyword_score": keyword_score,
                "final_score": final_score,
            }
        )

    for page in grouped_results:
        grouped_results[page].sort(key=lambda x: x["final_score"], reverse=True)
        grouped_results[page] = grouped_results[page][: request.per_page_limit]

    return grouped_results


@router.get("/top")
def get_top_posts(
    page_name: str | None = None,
    limit: int = 5,
    db: Session = Depends(get_db),
):
    query = db.query(Post)

    if page_name:
        query = query.filter(Post.page_name == page_name)

    posts = query.all()

    ranked_posts = []

    for post in posts:
        score = (post.likes_count * 2) - post.dislikes_count

        ranked_posts.append(
            {
                "id": post.id,
                "title": post.title,
                "page_name": post.page_name,
                "content_type": post.content_type,
                "category": post.category,
                "summary": post.summary,
                "image_url": post.image_url,
                "likes_count": post.likes_count,
                "dislikes_count": post.dislikes_count,
                "top_score": score,
            }
        )

    ranked_posts.sort(key=lambda x: x["top_score"], reverse=True)

    return {"results": ranked_posts[:limit]}


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return serialize_post_response(post)

@router.get("/{post_id}/detail", response_model=PostDetailResponse)
def get_post_detail(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments_query = (
        db.query(Comment, User.username)
        .join(User, Comment.user_id == User.id)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )

    comments = [
        serialize_comment_detail(comment, username)
        for comment, username in comments_query
    ]

    total_comments = len(comments)

    existing_reaction = db.query(PostReaction).filter(
        PostReaction.user_id == current_user.id,
        PostReaction.post_id == post_id,
    ).first()

    user_reaction = existing_reaction.reaction_type if existing_reaction else None

    target_embedding = json.loads(post.embedding) if post.embedding else None
    recommendations = []

    if target_embedding:
        query = db.query(Post).filter(
            Post.id != post_id,
            Post.page_name == post.page_name,
        )

        posts = query.all()

        for candidate_post in posts:
            if not candidate_post.embedding:
                continue

            post_embedding = json.loads(candidate_post.embedding)
            similarity = cosine_similarity(target_embedding, post_embedding)

            raw_engagement = (candidate_post.likes_count * 2) - candidate_post.dislikes_count
            engagement_score = max(raw_engagement, 0) / 10
            engagement_score = min(engagement_score, 1.0)

            recommendation_score = (similarity * 0.8) + (engagement_score * 0.2)

            if recommendation_score < 0.15:
                continue

            recommendations.append(
                {
                    "id": candidate_post.id,
                    "title": candidate_post.title,
                    "page_name": candidate_post.page_name,
                    "content_type": candidate_post.content_type,
                    "category": candidate_post.category,
                    "summary": candidate_post.summary,
                    "image_url": candidate_post.image_url,
                    "similarity": similarity,
                    "engagement_score": engagement_score,
                    "recommendation_score": recommendation_score,
                }
            )

        recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)
        recommendations = recommendations[:5]

    return {
        "post": serialize_post_response(post),
        "comments": comments,
        "total_comments": total_comments,
        "recommendations": recommendations,
        "user_reaction": user_reaction,
    }


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    title: str | None = Form(None),
    content: str | None = Form(None),
    page_name: str | None = Form(None),
    content_type: str | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")

    allowed_pages = {"cities", "universities", "culture", "daily_life"}
    allowed_content_types = {"question", "guide", "experience", "news", "tip"}

    if page_name is not None:
        page_name = page_name.strip().lower()
        if page_name not in allowed_pages:
            raise HTTPException(
                status_code=400,
                detail="page_name must be one of: cities, universities, culture, daily_life",
            )

    if content_type is not None:
        content_type = content_type.strip().lower()
        if content_type not in allowed_content_types:
            raise HTTPException(
                status_code=400,
                detail="content_type must be one of: question, guide, experience, news, tip",
            )

    content_changed = content is not None and content != post.content

    if title is not None:
        post.title = title

    if content is not None:
        post.content = content

    if page_name is not None:
        post.page_name = page_name

    if content_type is not None:
        post.content_type = content_type

    if image is not None:
        post.image_url = save_uploaded_image(image)

    if content_changed:
        ai_result = analyze_post(post.content)
        embedding = generate_embedding(post.content)

        post.category = ai_result["category"]
        post.ai_analysis = ai_result["analysis"]
        post.summary = ai_result["summary"]
        post.tags = json.dumps(ai_result["tags"])
        post.embedding = json.dumps(embedding)

    db.commit()
    db.refresh(post)

    if title is not None or content_changed:
        db.execute(
            text(
                """
                UPDATE posts
                SET search_vector = to_tsvector(
                    'english',
                    coalesce(title, '') || ' ' || coalesce(content, '')
                )
                WHERE id = :post_id
                """
            ),
            {"post_id": post.id},
        )
        db.commit()
        db.refresh(post)

    return serialize_post_response(post)


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}


@router.post("/{post_id}/react")
def react_to_post(
    post_id: int,
    request: PostReactionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_reaction = db.query(PostReaction).filter(
        PostReaction.user_id == current_user.id,
        PostReaction.post_id == post_id,
    ).first()

    if existing_reaction:
        if existing_reaction.reaction_type != request.reaction_type:
            if request.reaction_type == "like":
                post.likes_count += 1
                post.dislikes_count -= 1
            else:
                post.dislikes_count += 1
                post.likes_count -= 1

            existing_reaction.reaction_type = request.reaction_type

    else:
        new_reaction = PostReaction(
            user_id=current_user.id,
            post_id=post_id,
            reaction_type=request.reaction_type,
        )
        db.add(new_reaction)

        if request.reaction_type == "like":
            post.likes_count += 1
        else:
            post.dislikes_count += 1

    db.commit()
    db.refresh(post)

    return {
        "message": "Reaction updated",
        "likes_count": post.likes_count,
        "dislikes_count": post.dislikes_count,
    }


@router.get("/{post_id}/recommendations")
def get_post_recommendations(
    post_id: int,
    scope: str = "page",
    db: Session = Depends(get_db),
):
    target_post = db.query(Post).filter(Post.id == post_id).first()

    if not target_post or not target_post.embedding:
        return {"results": []}

    target_embedding = json.loads(target_post.embedding)

    query = db.query(Post).filter(Post.id != post_id)

    if scope == "page":
        query = query.filter(Post.page_name == target_post.page_name)

    posts = query.all()

    recommendations = []

    for post in posts:
        if not post.embedding:
            continue

        post_embedding = json.loads(post.embedding)
        similarity = cosine_similarity(target_embedding, post_embedding)

        raw_engagement = (post.likes_count * 2) - post.dislikes_count
        engagement_score = max(raw_engagement, 0) / 10
        engagement_score = min(engagement_score, 1.0)

        recommendation_score = (similarity * 0.8) + (engagement_score * 0.2)

        if recommendation_score < 0.15:
            continue

        recommendations.append(
            {
                "id": post.id,
                "title": post.title,
                "page_name": post.page_name,
                "content_type": post.content_type,
                "category": post.category,
                "summary": post.summary,
                "image_url": post.image_url,
                "similarity": similarity,
                "engagement_score": engagement_score,
                "recommendation_score": recommendation_score,
            }
        )

    recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)

    return {"results": recommendations[:5]}