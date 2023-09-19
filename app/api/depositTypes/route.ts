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
    return NextResponse.json(depositTypes);
  } catch (error) {
    console.error("Erro ao buscar tipos de depósito:", error);
    return NextResponse.json({ error: "Erro ao buscar tipos de depósito." });
  } finally {
    await prisma.$disconnect();
  }
}


// export async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "GET") {
//     try {
//       const depositTypes = await prisma.depositType.findMany();

//       res.status(200).json(depositTypes);
//     } catch (error) {
//       console.error("Erro ao buscar tipos de depósito:", error);
//       res.status(500).json({ error: "Erro ao buscar tipos de depósito." });
//     } finally {
//       await prisma.$disconnect();
//     }
//   } else {
//     res.status(405).json({ error: "Método HTTP não permitido." });
//   }
// }
