// ============================================================
// src/controllers/task.controller.ts
// Camada de controle: recebe a requisição, valida, chama o serviço
// ============================================================

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { taskService } from "../services/task.service";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from "../schemas/task.schema";
import { ApiResponse, Task } from "../types/task.types";

/**
 * Função auxiliar para formatar respostas de sucesso.
 * Garante que todas as respostas seguem o mesmo padrão ApiResponse<T>.
 */
function success<T>(res: Response, data: T, statusCode = 200): Response {
  const response: ApiResponse<T> = { success: true, data };
  return res.status(statusCode).json(response);
}

/**
 * Função auxiliar para formatar erros de validação Zod.
 * Extrai as mensagens de erro de cada campo e retorna array de strings.
 */
function formatZodError(error: ZodError): string[] {
  return error.issues.map((e) => {
    const field = e.path.join(".") || "body";
    return `[${field}]: ${e.message}`;
  });
}

// -------------------------------------------------------
// GET /tasks — Listar todas as tarefas
// -------------------------------------------------------
export function getAllTasks(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const tasks = taskService.getAll();
    success<Task[]>(res, tasks);
  } catch (error) {
    next(error); // Passa para o errorHandler global
  }
}

// -------------------------------------------------------
// GET /tasks/:id — Buscar tarefa por ID
// -------------------------------------------------------
export function getTaskById(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Valida o parâmetro :id com o schema Zod
    const { id } = taskIdSchema.parse(req.params);
    const task = taskService.getById(id);
    success<Task>(res, task);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(<ApiResponse<null>>{
        success: false,
        errors: formatZodError(error),
      });
      return;
    }
    next(error);
  }
}

// -------------------------------------------------------
// POST /tasks — Criar nova tarefa
// -------------------------------------------------------
export function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // .parse() lança ZodError se a validação falhar
    const input = createTaskSchema.parse(req.body);
    const task = taskService.create(input);

    // Status 201 Created para recursos recém-criados
    success<Task>(res, task, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(<ApiResponse<null>>{
        success: false,
        message: "Dados inválidos.",
        errors: formatZodError(error),
      });
      return;
    }
    next(error);
  }
}

// -------------------------------------------------------
// PUT /tasks/:id — Atualizar tarefa por ID
// -------------------------------------------------------
export function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { id } = taskIdSchema.parse(req.params);
    const input = updateTaskSchema.parse(req.body);
    const task = taskService.update(id, input);
    success<Task>(res, task);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(<ApiResponse<null>>{
        success: false,
        message: "Dados inválidos.",
        errors: formatZodError(error),
      });
      return;
    }
    next(error);
  }
}

// -------------------------------------------------------
// PATCH /tasks/:id/toggle — Alternar status completed
// -------------------------------------------------------
export function toggleTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { id } = taskIdSchema.parse(req.params);
    const task = taskService.toggle(id);
    success<Task>(res, task);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(<ApiResponse<null>>{
        success: false,
        errors: formatZodError(error),
      });
      return;
    }
    next(error);
  }
}

// -------------------------------------------------------
// DELETE /tasks/:id — Remover tarefa por ID
// -------------------------------------------------------
export function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { id } = taskIdSchema.parse(req.params);
    taskService.delete(id);

    // Status 204 No Content: sucesso sem corpo de resposta
    res.status(204).send();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(<ApiResponse<null>>{
        success: false,
        errors: formatZodError(error),
      });
      return;
    }
    next(error);
  }
}
