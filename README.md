# 💇‍♀️ Sistema de Agendamento - Cabeleleila Leila

Sistema web para gerenciamento de agendamentos de um salão de beleza, permitindo cadastro de usuários, login e marcação de horários.

---

## 🚀 Tecnologias utilizadas

### Backend

* Python
* FastAPI
* SQLAlchemy
* MySQL

### Frontend

* Angular
* Angular Material

---

## 📁 Estrutura do Projeto

```
backend/
 └── app/
     ├── agendamento.py
     ├── cadastro.py
     ├── login.py
     ├── database.py
     ├── models.py
     └── main.py

database/
 ├── schema.sql
 └── seed.sql (opcional)

frontend/
 └── ui-cabeleleila/
```

---

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

* Python 3.10+
* Node.js (versão LTS)
* MySQL
* Angular CLI

---

## 🗃️ Configuração do Banco de Dados

1. Crie um banco no MySQL:

```sql
CREATE DATABASE cabeleleila;
```

2. Execute o script de criação:

```bash
mysql -u root -p cabeleleila < database/schema.sql
```

3. (Opcional) Popular com dados iniciais:

```bash
mysql -u root -p cabeleleila < database/seed.sql
```

---

## 🔧 Configuração do Backend (FastAPI)

1. Acesse a pasta:

```bash
cd backend/app
```

2. Crie um ambiente virtual:

```bash
python -m venv venv
```

3. Ative o ambiente:

* Windows:

```bash
venv\Scripts\activate
```

* Linux/Mac:

```bash
source venv/bin/activate
```

4. Instale as dependências:

```bash
pip install fastapi uvicorn sqlalchemy pymysql python-jose passlib[bcrypt]
```

5. Configure a conexão com o banco no arquivo `database.py`:

```python
DATABASE_URL = "mysql+pymysql://root:SUA_SENHA@localhost/cabeleleila"
```

6. Rode o servidor:

```bash
uvicorn main:app --reload
```

👉 Backend disponível em:

```
http://localhost:8000
```

👉 Documentação automática:

```
http://localhost:8000/docs
```

---

## 🎨 Configuração do Frontend (Angular)

1. Acesse a pasta:

```bash
cd frontend/ui-cabeleleila
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o projeto:

```bash
ng serve
```

👉 Frontend disponível em:

```
http://localhost:4200
```

---

## 🔐 Funcionalidades

*  Cadastro de usuários
*  Login com autenticação JWT
*  Agendamentos
*  Listagem de agendamentos
*  Controle de usuário administrador

---

## ⚠️ Observações

* O backend deve estar rodando antes do frontend
* MySQL deve está ativo
* Verifique se a porta 8000 não está sendo usada
 
---

## 👨‍💻 Autor

Projeto desenvolvido para fins acadêmicos e demonstração técnica.
