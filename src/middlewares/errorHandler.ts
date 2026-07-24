// ============================================================
// src/middlewares/errorHandler.ts
// Middleware global de tratamento de erros do Express
// ============================================================

import { Request, Response, NextFunction } from "express";
import { AppError } from "../services/task.service";
import { ApiResponse } from "../types/task.types";

/**
 * Middleware de erro global do Express.
 *
 * Express reconhece um middleware de erro pela assinatura de 4 parâmetros:
 * (err, req, res, next) — diferente dos middlewares normais com 3.
 *
 * Deve ser registrado DEPOIS de todas as rotas no server.ts.
 *
 * Fluxo:
 * 1. Se for AppError (erro de negócio), usa o statusCode definido nele
 * 2. Se for erro desconhecido, retorna 500 sem expor detalhes internos
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  // Erro de negócio conhecido (ex: "não encontrado", "dados inválidos")
  if (err instanceof AppError) {
    res.status(err.statusCode).json(<ApiResponse<null>>{
      success: false,
      message: err.message,
    });
    return;
  }

  // Erro inesperado — nunca expor stack trace em produção
  res.status(500).json(<ApiResponse<null>>{
    success: false,
    message: "Erro interno do servidor. Tente novamente mais tarde.",
  });
}

/**
 * Middleware para rotas não encontradas (404).
 * Registrado antes do errorHandler, após todas as rotas válidas.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(<ApiResponse<null>>{
    success: false,
    message: `Rota "${req.method} ${req.path}" não encontrada.`,
  });
}
