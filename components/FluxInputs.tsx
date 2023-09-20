"use client";

import { Coins, HandCoins, PiggyBank } from "@phosphor-icons/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { formatDate, formatDateTime } from "@/utils/formatDate";

interface DepositTypeProp {
  id: string;
  name: string;
}

interface FormValue {
  value: string | number;
  description: string;
}

export default function FluxInputs() {
  const [depositTypes, setDepositTypes] = useState<DepositTypeProp[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDepositType, setSelectedDepositType] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState<FormValue>({
    value: "",
    description: "",
  });

  useEffect(() => {
    async function getDepositTypes() {
      try {
        const res = await fetch("/api/depositTypes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar tipos de depósito.");
        }

        const data = await res.json();
        setDepositTypes(data);
      } catch (error) {
        console.error("Erro ao buscar tipos de depósito:", error);
        throw error;
      }
    }
    getDepositTypes();
  }, []);

  const handleTakeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleDepositTypeValue = (selectedValue: string) => {
    setSelectedDepositType(selectedValue);
  };
  console.log(inputValue);
  console.log(selectedDepositType);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSubmit = {
      value: inputValue.value,
      description: inputValue.description,
      depositType: selectedDepositType,
    };

    console.log(dataToSubmit);
  };

  return (
    <article className="py-8 pl-8 flex flex-col w-3/5 h-screen border-r">
      <p className="font-extrabold">🗓 {formatDate(currentDate)}</p>
      <form className="gap-3 pt-28" onSubmit={handleSubmit}>
        <div className="flex items-center gap-5 w-full">
          <div>
            <label htmlFor="" className="font-extrabold">
              Valor:
            </label>
            <Input
              name="value"
              placeholder="valor"
              value={inputValue.value}
              onChange={handleTakeValue}
              className="w-52 my-3"
            />
          </div>
          <div>
            <label htmlFor="" className="font-extrabold">
              Descrição:
            </label>
            <Input
              name="description"
              placeholder="Descrição"
              value={inputValue.description}
              onChange={handleTakeValue}
              className="w-52 my-3"
            />
          </div>
          <div className="">
            <label htmlFor="" className="font-extrabold">
              Selecione o tipo:
            </label>
            <Select onValueChange={handleDepositTypeValue}>
              <SelectTrigger className="w-[180px] my-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Selecione</SelectLabel>
                  {depositTypes.map((depositType) => (
                    <SelectItem value={depositType.name} key={depositType.id}>
                      {depositType.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-end gap-2 py-5">
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
