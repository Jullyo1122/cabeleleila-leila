CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    servico VARCHAR(100) NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);