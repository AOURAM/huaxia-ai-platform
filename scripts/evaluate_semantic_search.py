import argparse
import json
import math
import re
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from sqlalchemy import text

from app.database import SessionLocal
from app.models.post import Post
from app.services.embedding_service import generate_embedding


DEFAULT_EVALUATION_QUERIES = [
    {
        "query": "cheap housing near university",
        "expected_terms": ["housing", "rent", "apartment", "dorm", "campus", "university"],
    },
    {
        "query": "how to open a bank account in China",
        "expected_terms": ["bank", "account", "card", "payment", "alipay", "wechat"],
    },
    {
        "query": "student visa renewal documents",
        "expected_terms": ["visa", "residence", "permit", "passport", "documents", "renewal"],
    },
    {
        "query": "Chinese culture shock for international students",
        "expected_terms": ["culture", "shock", "customs", "language", "communication", "china"],
    },
    {
        "query": "daily life tips for new international students",
        "expected_terms": ["daily", "life", "tips", "student", "food", "transport"],
    },
    {
        "query": "best cities for studying in China",
        "expected_terms": ["city", "cities", "beijing", "shanghai", "guangzhou", "study"],
    },
]


@dataclass
class PostCandidate:
    id: int
    title: str
    content: str
    page_name: str
    content_type: str
    category_id: str | None
    summary: str | None
    tags: list[str]
    created_at: Any
    embedding: list[float] | None
    keyword_score: float = 0.0
    semantic_score: float = 0.0
    final_score: float = 0.0
    relevant: bool = False


def parse_tags(value: Any) -> list[str]:
    if value is None:
        return []

    if isinstance(value, list):
        return [str(item) for item in value]

    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(item) for item in parsed]
        except json.JSONDecodeError:
            return []

    return []


def parse_embedding(value: Any) -> list[float] | None:
    if value is None:
        return None

    if isinstance(value, list):
        return [float(item) for item in value if isinstance(item, (int, float))]

    if isinstance(value, str):
        try:
            parsed = json.loads(value)

            if isinstance(parsed, list):
                return [
                    float(item)
                    for item in parsed
                    if isinstance(item, (int, float))
                ]
        except json.JSONDecodeError:
            return None

    return None


def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    if len(vec1) != len(vec2):
        return 0.0

    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))

    if norm1 == 0 or norm2 == 0:
        return 0.0

    return dot_product / (norm1 * norm2)


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.lower()).strip()


def build_search_text(post: PostCandidate) -> str:
    parts = [
        post.title,
        post.content,
        post.page_name,
        post.content_type,
        post.category_id or "",
        post.summary or "",
        " ".join(post.tags),
    ]

    return normalize_text(" ".join(parts))


def is_relevant(post: PostCandidate, expected_terms: list[str]) -> bool:
    search_text = build_search_text(post)

    return any(term.lower() in search_text for term in expected_terms)


def load_posts_with_keyword_scores(db, query: str) -> list[PostCandidate]:
    rows = db.execute(
        text(
            """
            SELECT
                id,
                ts_rank(
                    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')),
                    plainto_tsquery('english', :query)
                ) AS keyword_score
            FROM posts
            """
        ),
        {"query": query},
    ).mappings().all()

    keyword_scores_by_id = {
        int(row["id"]): float(row["keyword_score"] or 0.0)
        for row in rows
    }

    posts = db.query(Post).order_by(Post.created_at.desc()).all()

    candidates: list[PostCandidate] = []

    for post in posts:
        candidates.append(
            PostCandidate(
                id=post.id,
                title=post.title,
                content=post.content,
                page_name=post.page_name,
                content_type=post.content_type,
                category_id=post.category_id,
                summary=post.summary,
                tags=parse_tags(post.tags),
                created_at=post.created_at,
                embedding=parse_embedding(post.embedding),
                keyword_score=keyword_scores_by_id.get(post.id, 0.0),
            )
        )

    return candidates


def score_posts(
    candidates: list[PostCandidate],
    query_embedding: list[float] | None,
    expected_terms: list[str],
) -> list[PostCandidate]:
    max_keyword_score = max((post.keyword_score for post in candidates), default=0.0)

    for post in candidates:
        if max_keyword_score > 0:
            normalized_keyword_score = post.keyword_score / max_keyword_score
        else:
            normalized_keyword_score = 0.0

        if query_embedding and post.embedding:
            post.semantic_score = cosine_similarity(query_embedding, post.embedding)
        else:
            post.semantic_score = 0.0

        post.keyword_score = normalized_keyword_score
        post.final_score = (post.semantic_score * 0.7) + (post.keyword_score * 0.3)
        post.relevant = is_relevant(post, expected_terms)

    return candidates


def precision_at_k(posts: list[PostCandidate], k: int) -> float:
    if not posts:
        return 0.0

    top_posts = posts[:k]

    if not top_posts:
        return 0.0

    relevant_count = sum(1 for post in top_posts if post.relevant)

    return relevant_count / len(top_posts)


def format_post_row(rank: int, post: PostCandidate, mode: str) -> str:
    if mode == "keyword":
        score = post.keyword_score
    elif mode == "semantic":
        score = post.semantic_score
    else:
        score = post.final_score

    relevant_marker = "✅" if post.relevant else "—"

    title = post.title.replace("\n", " ").strip()

    return (
        f"| {rank} | {post.id} | {score:.4f} | {relevant_marker} | "
        f"{post.page_name} | {post.category_id or 'None'} | {title} |"
    )


def evaluate_query(db, query: str, expected_terms: list[str], top_k: int) -> dict:
    print(f"\nEvaluating query: {query}")

    candidates = load_posts_with_keyword_scores(db, query)

    if not candidates:
        return {
            "query": query,
            "expected_terms": expected_terms,
            "error": "No posts found in database.",
            "keyword": [],
            "semantic": [],
            "hybrid": [],
        }

    try:
        query_embedding = generate_embedding(query)
    except Exception as error:
        query_embedding = None
        print(f"Embedding generation failed for query: {error}")

    scored_posts = score_posts(candidates, query_embedding, expected_terms)

    keyword_ranked = sorted(
        scored_posts,
        key=lambda post: post.keyword_score,
        reverse=True,
    )[:top_k]

    semantic_ranked = sorted(
        scored_posts,
        key=lambda post: post.semantic_score,
        reverse=True,
    )[:top_k]

    hybrid_ranked = sorted(
        scored_posts,
        key=lambda post: post.final_score,
        reverse=True,
    )[:top_k]

    return {
        "query": query,
        "expected_terms": expected_terms,
        "keyword": keyword_ranked,
        "semantic": semantic_ranked,
        "hybrid": hybrid_ranked,
        "keyword_precision": precision_at_k(keyword_ranked, top_k),
        "semantic_precision": precision_at_k(semantic_ranked, top_k),
        "hybrid_precision": precision_at_k(hybrid_ranked, top_k),
        "total_posts": len(candidates),
        "posts_with_embeddings": sum(1 for post in candidates if post.embedding),
    }


def build_markdown_report(results: list[dict], top_k: int) -> str:
    lines: list[str] = []

    lines.append("# Huaxia Semantic Search Evaluation")
    lines.append("")
    lines.append(f"Generated at: `{datetime.now().isoformat(timespec='seconds')}`")
    lines.append("")
    lines.append("## Purpose")
    lines.append("")
    lines.append(
        "This report compares keyword search, semantic embedding search, and hybrid search "
        "for Huaxia community posts."
    )
    lines.append("")
    lines.append("Hybrid score uses:")
    lines.append("")
    lines.append("```txt")
    lines.append("final_score = (semantic_score * 0.7) + (keyword_score * 0.3)")
    lines.append("```")
    lines.append("")
    lines.append(
        "Relevance is estimated using expected terms for each query. This is a lightweight "
        "prototype evaluation, not a full human-annotated benchmark."
    )
    lines.append("")

    summary_rows = []

    for result in results:
        if "error" in result:
            summary_rows.append(
                f"| {result['query']} | ERROR | ERROR | ERROR | {result['error']} |"
            )
            continue

        summary_rows.append(
            f"| {result['query']} | "
            f"{result['keyword_precision']:.2f} | "
            f"{result['semantic_precision']:.2f} | "
            f"{result['hybrid_precision']:.2f} | "
            f"{result['posts_with_embeddings']}/{result['total_posts']} |"
        )

    lines.append("## Summary")
    lines.append("")
    lines.append(
        f"| Query | Keyword P@{top_k} | Semantic P@{top_k} | Hybrid P@{top_k} | Posts With Embeddings |"
    )
    lines.append("|---|---:|---:|---:|---:|")
    lines.extend(summary_rows)
    lines.append("")

    for result in results:
        lines.append(f"## Query: {result['query']}")
        lines.append("")
        lines.append(
            f"Expected relevance terms: `{', '.join(result['expected_terms'])}`"
        )
        lines.append("")

        if "error" in result:
            lines.append(f"Error: {result['error']}")
            lines.append("")
            continue

        for mode_label, key in [
            ("Keyword Ranking", "keyword"),
            ("Semantic Ranking", "semantic"),
            ("Hybrid Ranking", "hybrid"),
        ]:
            lines.append(f"### {mode_label}")
            lines.append("")
            lines.append("| Rank | Post ID | Score | Relevant | Page | Category | Title |")
            lines.append("|---:|---:|---:|---|---|---|---|")

            for rank, post in enumerate(result[key], start=1):
                mode = (
                    "keyword"
                    if key == "keyword"
                    else "semantic"
                    if key == "semantic"
                    else "hybrid"
                )
                lines.append(format_post_row(rank, post, mode))

            lines.append("")

    return "\n".join(lines)


def save_report(markdown: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Evaluate Huaxia keyword, semantic, and hybrid search."
    )

    parser.add_argument(
        "--top-k",
        type=int,
        default=5,
        help="Number of top results to evaluate per ranking method.",
    )

    parser.add_argument(
        "--output",
        type=str,
        default="reports/semantic_search_evaluation.md",
        help="Markdown report output path.",
    )

    args = parser.parse_args()

    if args.top_k < 1:
        raise ValueError("--top-k must be at least 1")

    db = SessionLocal()

    try:
        results = []

        for item in DEFAULT_EVALUATION_QUERIES:
            result = evaluate_query(
                db=db,
                query=item["query"],
                expected_terms=item["expected_terms"],
                top_k=args.top_k,
            )
            results.append(result)

        report = build_markdown_report(results, args.top_k)
        output_path = PROJECT_ROOT / args.output
        save_report(report, output_path)

        print("")
        print("Evaluation complete.")
        print(f"Report saved to: {output_path}")

    finally:
        db.close()


if __name__ == "__main__":
    main()