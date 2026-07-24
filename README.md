# To-Do REST API 📋

API REST completa de lista de tarefas construída com **Node.js + TypeScript + Express + Zod**.

> Projeto da **Etapa 1** do plano de estudos — foco em fixar conceitos de rotas CRUD, tipagem TypeScript e validação de dados.

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js | Runtime JavaScript |
| TypeScript | Tipagem estática |
| Express | Framework HTTP |
| Zod | Validação de dados |
| UUID | Geração de IDs únicos |
| ts-node-dev | Hot-reload em desenvolvimento |

---

## 🚀 Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/AdrianLopez001/TO-DO-REST-API.git
cd TO-DO-REST-API

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor em modo desenvolvimento (com hot-reload)
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

---

## 📋 Endpoints da API

Base URL: `http://localhost:3000/api/v1`

### Listar todas as tarefas
```http
GET /tasks
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-aqui",
      "title": "Estudar TypeScript",
      "description": "Focar em generics e utility types",
      "completed": false,
      "priority": "high",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Buscar tarefa por ID
```http
GET /tasks/:id
```

---

### Criar tarefa
```http
POST /tasks
Content-Type: application/json

{
  "title": "Estudar Express",
  "description": "Middlewares e roteamento",
  "priority": "high"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | string | ✅ | 1–100 caracteres |
| `description` | string | ❌ | Até 500 caracteres |
| `priority` | `low` \| `medium` \| `high` | ❌ | Padrão: `medium` |

---

### Atualizar tarefa
```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Novo título",
  "priority": "low"
}
```

---

### Alternar status (concluída/pendente)
```http
PATCH /tasks/:id/toggle
```

---

### Remover tarefa
```http
DELETE /tasks/:id
```

Retorna `204 No Content` em caso de sucesso.

---

## 🏗️ Arquitetura

```
src/
├── controllers/     # Recebe req/res, valida com Zod, chama o service
├── routes/          # Define os endpoints e mapeia para controllers
├── services/        # Regras de negócio + storage em memória (array)
├── schemas/         # Schemas Zod para validação de entrada
├── types/           # Interfaces e tipos TypeScript (Task, DTOs, ApiResponse)
├── middlewares/     # Error handler global e 404 handler
└── server.ts        # Entry point — configuração do Express
```

### Fluxo de uma requisição:
```
HTTP Request
    ↓
Express Router (routes/)
    ↓
Zod Validation (schemas/)
    ↓
Controller (controllers/)
    ↓
Service (services/)     ← Regras de negócio + dados em memória
    ↓
HTTP Response (JSON)
```

---

## 📝 Modelo de Dados

```typescript
interface Task {
  id: string;                          // UUID v4 gerado automaticamente
  title: string;                       // Título da tarefa
  description?: string;               // Descrição opcional
  completed: boolean;                  // Status (sempre inicia como false)
  priority: 'low' | 'medium' | 'high'; // Prioridade
  createdAt: Date;                     // Timestamp de criação
  updatedAt: Date;                     // Timestamp da última atualização
}
```

---

## ✅ Conceitos praticados

- [x] Rotas HTTP: GET, POST, PUT, PATCH, DELETE
- [x] Interfaces e enums TypeScript
- [x] Tipos genéricos (`ApiResponse<T>`)
- [x] Utility types: `Omit<>`, `Partial<>`
- [x] Validação de dados com Zod
- [x] Tipos inferidos do Zod (`z.infer<>`)
- [x] Arquitetura em camadas (routes → controllers → services)
- [x] Classe de erro customizada (`AppError`)
- [x] Middleware global de erros
- [x] Padrão Singleton
- [x] Storage em memória com array
