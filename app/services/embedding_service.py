from __future__ import annotations

from typing import TYPE_CHECKING

from app.services.ai_service import AI_ENABLED

if TYPE_CHECKING:
    from sentence_transformers import SentenceTransformer

_model = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def generate_embedding(text: str) -> list[float]:
    if not AI_ENABLED:
        return []

    model = get_model()
    embedding = model.encode(text)
    return embedding.tolist()
