from sqlalchemy import Column, Integer, String, Boolean, Date, Time, ForeignKey
from database import engine
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100)) # Importante para o seu JOIN funcionar
    email = Column(String(100), unique=True)
    senha_hash = Column(String(255))
    is_admin = Column(Boolean, default=False) # 👈 Nova coluna para controle de acesso

class Agendamento(Base): # 👈 Adicione o modelo de Agendamento aqui também para usar o ORM
    __tablename__ = "agendamentos"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date)
    horario = Column(Time)
    servico = Column(String(100))
    user_id = Column(Integer, ForeignKey("users.id"))

Base.metadata.create_all(bind=engine)