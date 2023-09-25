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
import { formatDate, formatCurrency } from "@/utils/formated";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface DepositTypeProp {
  id: string;
  name: string;
}

interface FluxInputsProps {
  onTotalValue: (value: number) => void;
  userId: string;
}

interface Transaction {
  entryValue: number | null;
  withdrawalValue: number | null;
}

interface UserData {
  transactions: Transaction[];
}

export default function FluxInputs({ onTotalValue, userId }: FluxInputsProps) {
  const [depositTypes, setDepositTypes] = useState<DepositTypeProp[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [totalValue, setTotalValue] = useState<number>(0);
  const [deposits, setDeposits] = useState<number[]>([]);
  const [operationType, setOperationType] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [lastEntryValue, setLastEntryValue] = useState<number>(0);
  const [lastWithdrawalValue, setLastWithdrawalValue] = useState<number>(0);
  const [selectedDepositType, setSelectedDepositType] = useState<string | null>(
    null
  );
  const [inputValues, setInputValues] = useState({
    value: "",
    description: "",
  });

  const [isDepositoChecked, setIsDepositoChecked] = useState(false);
  const [isRetirarChecked, setIsRetirarChecked] = useState(false);

  async function updateUserValues(
    userId: string,
    entryValue: number,
    withdrawalValue: number
  ) {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryValue, withdrawalValue }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar os valores do usuário.");
      }

      // Lidar com a resposta da rota, se necessário
      console.log("Resposta da rota de atualização de usuário:", res);

      // Chame a função onTotalValue para atualizar o valor total
      onTotalValue(entryValue - withdrawalValue);
    } catch (error) {
      console.error("Erro ao atualizar os valores do usuário:", error);
    }
  }

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
    async function getTransaction() {
      try {
        const res = await fetch(`/api/users/${userId}`);

        if (!res.ok) {
          throw new Error("Erro ao buscar usuário");
        }
        const data = await res.json();
        setUserData(data);

        // Preencha lastEntryValue e lastWithdrawalValue com os valores da API
        if (data) {
          setLastEntryValue(data.entryValue || 0);
          setLastWithdrawalValue(data.withdrawalValue || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar o usuário", error);
      }
    }

    getTransaction();
    getDepositTypes();
  }, [userId]);

  useEffect(() => {
    if (userData?.transactions) {
      const total = userData.transactions.reduce(
        (acc, transaction) =>
          acc +
          (transaction.entryValue || 0) -
          (transaction.withdrawalValue || 0),
        0
      );
      setTotalValue(total);
    }
  }, [userData]);

  const handleValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleSelect = (value: string) => {
    setSelectedDepositType(value);
    setOperationType(value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const numericValue = parseFloat(inputValues.value);

    if (isNaN(numericValue)) {
      toast({
        title: "🚫 Não foi possível registrar os valores",
        description:
          "Não foi possível completar sua operação, verifique os valores",
        variant: "destructive",
      });
      return;
    }

    if (isRetirarChecked && !isDepositoChecked) {
      // Operação de Retirada
      if (numericValue <= totalValue) {
        setTotalValue(totalValue - numericValue);
        setLastWithdrawalValue(numericValue);
        toast({
          title: "✅ Retirada registrada com sucesso!",
          variant: "default",
        });

        // Chame a função para atualizar os valores do usuário
        updateUserValues(userId, lastEntryValue, numericValue);
      } else {
        toast({
          title: "🚫 Não foi possível registrar a retirada",
          description: "Saldo insuficiente para a retirada",
          variant: "destructive",
        });
      }
    } else if (isDepositoChecked && !isRetirarChecked) {
      // Operação de Depósito
      setTotalValue(totalValue + numericValue);
      setLastEntryValue(numericValue);
      toast({
        title: "✅ Depósito registrado com sucesso!",
        variant: "default",
      });

      // Chame a função para atualizar os valores do usuário
      updateUserValues(userId, numericValue, lastWithdrawalValue);
    } else {
      // Caso nenhuma operação válida tenha sido selecionada.
      toast({
        title: "🚫 Operação inválida",
        description: "Selecione 'Depositar' ou 'Retirar'",
        variant: "destructive",
      });
    }

    setInputValues({
      value: "",
      description: "",
    });
  };

  useEffect(() => {
    const newTotalValue = deposits.reduce(
      (total, deposit) => total + deposit,
      0
    );
    onTotalValue(newTotalValue);
  }, [deposits]);

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
              className="w-52 my-3"
              value={inputValues.value}
              onChange={handleValues}
            />
          </div>
          <div>
            <label htmlFor="" className="font-extrabold">
              Descrição:
            </label>
            <Input
              name="description"
              placeholder="Descrição"
              className="w-52 my-3"
              value={inputValues.description}
              onChange={handleValues}
            />
          </div>
          <div className="">
            <label htmlFor="" className="font-extrabold">
              Selecione o tipo:
            </label>
            <Select onValueChange={handleSelect}>
              <SelectTrigger className="w-[180px] my-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Selecione</SelectLabel>
                  {depositTypes.map((depositType) => (
                    <SelectItem value={depositType.id} key={depositType.id}>
                      {depositType.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-end gap-2 py-5">
          <div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deposito"
                checked={isDepositoChecked}
                onChange={() => {
                  setIsDepositoChecked(!isDepositoChecked);
                  setIsRetirarChecked(false); // Desmarca a opção de retirar
                }}
              />
              <label htmlFor="deposito">Depositar</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="retirar"
                checked={isRetirarChecked}
                onChange={() => {
                  setIsRetirarChecked(!isRetirarChecked);
                  setIsDepositoChecked(false); // Desmarca a opção de depositar
                }}
              />
              <label htmlFor="retirar">Retirar</label>
            </div>
          </div>
          <Button
            name="Depositar"
            className={`w-32 bg-green-600 hover:bg-green-600/30 text-white hover:translate-y-1 transition-all ${
              operationType === "Depositar" ? "bg-green-600" : ""
            }`}
            onClick={() => setOperationType("Depositar")}
          >
            Enviar
          </Button>
        </div>
      </form>
      <div className="flex gap-3 pr-5 pt-5">
        <section className="bg-neutral-800 flex flex-col justify-center px-4 py-2 rounded-md w-64">
          <div className="flex items-center gap-2 font-extrabold text-neutral-500">
            <span className="bg-neutral-700 p-2 rounded-full">
              <Coins size={25} weight="fill" color="#fff" />
            </span>
            Entrada
          </div>
          <p className="pl-12 font-extrabold">
            {formatCurrency(lastEntryValue)}
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
            {formatCurrency(lastWithdrawalValue)}
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
