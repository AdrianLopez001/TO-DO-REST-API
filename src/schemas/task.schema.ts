// ============================================================
// src/schemas/task.schema.ts
// Schemas Zod para validação de dados de entrada
// ============================================================

import { z } from "zod";

/**
 * Schema Zod para criar uma tarefa.
 * O Zod valida o shape dos dados E os tipos ao mesmo tempo.
 *
 * z.string().min(1) → evita strings vazias
 * z.enum([...])     → aceita apenas os valores listados
 * .optional()       → campo não obrigatório
 * .default(...)     → valor padrão se não enviado
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório e não pode ser vazio.")
    .max(100, "O título não pode ultrapassar 100 caracteres."),

  description: z
    .string()
    .max(500, "A descrição não pode ultrapassar 500 caracteres.")
    .optional(),

  priority: z
    .enum({ low: "low", medium: "medium", high: "high" }, {
      error: () => "Prioridade inválida. Use: low, medium ou high.",
    })
    .default("medium"),
});

/**
 * Schema para atualização parcial de tarefa.
 * .partial() torna todos os campos opcionais — sem sobrescrever o schema base.
 * Adicionamos o campo 'completed' que não existe no createTaskSchema.
 */
export const updateTaskSchema = createTaskSchema
  .partial()
  .extend({
    completed: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "Envie pelo menos um campo para atualizar." }
  );

/**
 * Schema para validar o parâmetro :id nas rotas.
 * UUID v4 tem um formato muito específico que podemos validar com regex.
 */
export const taskIdSchema = z.object({
  id: z
    .string()
    .uuid("O ID fornecido não é um UUID válido."),
});

// Exportamos os tipos inferidos do Zod para usar no TypeScript
// Isso evita duplicar as definições de tipo
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
