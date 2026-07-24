// ============================================================
// src/types/task.types.ts
// Definição dos tipos e interfaces TypeScript para a Task
// ============================================================

/**
 * Prioridades possíveis para uma tarefa.
 * Usando um enum de string para legibilidade nas respostas JSON.
 */
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

/**
 * Interface principal que representa uma Tarefa no sistema.
 * Todos os campos são tipados explicitamente.
 */
export interface Task {
  id: string;
  title: string;
  description?: string; // campo opcional (?)
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO (Data Transfer Object) para criar uma nova tarefa.
 * Omitimos os campos que o servidor gera automaticamente.
 */
export type CreateTaskDTO = Omit<Task, "id" | "completed" | "createdAt" | "updatedAt">;

/**
 * DTO para atualizar uma tarefa existente.
 * Partial<> torna todos os campos opcionais — só enviamos o que muda.
 * Omitimos os campos internos que não devem ser alterados pelo cliente.
 */
export type UpdateTaskDTO = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;

/**
 * Formato padrão de resposta da API.
 * Generic<T> permite reutilizar para qualquer tipo de dado.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
