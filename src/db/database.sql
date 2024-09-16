-- nome do banco
CREATE DATABASE backendsync;

-- acesso
\c backendsync;

-- Criação das tabelas necessarias

-- Criação da tabela ambientes ( produto )
CREATE TABLE ambientes (
    id VARCHAR(255) PRIMARY KEY,
    numero_ambiente INT UNIQUE,
    caminho_imagem TEXT,
    chave BOOLEAN,
    capacidadeAlunos INT NOT NULL,
    tipodoambiente VARCHAR(255) NOT NULL,
    ar_condicionado BOOLEAN,
    ventilador BOOLEAN,
    wifi BOOLEAN,
    projetor BOOLEAN,
    chave_eletronica BOOLEAN,
    maquinas INT,
    categoria VARCHAR(255)
);

-- Criação de tabela usuarios ( clientes )
CREATE TABLE usuarios (
    nif VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    caminho_imagem TEXT,
    descriptor TEXT,
    notificacao BOOLEAN,
    notiwhere VARCHAR(100),
    telefone VARCHAR(255),
    email VARCHAR(255),
    adm BOOLEAN,
    ambientes VARCHAR(255) REFERENCES ambientes(id),
    sala_fixa VARCHAR(255) REFERENCES ambientes(id)
);

-- Criação de tabela chaves ( requesito )
CREATE TABLE chaves (
    id INT PRIMARY KEY,
    disponivel BOOLEAN,
    salas VARCHAR(255) REFERENCES ambientes(id)
);

-- Criação da tabela historico
CREATE TABLE historico (
    id SERIAL PRIMARY KEY,
    data_inicio DATE,
    data_fim DATE,
    funcionario VARCHAR(255) REFERENCES usuarios(nif),
    ambiente VARCHAR(255) REFERENCES ambientes(id)
);