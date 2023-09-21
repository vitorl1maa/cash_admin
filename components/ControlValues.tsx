"use client";

import { Coins, HandCoins, PiggyBank } from "@phosphor-icons/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
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
import { formatDate, formatCurrency, parseCurrency } from "@/utils/formated";
import { ToastAction } from "@radix-ui/react-toast";

interface DepositTypeProp {
  id: string;
  name: string;
}

interface FormValue {
  value: string;
  description: string;
}

interface Trasaction {
  value: number;
  description: string;
}

interface FluxInputsProps {
  onTotalValue: (value: number) => void;
}

export default function FluxInputs({ onTotalValue }: FluxInputsProps) {
  const [depositTypes, setDepositTypes] = useState<DepositTypeProp[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [money, setMoney] = useState({ moneyValue: 0 });
  const [showMoney, setShowMoney] = useState<boolean>(false);
  const [deposits, setDeposits] = useState<number[]>([]);
  const [withdrawals, setSubtractValues] = useState<number[]>([]);
  const [transactions, setTransactions] = useState<Trasaction[]>([]);
  const [lastDeposit, setLastDeposit] = useState<number>(0);
  const [lastWithdrawal, setLastWithdrawal] = useState<number>(0);
  const { toast } = useToast();
  const [selectedDepositType, setSelectedDepositType] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState<FormValue>({
    value: "",
    description: "",
  });

  useEffect(() => {
    const localStorageValue = localStorage.getItem("moneyValue");
    if (localStorageValue !== null && !isNaN(parseFloat(localStorageValue))) {
      // Verifica se o valor lido do localStorage é um número válido
      setMoney({ moneyValue: parseFloat(localStorageValue) });
    }

    // Recuperar os valores das últimas transações do Local Storage
    const lastDepositValue = parseFloat(
      localStorage.getItem("lastDeposit") || "0"
    );
    const lastWithdrawalValue = parseFloat(
      localStorage.getItem("lastWithdrawal") || "0"
    );

    if (!isNaN(lastDepositValue)) {
      setLastDeposit(lastDepositValue);
    }

    if (!isNaN(lastWithdrawalValue)) {
      setLastWithdrawal(lastWithdrawalValue);
    }
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

  const handleAddValue = () => {
    const newValue = parseCurrency(inputValue.value);
    if (!isNaN(newValue)) {
      const totalValue = money.moneyValue + newValue;

      setMoney({ moneyValue: totalValue });
      localStorage.setItem("moneyValue", totalValue.toString());
      setDeposits((prev) => [...prev, newValue]);

      const newTransaction: Trasaction = {
        value: newValue,
        description: "",
      };
      setShowMoney(true);
      setTransactions((prev) => [...prev, newTransaction]);

      setInputValue({
        value: "0", // Inicialize com o valor desejado (0, por exemplo)
        description: "",
      });
      localStorage.setItem("lastDeposit", newValue.toString());
      setLastDeposit(newValue);
    } else {
      console.warn("Valor de depósito inválido:", inputValue.value);
    }
  };

  const totalValue = money.moneyValue;
  useEffect(() => {
    onTotalValue(totalValue);
  }, [totalValue, onTotalValue]);

  const handleSubtractValue = () => {
    const withdrawValue = parseFloat(inputValue.value); // Certifique-se de converter o valor para número

    if (
      !isNaN(withdrawValue) &&
      withdrawValue >= 0 &&
      withdrawValue <= money.moneyValue
    ) {
      const valueTotal = money.moneyValue - withdrawValue;
      setMoney({ moneyValue: valueTotal });
      localStorage.setItem("moneyValue", valueTotal.toString());
      setSubtractValues((prevWithdrawals) => [
        ...prevWithdrawals,
        withdrawValue,
      ]);
      setShowMoney(true);

      // Limpe o campo de entrada depois de uma retirada bem-sucedida
      setInputValue((prev) => ({
        ...prev,
        value: "",
      }));

      // Armazene a última retirada no localStorage
      localStorage.setItem("lastWithdrawal", withdrawValue.toLocaleString());
      setLastWithdrawal(withdrawValue);
    } else {
      toast({
        title: "🚫 Operação inválida",
        description:
          "Não foi possível completar sua operação, verifique os valores",
        variant: "destructive",
      });
    }
  };

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
          <Button
            className="w-32 hover:translate-y-1 transition-all"
            onClick={handleSubtractValue}
          >
            Retirar
          </Button>
          <Button
            className="w-32 bg-green-600 hover:bg-green-600/30 text-white hover:translate-y-1 transition-all"
            onClick={handleAddValue}
          >
            Depositar
          </Button>
        </div>
      </form>
      <div className="flex gap-3 pr-5 pt-5">
        <section className="bg-neutral-800 flex flex-col justify-center px-4 py-2 rounded-md w-64">
          <div className="flex items-center gap-2 font-extrabold text-neutral-500">
            <span className="bg-neutral-700 p-2 rounded-full">
              <Coins size={25} weight="fill" color="#fff" />
            </span>
            Última entrada
          </div>
          <p className="pl-12 font-extrabold">
            {lastDeposit !== null
              ? formatCurrency(lastDeposit)
              : "Nenhuma entrada"}
          </p>
        </section>
        <section className="bg-neutral-800 flex flex-col justify-center  px-4 py-5 rounded-md w-64">
          <div className="flex items-center gap-2 font-extrabold text-neutral-500">
            <span className="bg-neutral-700 p-2 rounded-full">
              <HandCoins size={25} weight="fill" color="#fff" />
            </span>
            Última saída
          </div>
          <p className="pl-12 font-extrabold">
            {lastWithdrawal !== null
              ? `- ${formatCurrency(lastWithdrawal)}`
              : "Nenhuma saída"}
          </p>
        </section>
        <section className="bg-neutral-800 flex flex-col justify-center px-4 py-2 rounded-md w-64">
          <div className="flex items-center gap-2 font-extrabold text-neutral-500">
            <span className="bg-neutral-700 p-2 rounded-full">
              <PiggyBank size={25} weight="fill" color="#fff" />
            </span>
            Total
          </div>
          <p className="pl-12 font-extrabold">{formatCurrency(totalValue)}</p>
        </section>
      </div>
    </article>
  );
}
