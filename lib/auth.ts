import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
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
        const user = {email: 'teste@gmail.com', password: "123", name: "Teste"}

        return user
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.SECRET,
  debug: process.env.NODE_ENV === "development",
}