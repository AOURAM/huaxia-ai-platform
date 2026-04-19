import json
import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    SemanticSearchRequest,
    GlobalSearchRequest,
)
from app.core.dependencies import get_current_user
from app.services.ai_service import analyze_post
from app.services.embedding_service import generate_embedding

router = APIRouter(prefix="/posts", tags=["Posts"])


def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))

    if norm1 == 0 or norm2 == 0:
        return 0.0

    return dot_product / (norm1 * norm2)


@router.post("/", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ai_result = analyze_post(post.content)
    embedding = generate_embedding(post.content)

    new_post = Post(
        title=post.title,
        content=post.content,
        page_name=post.page_name,
        content_type=post.content_type,
        category=ai_result["category"],
        ai_analysis=ai_result["analysis"],
        summary=ai_result["summary"],
        tags=json.dumps(ai_result["tags"]),
        embedding=json.dumps(embedding),
        user_id=current_user.id
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    db.execute(text("""
        UPDATE posts
        SET search_vector = to_tsvector(
            'english',
            coalesce(title, '') || ' ' || coalesce(content, '')
        )
        WHERE id = :post_id
    """), {"post_id": new_post.id})

    db.commit()
    db.refresh(new_post)

    return new_post


@router.get("/", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()


@router.get("/my-posts", response_model=list[PostResponse])
def get_my_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Post).filter(Post.user_id == current_user.id).all()


@router.get("/{post_id}", response_model=PostResponse)
def get_post_by_id(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return post


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    updated_post: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")

    ai_result = analyze_post(updated_post.content)
    embedding = generate_embedding(updated_post.content)

    post.title = updated_post.title
    post.content = updated_post.content
    post.page_name = updated_post.page_name
    post.content_type = updated_post.content_type
    post.category = ai_result["category"]
    post.ai_analysis = ai_result["analysis"]
    post.summary = ai_result["summary"]
    post.tags = json.dumps(ai_result["tags"])
    post.embedding = json.dumps(embedding)

    db.commit()
    db.refresh(post)

    db.execute(text("""
        UPDATE posts
        SET search_vector = to_tsvector(
            'english',
            coalesce(title, '') || ' ' || coalesce(content, '')
        )
        WHERE id = :post_id
    """), {"post_id": post.id})

    db.commit()
    db.refresh(post)

    return post


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}


@router.post("/search")
def hybrid_search_posts(
    request: SemanticSearchRequest,
    db: Session = Depends(get_db)
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
            created_at,
            user_id,
            embedding,
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

        raw_keyword_score = float(post["keyword_score"]) if post["keyword_score"] is not None else 0.0
        keyword_score = min(raw_keyword_score * 20, 1.0)

        final_score = (semantic_score * 0.7) + (keyword_score * 0.3)

        scored_posts.append({
            "id": post["id"],
            "title": post["title"],
            "content": post["content"],
            "page_name": post["page_name"],
            "content_type": post["content_type"],
            "category": post["category"],
            "ai_analysis": post["ai_analysis"],
            "summary": post["summary"],
            "tags": post["tags"],
            "created_at": post["created_at"],
            "user_id": post["user_id"],
            "semantic_score": semantic_score,
            "keyword_score": keyword_score,
            "final_score": final_score
        })

    scored_posts.sort(key=lambda x: x["final_score"], reverse=True)

    return {"results": scored_posts[:request.limit]}


@router.post("/search/global")
def global_grouped_search(
    request: GlobalSearchRequest,
    db: Session = Depends(get_db)
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
            created_at,
            user_id,
            embedding,
            ts_rank(search_vector, plainto_tsquery('english', :query)) AS keyword_score
        FROM posts
        ORDER BY keyword_score DESC
    """

    all_posts = db.execute(text(sql), {"query": request.query}).mappings().all()

    grouped_results = {
        "cities": [],
        "universities": [],
        "culture": [],
        "daily_life": []
    }

    for post in all_posts:
        if not post["embedding"]:
            continue

        post_embedding = json.loads(post["embedding"])
        semantic_score = cosine_similarity(query_embedding, post_embedding)

        raw_keyword_score = float(post["keyword_score"]) if post["keyword_score"] is not None else 0.0
        keyword_score = min(raw_keyword_score * 20, 1.0)

        final_score = (semantic_score * 0.7) + (keyword_score * 0.3)

        if final_score < request.min_score:
            continue

        page = post["page_name"]
        if page not in grouped_results:
            continue

        grouped_results[page].append({
            "id": post["id"],
            "title": post["title"],
            "content": post["content"],
            "page_name": post["page_name"],
            "content_type": post["content_type"],
            "category": post["category"],
            "ai_analysis": post["ai_analysis"],
            "summary": post["summary"],
            "tags": post["tags"],
            "created_at": post["created_at"],
            "user_id": post["user_id"],
            "semantic_score": semantic_score,
            "keyword_score": keyword_score,
            "final_score": final_score
        })

    for page in grouped_results:
        grouped_results[page].sort(key=lambda x: x["final_score"], reverse=True)
        grouped_results[page] = grouped_results[page][:request.per_page_limit]

    return grouped_results


@router.post("/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.likes_count += 1
    db.commit()
    db.refresh(post)

    return {
        "message": "Post liked",
        "post_id": post.id,
        "likes_count": post.likes_count,
        "dislikes_count": post.dislikes_count
    }


@router.post("/{post_id}/dislike")
def dislike_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.dislikes_count += 1
    db.commit()
    db.refresh(post)

    return {
        "message": "Post disliked",
        "post_id": post.id,
        "likes_count": post.likes_count,
        "dislikes_count": post.dislikes_count
    }


@router.get("/top")
def get_top_posts(
    page_name: str | None = None,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    query = db.query(Post)

    if page_name:
        query = query.filter(Post.page_name == page_name)

    posts = query.all()

    ranked_posts = []

    for post in posts:
        score = (post.likes_count * 2) - (post.dislikes_count * 1)

        ranked_posts.append({
            "id": post.id,
            "title": post.title,
            "page_name": post.page_name,
            "content_type": post.content_type,
            "category": post.category,
            "summary": post.summary,
            "likes_count": post.likes_count,
            "dislikes_count": post.dislikes_count,
            "top_score": score
        })

    ranked_posts.sort(key=lambda x: x["top_score"], reverse=True)

    return {"results": ranked_posts[:limit]}


@router.get("/{post_id}/recommendations")
def recommend_similar_posts(
    post_id: int,
    scope: str = "page",
    db: Session = Depends(get_db)
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

        recommendations.append({
            "id": post.id,
            "title": post.title,
            "page_name": post.page_name,
            "content_type": post.content_type,
            "category": post.category,
            "summary": post.summary,
            "similarity": similarity,
            "engagement_score": engagement_score,
            "recommendation_score": recommendation_score
        })

    recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)

    return {"results": recommendations[:5]}