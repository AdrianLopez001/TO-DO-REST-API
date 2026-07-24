// controller das tarefas
// aqui recebo as requisicoes e chamo o service

import { Request, Response } from "express"
import { ZodError } from "zod"
import { createTaskSchema, updateTaskSchema, taskIdSchema } from "../schemas/task.schema"
import { getAllTasks, getTaskById, createTask, updateTask, toggleTask, deleteTask } from "../services/task.service"

// listar todas as tarefas
export function listTasks(req: Request, res: Response) {
  try {
    let tasks = getAllTasks()
    res.status(200).json({
      success: true,
      data: tasks
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "erro no servidor"
    })
  }
}

// buscar tarefa por id
export function findTask(req: Request, res: Response) {
  try {
    // validar o id
    let validId: any
    try {
      validId = taskIdSchema.parse(req.params)
    } catch (err) {
      if (err instanceof ZodError) {
        let errorMessages = []
        for (let i = 0; i < err.issues.length; i++) {
          errorMessages.push(err.issues[i].message)
        }
        res.status(400).json({
          success: false,
          message: "id invalido",
          errors: errorMessages
        })
        return
      }
    }

    let task = getTaskById(validId.id)

    if (task === null) {
      res.status(404).json({
        success: false,
        message: "tarefa nao encontrada"
      })
      return
    }

    res.status(200).json({
      success: true,
      data: task
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "erro no servidor"
    })
  }
}

// criar tarefa
export function addTask(req: Request, res: Response) {
  try {
    // validar o body com zod
    let body: any
    try {
      body = createTaskSchema.parse(req.body)
    } catch (err) {
      if (err instanceof ZodError) {
        let errorMessages = []
        for (let i = 0; i < err.issues.length; i++) {
          errorMessages.push(err.issues[i].message)
        }
        res.status(400).json({
          success: false,
          message: "dados invalidos",
          errors: errorMessages
        })
        return
      }
    }

    // peguei cada campo separado porque nao sei passar o objeto inteiro
    let title = body.title
    let description = body.description || ""  // se nao vier, usa string vazia
    let priority = body.priority || "medium"

    let task = createTask(title, description, priority)

    res.status(201).json({
      success: true,
      data: task
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "erro ao criar tarefa"
    })
  }
}

// atualizar tarefa
export function editTask(req: Request, res: Response) {
  try {
    // validar id - mesma coisa do findTask, copiei aqui
    let validId: any
    try {
      validId = taskIdSchema.parse(req.params)
    } catch (err) {
      if (err instanceof ZodError) {
        let errorMessages = []
        for (let i = 0; i < err.issues.length; i++) {
          errorMessages.push(err.issues[i].message)
        }
        res.status(400).json({
          success: false,
          message: "id invalido",
          errors: errorMessages
        })
        return
      }
    }

    // validar body - mesma coisa do addTask, copiei aqui
    let body: any
    try {
      body = updateTaskSchema.parse(req.body)
    } catch (err) {
      if (err instanceof ZodError) {
        let errorMessages = []
        for (let i = 0; i < err.issues.length; i++) {
          errorMessages.push(err.issues[i].message)
        }
        res.status(400).json({
          success: false,
          message: "dados invalidos",
          errors: errorMessages
        })
        return
      }
    }

    let task = updateTask(validId.id, body.title, body.description, body.priority, body.completed)

    if (task === null) {
      res.status(404).json({
        success: false,
        message: "tarefa nao encontrada"
      })
      return
    }

    res.status(200).json({
      success: true,
      data: task
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "erro ao atualizar tarefa"
    })
  }
}

// alternar status da tarefa
export function toggleStatus(req: Request, res: Response) {
  try {
    // validar id - de novo a mesma coisa, nao sei como evitar isso
    let validId: any
    try {
      validId = taskIdSchema.parse(req.params)
    } catch (err) {
      if (err instanceof ZodError) {
        let errorMessages = []
        for (let i = 0; i < err.issues.length; i++) {
          errorMessages.push(err.issues[i].message)
        }
        res.status(400).json({
          success: false,
          message: "id invalido",
          errors: errorMessages
        })
        return
      }
    }

    let task = toggleTask(validId.id)

    if (task === null) {
      res.status(404).json({
        success: false,
        message: "tarefa nao encontrada"
      })
      return
    }

    res.status(200).json({
      success: true,
      data: task
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "erro no servidor"
    })
  }
}

// deletar tarefa
export function removeTask(req: Request, res: Response) {
  try {
    // validar id - mais uma vez copiando o mesmo bloco
    let validId: any
    try {
      validId = taskIdSchema.parse(req.params)
    } catch (err) {
      if (err instanceof ZodError) {
        let errorMessages = []
        for (let i = 0; i < err.issues.length; i++) {
          errorMessages.push(err.issues[i].message)
        }
        res.status(400).json({
          success: false,
          message: "id invalido",
          errors: errorMessages
        })
        return
      }
    }

    let deleted = deleteTask(validId.id)

    if (deleted === false) {
      res.status(404).json({
        success: false,
        message: "tarefa nao encontrada"
      })
      return
    }

    res.status(204).send()
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "erro ao deletar tarefa"
    })
  }
}
