# Finance Dashboard

Dashboard de finanças pessoais para controlar contas, categorias, transações e metas de gastos, com gráficos de análise por período e categoria.

Projeto full-stack construído para portfólio:

- **Backend:** Java 21 + Spring Boot 3 (Web, Security, Data JPA, Validation), autenticação JWT, Flyway para migrations.
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, React Query para dados assíncronos, Recharts para gráficos.
- **Banco de dados:** MySQL 8.

## Funcionalidades

- Cadastro/login com autenticação JWT (dados isolados por usuário).
- CRUD de contas (corrente, poupança, cartão, dinheiro, investimento) com saldo calculado a partir das transações.
- CRUD de categorias de receita/despesa com cor personalizada.
- CRUD de transações com filtro por período.
- Metas mensais de gasto por categoria, com indicador de progresso (em dia / atenção / estourou).
- Painel com resumo do mês (receitas, despesas, saldo, patrimônio líquido), gráfico de receitas x despesas dos últimos 6 meses e ranking de despesas por categoria.

## Estrutura

```
dashboard/
├── backend/      # API REST em Spring Boot
├── frontend/     # Aplicação Next.js
└── docker-compose.yml
```

## Como rodar

### Opção 1: Docker Compose (recomendado)

Requer Docker e Docker Compose instalados.

```bash
docker compose up --build
```

- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- MySQL: localhost:3306 (usuário `finance_user`, senha `finance_pass`)

### Opção 2: rodar localmente

Requer Java 21+, Maven 3.9+, Node 20+ e um MySQL local.

**1. Banco de dados**

Crie o banco e o usuário no MySQL:

```sql
CREATE DATABASE finance_dashboard;
CREATE USER 'finance_user'@'%' IDENTIFIED BY 'finance_pass';
GRANT ALL PRIVILEGES ON finance_dashboard.* TO 'finance_user'@'%';
```

**2. Backend**

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. As tabelas são criadas automaticamente pelo Flyway na primeira execução.

Variáveis de ambiente (opcionais, têm valores padrão para desenvolvimento local):

| Variável | Descrição | Padrão |
|---|---|---|
| `DB_URL` | URL JDBC do MySQL | `jdbc:mysql://localhost:3306/finance_dashboard...` |
| `DB_USERNAME` | Usuário do banco | `finance_user` |
| `DB_PASSWORD` | Senha do banco | `finance_pass` |
| `JWT_SECRET` | Chave usada para assinar os tokens JWT | chave de desenvolvimento (troque em produção) |
| `JWT_EXPIRATION_MINUTES` | Validade do token | `1440` (24h) |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas para CORS | `http://localhost:3000` |

**3. Frontend**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

A aplicação sobe em `http://localhost:3000`.

## Testes

```bash
cd backend
mvn test
```

## Decisões técnicas

- **JWT stateless**, sem sessão no servidor: cada request autenticada envia `Authorization: Bearer <token>`.
- **Isolamento por usuário**: todas as consultas do backend filtram por `user_id`, garantido nos repositórios e serviços.
- **Flyway** versiona o schema do banco (`backend/src/main/resources/db/migration`), evitando depender de `ddl-auto=update` em produção.
- **Saldo de conta** é calculado dinamicamente (saldo inicial + soma das transações), não armazenado, evitando inconsistência.
- Paleta de cores dos gráficos segue uma ordem categórica fixa validada para contraste e daltonismo.
