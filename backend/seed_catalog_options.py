from app.db.seed_data import seed_demo_extra_services, seed_demo_packaging_options
from app.db.session import SessionLocal



def main() -> None:
    db = SessionLocal()
    try:
        packaging_messages = seed_demo_packaging_options(db)
        extra_messages = seed_demo_extra_services(db)
    finally:
        db.close()

    print("Catalog options are ready:")
    for message in packaging_messages:
        print(f"- {message}")
    for message in extra_messages:
        print(f"- {message}")


if __name__ == "__main__":
    main()
