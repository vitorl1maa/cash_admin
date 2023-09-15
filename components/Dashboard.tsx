"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <main className="container py-8">
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
        </main>
      ) : (
        <section className="flex flex-col items-center justify-center container py-8  h-screen">
          <div className="w-80">
            <p className="text-red-500 text-center">
              Desculpe, esta página é restrita a usuários autenticados. Por
              favor, faça o login para acessar este conteúdo.
            </p>
            <Link href="/">
              <Button className="w-full mt-5 bg-green-600 hover:bg-green-600/30 text-white">
                Login
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
