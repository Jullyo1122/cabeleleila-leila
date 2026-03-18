from fastapi import FastAPI
from cadastro import router as router_cadastro
from login import router as router_login

app = FastAPI()


# Inclui os routers com prefixos
app.include_router(router_cadastro, prefix="/cadastro", tags=["Cadastro"])
app.include_router(router_login, prefix="/login", tags=["Login"])


