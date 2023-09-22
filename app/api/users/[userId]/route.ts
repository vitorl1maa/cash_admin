import { PrismaClient } from '@prisma/client';
import { db as prisma } from "@/lib/db";

export async function GET(request: Request, context: { params: { userId: string } }) {
  

  try {
    // Recuperando o userId do contexto
    const userId = context.params.userId;

    // Consulta o usuário pelo ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Você pode incluir aqui as relações necessárias para personalizar o conteúdo
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
