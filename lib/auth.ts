import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { db as prisma } from "./db";
import { prismaAuth } from "./db";
import bcrypt from "bcrypt";
import { encode, decode } from 'next-auth/jwt';


export const authOptions: NextAuthOptions = {
   adapter: PrismaAdapter(prismaAuth as any),
  providers:[
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialProvider({
      name: "credentials",
      credentials: {
        name: {label: "Name", type: "text", placeholder: "John Due"},
        email: {label: "Email", type: "text", placeholder: "jsmith"},
        password: {label: "Password", type: "password", placeholder: "password"},
      },
      async authorize(credentials, req): Promise<any>{
        console.log("Authorize method", credentials)
        
        if(!credentials?.email || !credentials?.password) throw new Error("Dados de login necessarios")
        const user = await prisma.user.findUnique({
          where:{
            email: credentials?.email
          }
        })
        if(!user || !user.hashedPassword) {
          throw new Error("Usuário não registrado")
        }

        const matchPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
        if(!matchPassword)
         throw new Error("Senha incorreta")

        return user
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: { encode, decode },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/dashboard"
  }
}