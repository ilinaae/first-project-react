from app.db.seed_data import seed_demo_products
from app.db.session import SessionLocal



def main() -> None:
    db = SessionLocal()
    try:
        messages = seed_demo_products(db)
    finally:
        db.close()

    print("Demo products are ready:")
    for message in messages:
        print(f"- {message}")


if __name__ == "__main__":
    main()
