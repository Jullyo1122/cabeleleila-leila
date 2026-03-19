from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import text
import bcrypt

from database import get_db

router = APIRouter()

# 📦 schema
class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    senha: str

# 🚀 endpoint
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # 🔍 verifica email
    result = db.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()

    if result:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # 🔒 hash senha
    senha_hash = bcrypt.hashpw(
        user.senha.encode(),
        bcrypt.gensalt()
    ).decode()

    # 💾 insert
    db.execute(
        text("""
            INSERT INTO users (nome, email, telefone, senha_hash)
            VALUES (:nome, :email, :telefone, :senha)
        """),
        {
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "senha": senha_hash
        }
    )

    db.commit()

    return {"message": "Usuário criado com sucesso 🚀"}