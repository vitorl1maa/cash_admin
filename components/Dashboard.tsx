"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bell, ExcludeSquare } from "@phosphor-icons/react";
import { Wallet } from "lucide-react";
import FluxInputs from "./FluxInputs";

export default function Dashboard() {
  const { data: session, status } = useSession();

  console.log(status);

  return (
    <>
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
              <p className="font-extrabold text-sm">R$ 1,350,00</p>
            </span>
            <span className="bg-neutral-800 p-2 rounded-full">
              <Bell size={25} />
            </span>
          </div>
        </nav>
        <FluxInputs />
      </main>
    </>
  );
}
