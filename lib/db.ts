import { PrismaClient } from "@prisma/client";

// Crie uma nova instância do Prisma Client apenas para o NextAuth.js
export const prismaAuth = new PrismaClient();

// A instância global do Prisma Client (usada em outros lugares)
export const db = prismaAuth;

// Declare a variável global para a instância do Prisma Client
declare global {
  var cachedPrisma: PrismaClient;
}

// Configure o Prisma Client global apenas para ambientes de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
}

// Exporte a instância global do Prisma Client (usada em outros lugares)
export const dbGlobal = global.cachedPrisma;
