from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import date, time

from sqlalchemy.orm import Session
from database import get_db
from sqlalchemy import text


router = APIRouter()

class AgendamentoCreate(BaseModel):
    data: date
    horario: time
    servico: str


@router.post("/agendar")
def agendar(agendamento: AgendamentoCreate, db: Session = Depends(get_db)):

    # 🔍 verificar conflito
    conflito = db.execute(
        text("""
            SELECT id FROM agendamentos
            WHERE data = :data AND horario = :horario
        """),
        {
            "data": agendamento.data,
            "horario": agendamento.horario
        }
    ).fetchone()

    if conflito:
        raise HTTPException(status_code=400, detail="Horário já ocupado")

    # 💾 inserir
    db.execute(
        text("""
            INSERT INTO agendamentos (data, horario, servico)
            VALUES (:data, :horario, :servico)
        """),
        {
            "data": agendamento.data,
            "horario": agendamento.horario,
            "servico": agendamento.servico
        }
    )

    db.commit()

    return {"message": "Agendamento criado com sucesso 🚀"}