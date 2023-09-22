import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Método recebido:", req.method);

    const data = await req.json();
    const {
      entryValue,
      withdrawalValue,
      description,
      depositTypeId, // O ID do tipo de depósito
      userId,
    } = data;

    // Calcular o novo totalValue com base nas entradas e retiradas
    const totalValue = entryValue - withdrawalValue;

    // Crie uma nova transação no banco de dados
    const newTransaction = await prisma.transaction.create({
      data: {
        entryValue,
        withdrawalValue,
        totalValue,
        description,
        depositType: {
          connect: { id: depositTypeId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    // Atualize o saldo total do usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { totalValue }, // Atualize o saldo total aqui
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar registro:", error);
    return NextResponse.json({ error: "Erro ao criar registro" }, { status: 500 });
  }
}
