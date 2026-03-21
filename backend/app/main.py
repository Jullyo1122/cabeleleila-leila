from fastapi import FastAPI
from cadastro import router as router_cadastro
from login import router as router_login
from fastapi.middleware.cors import CORSMiddleware
from agendamento import router as router_agendamento

app = FastAPI()

# CORS para permitir o Angular acessar
origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inclui os routers com prefixos
app.include_router(router_cadastro, prefix="/cadastro", tags=["Cadastro"])
app.include_router(router_login, prefix="/login", tags=["Login"])
app.include_router(router_agendamento, prefix="/agendamento", tags=["Agendamento"])


