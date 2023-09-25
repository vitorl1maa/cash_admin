import { PrismaClient } from '@prisma/client';
import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: { userId: string } }) {
  

  try {
    // Recuperando o userId do contexto
    const userId = context.params.userId;

    // Consulta o usuário pelo ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: true, // Exemplo de inclusão das transações do usuário
        DepositType: true,  // Exemplo de inclusão do tipo de depósito
        // Outras relações que desejar
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Usuário não encontrado' }), { status: 404 });
    }

    // Aqui você pode personalizar a resposta de acordo com o usuário
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new Response(JSON.stringify({ message: 'Erro ao buscar usuário' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request, context: { params: { userId: string } }) {
  try {
    // Recuperando o userId do contexto
    const userId = context.params.userId;

    // Recuperando os dados do corpo da requisição
    const updates = await request.json();

    // Valide os dados recebidos aqui, se necessário

    // Atualize o usuário com os novos dados
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        primaryDeposit: updates.primaryDeposit,
        entryValue: updates.entryValue, // Adicione esta linha para atualizar entryValue
        withdrawalValue: updates.withdrawalValue, // Adicione esta linha para atualizar withdrawalValue
      },
    });

    // Retorna o usuário atualizado como resposta
    return new Response(JSON.stringify(updatedUser), { status: 200 });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return new Response(JSON.stringify({ message: 'Erro ao atualizar usuário' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
