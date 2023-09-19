"use client";

import { Coins, HandCoins, PiggyBank } from "@phosphor-icons/react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function FluxInputs() {
  return (
    <article className="py-8 pl-8 flex flex-col w-3/5 h-screen border-r">
      <form className="flex gap-3 py-10">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-extrabold">
            Valor:
          </label>
          <Input placeholder="valor" className="w-52" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-extrabold">
            Descrição:
          </label>
          <Input placeholder="Descrição" className="w-52" />
        </div>
        <div className="flex items-end gap-2">
          <Button className="w-32 hover:translate-y-1 transition-all">
            Retirar
          </Button>
          <Button className="w-32 bg-green-600 hover:bg-green-600/30 text-white hover:translate-y-1 transition-all">
            Depositar
          </Button>
        </div>
      </form>
      <div className="flex gap-3 pr-5">
        <section className="bg-neutral-800  px-4 py-2 rounded-md w-64">
          <div className="flex items-center gap-2 font-extrabold text-neutral-500">
            <span className="bg-neutral-700 p-2 rounded-full">
              <Coins size={25} weight="fill" color="#fff" />
            </span>
            Último deposito
          </div>
          <p className="pl-12 font-extrabold">R$ 1.500,00</p>
        </section>
        <section className="bg-neutral-800  px-4 py-2 rounded-md w-64">
          <div className="flex items-center gap-2 font-extrabold text-neutral-500">
            <span className="bg-neutral-700 p-2 rounded-full">
              <HandCoins size={25} weight="fill" color="#fff" />
            </span>
            Último saque
          </div>
          <p className="pl-12 font-extrabold">R$ 1.500,00</p>
        </section>
        <section className="bg-neutral-800  px-4 py-2 rounded-md w-64">
          <div className="flex items-center gap-2 font-extrabold text-neutral-500">
            <span className="bg-neutral-700 p-2 rounded-full">
              <PiggyBank size={25} weight="fill" color="#fff" />
            </span>
            Total
          </div>
          <p className="pl-12 font-extrabold">R$ 1.500,00</p>
        </section>
      </div>
    </article>
  );
}
