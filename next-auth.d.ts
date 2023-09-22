import { EnumRole } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Provider } from "next-auth/providers"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      /** Id is the key you want to use for id in session */
      id: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
      /** Sub is the key you want to use for user id in JWT */
      sub: string;
    }
}