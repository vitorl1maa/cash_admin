import {db as prisma} from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Método recebido:", req.method);
  
  const data = await req.json();
  try {
      const {
        entryValue,
        withdrawalValue,
        totalValue,
        description,
        depositType,
        userId,
      } = data;

      const newValueRegister = await prisma.valuesRegister.create({
      data: {
        entryValue,
        withdrawalValue,
        totalValue,
        description,
        depositType: {
          connect: {id: depositType.id},
        },
        user: {
          connect: {id: userId},
        },
        
      },
    })
     return NextResponse.json(newValueRegister, { status: 201 });
    } catch(error) {
      console.error("Erro ao criar registro:", error);
      return NextResponse.json({ error: "Erro ao criar registro" }, { status: 500 });
    }


}