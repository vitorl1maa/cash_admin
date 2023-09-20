import {db as prisma} from "@/lib/db"
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST() {
  const prisma = new PrismaClient();

  try {
    const depositTypes = ["Essencial", "Não Essencial", "Investiementos"];

    for (const type of depositTypes) {
      await prisma.depositType.create({
        data: {
          name: type
        },
      })
    }
    await prisma.$disconnect();
  
    return {
      status: 200,
      body: {message: "Tipos de depósito foram populados com sucesso."},
    };
  } catch(error) {
    console.log("Erro ao popular tipos de depósito:", error)

    return {
      status: 500,
      body: { error: "Erro ao popular tipos de depósito." },
    };
  }
  
}

export async function GET() {
  try {
    const depositTypes = await prisma.depositType.findMany();
    return NextResponse.json(depositTypes, {status:200});
  } catch (error) {
    console.error("Erro ao buscar tipos de depósito:", error);
    return NextResponse.json("Erro ao buscar tipos de depósito.", {status: 500});
  } finally {
    await prisma.$disconnect();
  }
}