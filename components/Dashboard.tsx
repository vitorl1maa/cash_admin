"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bell, ExcludeSquare } from "@phosphor-icons/react";
import { Wallet } from "lucide-react";
import FluxInputs from "./ControlValues";
import { formatCurrency } from "@/utils/formated";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [totalValue, setTotalValue] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Verifique se a sessão está ativa
    if (session?.user) {
      const userId = session.user.id; // Obtenha o ID do usuário a partir da sessão

      // Faça uma solicitação à API usando o ID do usuário
      fetch(`/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data); // Atualize o estado com os dados do usuário
        })
        .catch((error) => {
          console.error("Erro ao buscar usuário:", error);
        });
    }
  }, [session]);

  console.log(userData);

  const receiveTotalValue = (value: number) => {
    setTotalValue(value);
  };

  return (
    <>
      {session ? (
        <main>
          <nav className="container flex justify-between items-center lg:border-b py-5">
            <div className="flex items-center">
              <ExcludeSquare size={25} weight="fill" />
              <h1 className="hidden lg:block font-extrabold text-xl">
                Cash Admin
              </h1>
            </div>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1 bg-neutral-800 px-5 py-2 rounded-full">
                <Wallet size={20} />
                <p className="font-extrabold text-sm">
                  {formatCurrency(totalValue)}
                </p>
              </span>
              <span className="bg-neutral-800 p-2 rounded-full">
                <Bell size={25} />
              </span>
            </div>
          </nav>
          <FluxInputs onTotalValue={receiveTotalValue} />
        </main>
      ) : (
        <section className="flex flex-col items-center justify-center container py-8  h-screen">
          <div className="w-80 ">
            <p className="text-red-500 text-center bg-red-600/30 px-5 py-3 rounded-lg">
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
