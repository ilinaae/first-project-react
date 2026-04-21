from app.db.seed_data import seed_demo_orders
from app.db.session import SessionLocal



def main() -> None:
    db = SessionLocal()
    try:
        messages = seed_demo_orders(db)
    finally:
        db.close()

    print("Demo orders are ready:")
    for message in messages:
        print(f"- {message}")


if __name__ == "__main__":
    main()
