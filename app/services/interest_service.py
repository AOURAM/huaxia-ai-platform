from sqlalchemy.orm import Session
from app.models.user_interest import UserInterest


def save_user_interests(db: Session, user_id, category_ids):
    # delete old onboarding interests
    db.query(UserInterest).filter(UserInterest.user_id == user_id).delete()

    for cat_id in category_ids:
        db.add(UserInterest(
            user_id=user_id,
            category_id=cat_id,
            weight=1.0,
            source="onboarding"
        ))

    db.commit()