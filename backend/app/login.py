from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session
from database import get_db
from models import UserDB  # 👈 IMPORTANTE

router = APIRouter()

# 🔐 JWT config
SECRET_KEY = "sua_chave_secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 🔒 Segurança
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 📦 Schema
class User(BaseModel):
    email: str
    senha: str

# 🔑 Hash
def hash_password(senha: str):
    return pwd_context.hash(senha)

# 🔍 Verificar senha
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 🔐 Criar token
def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 🔓 Decodificar token
def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

# 🔑 Login
@router.post("/login")
def login(user: User, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not verify_password(user.senha, db_user.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_token({"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "message":"login realizado com sucesso!!🥳"
    }

# 🔒 Rota protegida
@router.get("/me")
def get_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    return {
        "email": payload.get("sub"),
        "msg": "Acesso autorizado"
    }