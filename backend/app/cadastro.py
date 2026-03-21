from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import text
import bcrypt
from database import get_db

router = APIRouter()

class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    senha: str

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # 🔍 Verifica se o email já existe
    result = db.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()

    if result:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # 🔒 Hash da senha
    senha_hash = bcrypt.hashpw(
        user.senha.encode(),
        bcrypt.gensalt()
    ).decode()

    # 👑 Lógica para definir quem é Admin (coloque seu email principal aqui)
    is_admin = True if user.email == "jullyo@example.com" else False

    # 💾 Insert atualizado com a coluna is_admin
    db.execute(
        text("""
            INSERT INTO users (nome, email, telefone, senha_hash, is_admin)
            VALUES (:nome, :email, :telefone, :senha, :is_admin)
        """),
        {
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "senha": senha_hash,
            "is_admin": is_admin
        }
    )

    db.commit()
    return {"message": "Usuário criado com sucesso 🚀", "admin": is_admin}