from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import date, time, datetime, timedelta

from sqlalchemy.orm import Session
from database import get_db
from sqlalchemy import text

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError  # se decode_token estiver aqui ou em outro arquivo
from models import UserDB
from login import decode_token, security
from models import Agendamento  # Certifique-se que o nome do modelo no seu models.py é esse



router = APIRouter()

class AgendamentoCreate(BaseModel):
    data: date
    horario: time
    servico: str

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    user_id = payload.get("user_id")

    user = db.query(UserDB).filter(UserDB.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return user


@router.post("/agendar")
def agendar(
    agendamento: AgendamentoCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

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

    # 💾 inserir corretamente
    db.execute(
        text("""
            INSERT INTO agendamentos (data, horario, servico, user_id)
            VALUES (:data, :horario, :servico, :user_id)
        """),
        {
            "data": agendamento.data,
            "horario": agendamento.horario,
            "servico": agendamento.servico,
            "user_id": user.id
        }
    )

    db.commit()

    return {"message": "Agendamento criado com sucesso 🚀"}

@router.get("/agendamentos")
def listar_agendamentos(db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT 
                a.id,
                a.data,
                a.horario,
                a.servico,
                u.nome AS nome_usuario
            FROM agendamentos a
            JOIN users u ON u.id = a.user_id
        """)
    ).fetchall()

    agendamentos = []

    for row in result:
        item = dict(row._mapping)

        # data
        if item["data"]:
            item["data"] = item["data"].strftime("%d/%m/%Y")

        # horario
        item["horario"] = str(item["horario"])[:5]

        agendamentos.append(item)

    return agendamentos

@router.get("/meus-agendamentos")

def listar_meus_agendamentos(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    # Retorna apenas os agendamentos do usuário logado
    return db.query(Agendamento).filter(Agendamento.user_id == current_user.id).all()
@router.put("/editar/{agendamento_id}")


@router.put("/editar/{agendamento_id}")
def editar_agendamento(
    agendamento_id: int, 
    dados_novos: AgendamentoCreate, # Mudei de AgendamentoSchema para AgendamentoCreate
    current_user: UserDB = Depends(get_current_user), # Mudei de User para UserDB
    db: Session = Depends(get_db)
):
    agendamento = db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()
    
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    # REGRA: Admin pode tudo, usuário só o dele
    is_admin = getattr(current_user, 'is_admin', False) 
    
    if not is_admin:
        if agendamento.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Não autorizado")
        
        # REGRA DOS 2 DIAS:
        data_agendamento = datetime.combine(agendamento.data, agendamento.horario)
        if datetime.now() > (data_agendamento - timedelta(days=2)):
            raise HTTPException(
                status_code=400, 
                detail="Edição permitida apenas até 48h antes do horário agendado."
            )

    # Atualiza os dados
    agendamento.data = dados_novos.data
    agendamento.horario = dados_novos.horario
    agendamento.servico = dados_novos.servico
    db.commit()
    return {"message": "Atualizado com sucesso"}