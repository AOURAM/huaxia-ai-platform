import json
from datetime import datetime, timezone

from app.database import SessionLocal
from app.models.post import Post
from app.services.ai_service import analyze_post
from app.services.embedding_service import generate_embedding


def enrich_post_ai(post_id: int, content: str) -> None:
    db = SessionLocal()

    try:
        post = db.query(Post).filter(Post.id == post_id).first()

        if not post:
            return

        ai_result = analyze_post(content)

        try:
            embedding = generate_embedding(content)
        except Exception as error:
            embedding = []
            ai_result["status"] = "failed"

            existing_error = ai_result.get("error")
            embedding_error = f"Embedding generation failed: {error}"

            if existing_error:
                ai_result["error"] = f"{existing_error}; {embedding_error}"
            else:
                ai_result["error"] = embedding_error

        post.category_id = ai_result.get("category", "general")
        post.ai_status = ai_result.get("status", "failed")
        post.ai_error = ai_result.get("error")
        post.ai_analysis = ai_result.get("analysis", "AI analysis unavailable.")
        post.ai_updated_at = datetime.now(timezone.utc)
        post.summary = ai_result.get("summary", "No summary available.")
        post.tags = json.dumps(ai_result.get("tags", ["general"]))
        post.embedding = json.dumps(embedding)

        db.commit()

    except Exception as error:
        db.rollback()

        try:
            failed_post = db.query(Post).filter(Post.id == post_id).first()

            if failed_post:
                failed_post.ai_status = "failed"
                failed_post.ai_error = str(error)
                failed_post.ai_analysis = "AI enrichment failed."
                failed_post.ai_updated_at = datetime.now(timezone.utc)
                failed_post.summary = failed_post.summary or "No summary available."
                failed_post.tags = failed_post.tags or json.dumps(["general"])

                if failed_post.category_id is None:
                    failed_post.category_id = "general"

                db.commit()

        except Exception:
            db.rollback()

    finally:
        db.close()