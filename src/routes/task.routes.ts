// rotas das tarefas
// importei o Router do express igual vi no tutorial

import { Router } from "express"
import { listTasks, findTask, addTask, editTask, toggleStatus, removeTask } from "../controllers/task.controller"

const router = Router()

// rotas
router.get("/", listTasks)
router.get("/:id", findTask)
router.post("/", addTask)
router.put("/:id", editTask)
router.patch("/:id/toggle", toggleStatus)
router.delete("/:id", removeTask)

export default router
