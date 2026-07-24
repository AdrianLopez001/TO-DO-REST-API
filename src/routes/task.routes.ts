// ============================================================
// src/routes/task.routes.ts
// Definição das rotas da API de tarefas
// ============================================================

import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from "../controllers/task.controller";

/**
 * Router do Express: agrupa todas as rotas de /tasks.
 * Será montado no servidor com o prefixo /api/v1/tasks.
 *
 * Tabela de Rotas:
 * ┌──────────┬──────────────────┬──────────────────────────────┐
 * │ Método   │ Caminho          │ Ação                         │
 * ├──────────┼──────────────────┼──────────────────────────────┤
 * │ GET      │ /                │ Listar todas as tarefas      │
 * │ GET      │ /:id             │ Buscar tarefa por ID         │
 * │ POST     │ /                │ Criar nova tarefa            │
 * │ PUT      │ /:id             │ Atualizar tarefa             │
 * │ PATCH    │ /:id/toggle      │ Alternar status              │
 * │ DELETE   │ /:id             │ Remover tarefa               │
 * └──────────┴──────────────────┴──────────────────────────────┘
 */
const router = Router();

// Rotas de coleção (sem ID)
router.get("/", getAllTasks);
router.post("/", createTask);

// Rotas de recurso individual (com ID)
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

export default router;
