// nao sei se precisa de um middleware de erro separado
// mas vi em um tutorial que eh boa pratica
// por enquanto to tratando os erros direto no controller

import { Request, Response } from "express"

// rota nao encontrada
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: "rota nao encontrada"
  })
}
