import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Método recebido:", req.method);

    const data = await req.json();
    const { entryValue, withdrawalValue, description, depositTypeId, userId } = data;

    const lastTransaction = await prisma.transaction.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    let currentTotalValue = lastTransaction?.totalValue || 0;

    // Certifique-se de verificar se entryValue é definido e maior que zero
    if (entryValue && entryValue > 0) {
      if (withdrawalValue !== null && withdrawalValue >= 0) { // Certifique-se de verificar se é null e maior ou igual a zero
        // Se for uma transação de retirada, subtraia entryValue do currentTotalValue
        currentTotalValue -= entryValue;
      } else {
        // Caso contrário, adicione entryValue ao currentTotalValue
        currentTotalValue += entryValue;
      }
    }

    // Crie uma nova transação no banco de dados
    const newTransaction = await prisma.transaction.create({
      data: {
        entryValue,
        withdrawalValue,
        totalValue: currentTotalValue,
        description,
        depositType: {
          connect: { id: depositTypeId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar registro:", error);
    return NextResponse.json({ error: "Erro ao criar registro" }, { status: 500 });
  }
}

