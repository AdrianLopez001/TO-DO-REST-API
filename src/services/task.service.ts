// service das tarefas
// aqui fica a logica de criar, buscar, deletar etc

import { v4 as uuidv4 } from "uuid"
import { Task } from "../types/task.types"

// array que guarda as tarefas na memoria
// quando o servidor reiniciar perde tudo, mas tudo bem por enquanto
let tasks: Task[] = []

// buscar todas as tarefas
export function getAllTasks() {
  return tasks
}

// buscar uma tarefa pelo id
export function getTaskById(id: string) {
  let task = null

  // percorrer o array pra achar a tarefa
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      task = tasks[i]
    }
  }

  return task  // retorna null se nao achar, trato no controller
}

// criar uma nova tarefa
export function createTask(title: string, description: string, priority: string) {
  // validar prioridade aqui tambem por garantia
  // mesmo o zod ja validando, nao custa checar de novo
  let priorityFinal = "medium"
  if (priority === "low") {
    priorityFinal = "low"
  } else if (priority === "medium") {
    priorityFinal = "medium"
  } else if (priority === "high") {
    priorityFinal = "high"
  } else {
    priorityFinal = "medium" // se vier errado coloca medium como padrao
  }

  let newTask: Task = {
    id: uuidv4(),
    title: title,
    description: description,
    completed: false,
    priority: priorityFinal,
    createdAt: new Date().toISOString(),   // converti pra string aqui
    updatedAt: new Date().toISOString()
  }

  tasks.push(newTask)

  return newTask
}

// atualizar uma tarefa
export function updateTask(id: string, title: string, description: string, priority: string, completed: boolean) {
  let taskIndex = -1

  // procurar o indice da tarefa
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      taskIndex = i
    }
  }

  if (taskIndex === -1) {
    return null  // nao achei a tarefa
  }

  // atualizar os campos um por um
  // nao sei usar spread operator direito entao fiz assim
  if (title !== undefined && title !== "") {
    tasks[taskIndex].title = title
  }
  if (description !== undefined) {
    tasks[taskIndex].description = description
  }
  if (priority !== undefined && priority !== "") {
    // validar prioridade de novo
    if (priority === "low" || priority === "medium" || priority === "high") {
      tasks[taskIndex].priority = priority
    }
  }
  if (completed !== undefined) {
    tasks[taskIndex].completed = completed
  }

  tasks[taskIndex].updatedAt = new Date().toISOString()

  return tasks[taskIndex]
}

// alternar o completed da tarefa
export function toggleTask(id: string) {
  let taskIndex = -1

  // procurar o indice da tarefa - mesma logica do updateTask, nao sei como reaproveitar
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      taskIndex = i
    }
  }

  if (taskIndex === -1) {
    return null
  }

  // inverter o completed
  if (tasks[taskIndex].completed === true) {
    tasks[taskIndex].completed = false
  } else {
    tasks[taskIndex].completed = true
  }

  tasks[taskIndex].updatedAt = new Date().toISOString()

  return tasks[taskIndex]
}

// deletar uma tarefa
export function deleteTask(id: string) {
  let taskIndex = -1

  // procurar o indice - copio essa logica em todo lugar porque nao sei criar funcao auxiliar pra isso
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      taskIndex = i
    }
  }

  if (taskIndex === -1) {
    return false  // nao achou
  }

  tasks.splice(taskIndex, 1)
  return true  // deu certo
}
