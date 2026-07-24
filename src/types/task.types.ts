// tipos da tarefa
// aprendi que interface define a forma do objeto

export interface Task {
  id: string
  title: string
  description: string  // tentei colocar opcional mas deu erro, deixei string mesmo
  completed: boolean
  priority: string     // era pra ser enum mas nao entendi direito, string resolve
  createdAt: string    // usei string porque Date dava problema na hora de retornar json
  updatedAt: string
}

// interface separada pra criar tarefa
// nao sei se precisa mesmo mas vi em um tutorial
export interface CreateTaskData {
  title: string
  description: string
  priority: string
}

// interface pra atualizar
// copiei a de cima e mudei o nome
export interface UpdateTaskData {
  title: string
  description: string
  priority: string
  completed: boolean
}
