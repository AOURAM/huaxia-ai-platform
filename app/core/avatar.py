from urllib.parse import quote


DICEBEAR_BASE_URL = "https://api.dicebear.com/9.x"

ALLOWED_AVATAR_STYLES = {
    "adventurer",
    "avataaars",
    "bottts",
    "lorelei",
    "thumbs",
    "personas",
    "initials",
}


DEFAULT_AVATAR_STYLE = "adventurer"


def build_default_avatar_seed(user_id: int) -> str:
    return f"user-{user_id}"


def build_avatar_url(style: str | None, seed: str | None) -> str:
    avatar_style = style or DEFAULT_AVATAR_STYLE

    if avatar_style not in ALLOWED_AVATAR_STYLES:
        avatar_style = DEFAULT_AVATAR_STYLE

    safe_seed = quote((seed or "huaxia-user").strip())

    return f"{DICEBEAR_BASE_URL}/{avatar_style}/svg?seed={safe_seed}&size=128&radius=50"