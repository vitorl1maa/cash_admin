"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bell, ExcludeSquare, List, SignOut, X } from "@phosphor-icons/react";
import { Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/formated";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import ControlValues from "./ControlValues";
import { IsLoading } from "./IsLoading";

interface UserData {
  name: string;
  image: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [totalValue, setTotalValue] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navRef = useRef<HTMLDivElement | null>(null);

  const receiveTotalValue = (value: number) => {
    setTotalValue(value);
  };

  const showNavbar = () => {
    if (navRef.current) {
      navRef.current.classList.toggle("responsive_nav");
    }
  };

  useEffect(() => {
    if (session) {
      fetch(`/api/users/${session.user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados do usuário:", error);
        });
    }
    setIsLoading(false);
  }, [session, setTotalValue]);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <IsLoading />
        </div>
      ) : (
        <>
          {session && (
            <main className="w-full">
              <nav className=" px-5 xl:px-8 flex justify-between items-center border-0 xl:border-b py-5 ">
                <div className="flex items-center">
                  <ExcludeSquare
                    className="text-4xl lg:text-2xl"
                    weight="fill"
                  />
                  <h1 className="hidden lg:block font-extrabold text-xl">
                    Cash Admin
                  </h1>
                </div>
                <div className="flex items-center gap-5 menu" ref={navRef}>
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
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-newBlue hover:bg-newBlue/30 hover:translate-y-1 transition-all text-white"
                  >
                    <SignOut size={20} />
                    Sair
                  </Button>
                  <X
                    size={32}
                    color="#ffff"
                    onClick={showNavbar}
                    className="cursor-pointer nav-close-btn"
                  />
                </div>
                <List
                  onClick={showNavbar}
                  className="cursor-pointer nav-open-btn text-4xl lg:text-2xl"
                />
              </nav>
              <ControlValues
                onTotalValue={receiveTotalValue}
                userId={session.user.id}
              />
            </main>
          )}
        </>
      )}
    </>
  );
}
