from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter

class login(BaseModel):
    email: str
    senha: str


