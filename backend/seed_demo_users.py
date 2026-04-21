from app.db.seed_data import seed_demo_users
from app.db.session import SessionLocal


def main() -> None:
    db = SessionLocal()
    try:
        messages = seed_demo_users(db)
    finally:
        db.close()

    print("Demo users are ready:")
    for message in messages:
        print(f"- {message}")


if __name__ == "__main__":
    main()
