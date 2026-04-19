import json
import os
from anthropic import Anthropic

_client = None


def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return None
        _client = Anthropic(api_key=api_key)
    return _client


def analyze_post(content: str) -> dict:
    client = get_client()
    if client is None:
        return {
            "category": "general",
            "analysis": "No API key found. Fallback used.",
            "summary": "No summary available.",
            "tags": ["general"]
        }

    model_name = os.getenv("ANTHROPIC_MODEL", "").strip()
    if not model_name:
        return {
            "category": "general",
            "analysis": "No model configured. Fallback used.",
            "summary": "No summary available.",
            "tags": ["general"]
        }

    prompt = f"""Analyze the following post.

Return ONLY valid JSON in this exact format:
{{
    "category": "one short category",
    "analysis": "short explanation (max 12 words)",
    "summary": "one sentence summary",
    "tags": ["tag1", "tag2", "tag3"]
}}

Rules:
- category must be short
- summary must be one sentence
- tags must be 2 to 5 short tags
- no markdown
- no code fences

Post:
{content}"""

    try:
        response = client.messages.create(
            model=model_name,
            max_tokens=180,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        text = response.content[0].text.strip()

        if text.startswith("```"):
            parts = text.split("```")
            if len(parts) > 1:
                text = parts[1]
                if text.startswith("json"):
                    text = text[4:]
                text = text.strip()

        result = json.loads(text)

        tags = result.get("tags", ["general"])
        if not isinstance(tags, list):
            tags = ["general"]

        return {
            "category": result.get("category", "general"),
            "analysis": result.get("analysis", "No analysis returned."),
            "summary": result.get("summary", "No summary returned."),
            "tags": tags
        }

    except json.JSONDecodeError:
        return {
            "category": "general",
            "analysis": "Could not parse Claude response.",
            "summary": "No summary available.",
            "tags": ["general"]
        }
    except Exception as e:
        return {
            "category": "general",
            "analysis": f"Claude API failed. {str(e)}",
            "summary": "No summary available.",
            "tags": ["general"]
        }