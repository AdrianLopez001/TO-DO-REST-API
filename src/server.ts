// ============================================================
// src/server.ts
// Entry point da aplicação — configuração e inicialização do Express
// ============================================================

import express, { Application, Request, Response } from "express";
import taskRoutes from "./routes/task.routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

// Lê a porta do arquivo .env ou usa 3000 como padrão
const PORT = process.env.PORT ?? 3000;

// Cria a instância principal do Express
const app: Application = express();

// -------------------------------------------------------
// Middlewares globais (executam em toda requisição)
// -------------------------------------------------------

// Permite que o Express leia JSON no body das requisições
app.use(express.json());

// Permite body em formato application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------
// Rota de health check
// -------------------------------------------------------
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "To-Do REST API está rodando! 🚀",
    version: "1.0.0",
    endpoints: {
      tasks: "/api/v1/tasks",
      docs: "Veja o README.md para a documentação completa",
    },
  });
});

// -------------------------------------------------------
// Rotas da API (prefixo /api/v1)
// -------------------------------------------------------

// Monta o router de tarefas em /api/v1/tasks
app.use("/api/v1/tasks", taskRoutes);

// -------------------------------------------------------
// Middlewares de erro (sempre por último!)
// -------------------------------------------------------

// Captura rotas que não existem
app.use(notFoundHandler);

// Captura todos os erros lançados nos controllers/services
app.use(errorHandler);

// -------------------------------------------------------
// Inicialização do servidor
// -------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   GET    http://localhost:${PORT}/api/v1/tasks`);
  console.log(`   GET    http://localhost:${PORT}/api/v1/tasks/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/v1/tasks`);
  console.log(`   PUT    http://localhost:${PORT}/api/v1/tasks/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/v1/tasks/:id/toggle`);
  console.log(`   DELETE http://localhost:${PORT}/api/v1/tasks/:id\n`);
});

export default app;
