// servidor principal
// aqui configuro o express e subo o servidor

import express from "express"
import taskRoutes from "./routes/task.routes"
import { notFoundHandler } from "./middlewares/errorHandler"

const app = express()
const PORT = 3000  // coloquei fixo por enquanto, nao sei usar .env ainda

// middleware pra conseguir ler o json do body
app.use(express.json())

// rota inicial so pra testar se ta funcionando
app.get("/", (req, res) => {
  res.json({ message: "api funcionando" })
})

// rotas das tarefas
app.use("/api/v1/tasks", taskRoutes)

// rota nao encontrada - tem que ficar no final
app.use(notFoundHandler)

// subir o servidor
app.listen(PORT, () => {
  console.log("servidor rodando na porta " + PORT)
  console.log("acesse: http://localhost:" + PORT)
})

export default app
