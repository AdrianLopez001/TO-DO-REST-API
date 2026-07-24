// ============================================================
// src/services/task.service.ts
// Camada de serviço: regras de negócio + storage em memória
// ============================================================

import { v4 as uuidv4 } from "uuid";
import { Task, Priority } from "../types/task.types";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";

/**
 * Classe de erro customizada para erros de negócio.
 * Isso permite distinguir erros esperados (ex: "não encontrado")
 * de erros inesperados (ex: falha de rede) no errorHandler.
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * TaskService: responsável por toda a lógica de negócio de tarefas.
 *
 * Em vez de um banco de dados, usamos um array em memória.
 * Isso é suficiente para aprender os conceitos de CRUD sem
 * a complexidade de configurar um banco agora.
 *
 * Padrão Singleton: garantimos que só existe uma instância
 * do serviço (e portanto um único array de tarefas).
 */
class TaskService {
  // Array privado que simula o banco de dados em memória
  private tasks: Task[] = [];

  // -------------------------------------------------------
  // READ: Listar todas as tarefas
  // -------------------------------------------------------
  getAll(): Task[] {
    // Retorna uma cópia do array para evitar mutações externas
    return [...this.tasks];
  }

  // -------------------------------------------------------
  // READ: Buscar tarefa por ID
  // -------------------------------------------------------
  getById(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) {
      // Lança nosso AppError customizado com status 404
      throw new AppError(`Tarefa com ID "${id}" não encontrada.`, 404);
    }

    return task;
  }

  // -------------------------------------------------------
  // CREATE: Criar nova tarefa
  // -------------------------------------------------------
  create(input: CreateTaskInput): Task {
    const now = new Date();

    const newTask: Task = {
      id: uuidv4(),                              // Gera UUID único
      title: input.title,
      description: input.description,
      completed: false,                          // Sempre começa incompleta
      priority: input.priority as Priority,      // Cast seguro após validação Zod
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  // -------------------------------------------------------
  // UPDATE: Atualizar tarefa por ID (atualização parcial)
  // -------------------------------------------------------
  update(id: string, input: UpdateTaskInput): Task {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw new AppError(`Tarefa com ID "${id}" não encontrada.`, 404);
    }

    // Spread operator: mantém todos os campos existentes e sobrescreve só os enviados
    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...input,
      priority: (input.priority ?? this.tasks[taskIndex].priority) as Priority,
      updatedAt: new Date(), // Sempre atualiza o timestamp
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  // -------------------------------------------------------
  // PATCH: Alternar status completed (toggle)
  // -------------------------------------------------------
  toggle(id: string): Task {
    const task = this.getById(id); // Reutiliza getById (DRY principle)

    return this.update(id, { completed: !task.completed });
  }

  // -------------------------------------------------------
  // DELETE: Remover tarefa por ID
  // -------------------------------------------------------
  delete(id: string): void {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw new AppError(`Tarefa com ID "${id}" não encontrada.`, 404);
    }

    // splice remove 1 elemento a partir do índice encontrado
    this.tasks.splice(taskIndex, 1);
  }
}

// Exporta uma única instância compartilhada (Singleton)
export const taskService = new TaskService();
