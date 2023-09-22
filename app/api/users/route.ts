import { db as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next";
import { useId } from "react";
import { getSession } from 'next-auth/react';

export async function POST(req: NextRequest) {

  const data = await req.json()
  const {avatar, name, lastName, email, profession, password} = data
  console.log("ROUTE HANDLE", data)

  if(!name || !email || !password) {
    return NextResponse.json("Dados inválidos.",{status: 400} )
  }

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if(isUserExists){
    return NextResponse.json({error: "Email já existente"}, {status: 400})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      avatar,
      name,
      lastName, 
      email,
      profession,
      hashedPassword
    }
  })

  return NextResponse.json(user)
  
}


// export async function GET() {
//   try {
//     const users = await prisma.user.findMany();
//     return NextResponse.json(users, {status:200});
//   } catch (error) {
//     console.error("Erro ao buscar usuário:", error);
//     return NextResponse.json("Erro ao buscar usuário:", {status: 500});
//   } finally {
//     await prisma.$disconnect();
//   }
// }

