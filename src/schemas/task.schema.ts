// validacao com zod
// zod serve pra validar os dados que chegam no body

import { z } from "zod"

// schema pra criar tarefa
export const createTaskSchema = z.object({
  title: z.string().min(1, "titulo nao pode ser vazio").max(100, "titulo muito grande"),
  description: z.string().max(500, "descricao muito grande").optional(),
  priority: z.string().optional()  // nao coloquei enum porque nao sei como fazer no zod v4
})

// schema pra atualizar - copiei o de cima e adicionei o completed
// acho que tem um jeito melhor mas nao sei qual
export const updateTaskSchema = z.object({
  title: z.string().min(1, "titulo nao pode ser vazio").max(100, "titulo muito grande").optional(),
  description: z.string().max(500, "descricao muito grande").optional(),
  priority: z.string().optional(),
  completed: z.boolean().optional()
})

// pra validar o id que vem na url
export const taskIdSchema = z.object({
  id: z.string().uuid("id invalido")
})
