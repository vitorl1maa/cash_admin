"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bell, ExcludeSquare, SignOut } from "@phosphor-icons/react";
import { Wallet } from "lucide-react";
import FluxInputs from "./ControlValues";
import { formatCurrency } from "@/utils/formated";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface UserData {
  name: string;
  image: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [totalValue, setTotalValue] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  const receiveTotalValue = (value: number) => {
    setTotalValue(value);
  };

  useEffect(() => {
    if (session) {
      fetch(`/api/users/${session.user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados do usuário:", error);
        });
    }
  }, [session]);

  return (
    <>
      {session ? (
        <main>
          <nav className=" px-8 flex justify-between items-center lg:border-b py-5">
            <div className="flex items-center">
              <ExcludeSquare size={25} weight="fill" />
              <h1 className="hidden lg:block font-extrabold text-xl">
                Cash Admin
              </h1>
            </div>
            <div className="flex items-center gap-5">
              <span className="flex items-center font-extrabold gap-1 bg-neutral-800 px-5 py-2 rounded-full">
                <Wallet size={20} />
                {formatCurrency(totalValue)}
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="bg-neutral-800 w-10 h-10 rounded-full flex items-center justify-center">
                  <AvatarImage
                    className="w-10 h-10 rounded-full"
                    src={userData ? userData.image : ""}
                  />
                  <AvatarFallback className="w-10 h-10 rounded-full">
                    <img
                      src="/avatar-default.jpg"
                      alt=""
                      className="rounded-full w-10 h-10"
                    />
                    {/* <ExcludeSquare size={20} weight="fill" /> */}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xl font-extrabold">
                  Olá {userData ? userData.name : ""}{" "}
                </p>
              </div>
              <Button onClick={() => signOut({ callbackUrl: "/" })}>
                <SignOut size={20} />
                Sair
              </Button>
              {/* <span className="bg-neutral-800 p-2 rounded-full">
                <Bell size={25} />
              </span> */}
            </div>
          </nav>
          <FluxInputs
            onTotalValue={receiveTotalValue}
            userId={session.user.id}
          />
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
