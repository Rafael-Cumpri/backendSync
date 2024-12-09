# Backend Sync

Este é o backend do projeto **Sync**, uma API desenvolvida para gerenciar funcionalidades específicas do sistema Sync. O projeto foi construído com foco na simplicidade, eficiência e fácil manutenção.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Express**: Framework web para criar e gerenciar rotas.
- **PostgreSQL**: Banco de dados relacional para persistência de dados.
- **Sequelize**: ORM para simplificar as interações com o banco de dados.

## 📦 Estrutura do Projeto

```plaintext
backendSync/
├── src/
│   ├── controllers/       # Lógica de controle das rotas
│   ├── models/            # Modelos de dados (ORM)
│   ├── routes/            # Arquivos de definição das rotas
│   ├── config/            # Configurações, como credenciais do banco de dados
│   ├── migrations/        # Arquivos para versionamento do banco de dados
│   └── app.js             # Configuração inicial do servidor
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências e scripts do projeto
└── README.md              # Documentação do projet
