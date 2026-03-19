from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:Jullyocris123#@localhost:3306/cabeleleila"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# função pra pegar conexão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


