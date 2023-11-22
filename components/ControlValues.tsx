import React, { useEffect, useState } from "react";
import { formatDate, formatCurrency } from "@/utils/formated";
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
} from "./ui/select";
import { Coins, HandCoins, PiggyBank } from "@phosphor-icons/react";
import { IsLoading } from "./IsLoading";
import { Checkbox } from "./ui/checkbox";
import { AreaGraphic } from "./graphics/AreaGraphic";
import { PieGraphic } from "./graphics/PieGraphic";
import { CalendarDefault } from "./CalendarDefault";
import { TableValues } from "./TableValues";

interface ControlProps {
  onTotalValue: (value: number) => void;
  userId: string;
}

interface DepositTypeProp {
  id: string;
  name: string;
}

interface Transaction {
  entryValue: any;
  withdrawalValue: any;
  description: string;
  depositTypeId: string;
  userId: string;
}

interface UserData {
  transactions: Transaction[];
  entryValue: any;
  withdrawalValue: any;
}

export default function ControlValues({ onTotalValue, userId }: ControlProps) {
  const [depositTypes, setDepositTypes] = useState<DepositTypeProp[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showPrimaryDeposit, setShowPrimaryDeposit] = useState(true);
  const [showControlValues, setShowControlValues] = useState(false);
  const [userPrimaryDeposit, setUserPrimaryDeposit] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [entryValue, setEntryValue] = useState<any>();
  const [withdrawalValue, setWithdrawalValue] = useState<any>();
  const { toast } = useToast();
  const [checkboxLabel, setCheckboxLabel] = useState("Depositar");
  const [inputValues, setInputValues] = useState({
    value: "",
    description: "",
  });
  const [selectedDepositType, setSelectedDepositType] = useState<string | null>(
    null
  );
  const [isDeposit, setIsDeposit] = useState(true);
  const [sharedData, setSharedData] = useState(null);

  const calculateTotalValue = (transactions: any[]) => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.entryValue !== null) {
        return acc + transaction.entryValue;
      } else if (transaction.withdrawalValue !== null) {
        return acc - transaction.withdrawalValue;
      }
      return acc;
    }, 0);
  };

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

    async function getUsers() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/users/${userId}`);

        if (!res.ok) {
          throw new Error("Erro ao buscar usuário");
        }
        const data = await res.json();
        setUserPrimaryDeposit(data.primaryDeposit || false);
        setEntryValue(data.entryValue);
        setWithdrawalValue(data.withdrawalValue);

        if (data.transactions) {
          const calculatedTotalValue = calculateTotalValue(data.transactions);
          setTotalValue(calculatedTotalValue);
          onTotalValue(calculatedTotalValue);
        }
      } catch (error) {
        console.error("Erro ao buscar o usuário", error);
      } finally {
        setIsLoading(false);
      }
    }

    getUsers();
    getDepositTypes();
  }, []);

  const handleTakeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectTake = (value: string) => {
    setSelectedDepositType(value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsDeposit(checked);
    setCheckboxLabel(checked ? "Depositar" : "Sacar");
  };

  useEffect(() => {
    if (userData) {
      const { entryValue, withdrawalValue } = userData;
      setEntryValue(entryValue);
      setWithdrawalValue(withdrawalValue);
    }
  }, [userData]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const entryValue = parseFloat(inputValues.value);

    if (
      isDeposit &&
      (!entryValue ||
        entryValue <= 0 ||
        !inputValues.description ||
        !selectedDepositType)
    ) {
      toast({
        title: "❌ Preencha todos os campos para fazer o depósito",
        variant: "destructive",
      });
      return;
    }

    if (
      !isDeposit &&
      (!entryValue || entryValue <= 0 || !inputValues.description)
    ) {
      toast({
        title: "❌ Preencha todos os campos para fazer uma retirada",
        variant: "destructive",
      });
      return;
    }

    if (entryValue <= 0) {
      toast({
        title: "❌ Valor de depósito inválido",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      entryValue: isDeposit ? entryValue : null,
      withdrawalValue: isDeposit ? null : entryValue,
      description: inputValues.description,
      depositTypeId: selectedDepositType || "",
      userId: userId,
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar transação.");
      }
      setUserPrimaryDeposit(true);

      if (isDeposit) {
        setEntryValue(entryValue);
        const updatedTotalValue = totalValue + entryValue;
        setTotalValue((prevTotal) => prevTotal + entryValue);
        onTotalValue(updatedTotalValue);
      } else {
        setWithdrawalValue(entryValue);
        const updatedTotalValue = totalValue - entryValue;
        setTotalValue((prevTotal) => prevTotal - entryValue);
        onTotalValue(updatedTotalValue);
      }

      const updateData: any = {
        primaryDeposit: true,
      };

      if (isDeposit) {
        updateData.entryValue = entryValue;
      } else {
        updateData.withdrawalValue = entryValue;
      }

      if (res.ok) {
        const newData = await res.json();

        // Atualize o estado compartilhado com os novos dados
        setSharedData(newData);
      }

      const updateRes = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData), // Defina primaryValue como true
      });

      if (!updateRes.ok) {
        throw new Error("Erro ao atualizar primaryDeposit do usuário.");
      }

      const userData = await updateRes.json();
      console.log("Transação criada com sucesso:", userData);
      toast({
        title: "✅ Transação registrada com sucesso!",
        variant: "default",
      });
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }

    setInputValues({
      value: "",
      description: "",
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <IsLoading />
        </div>
      ) : (
        <>
          <main className="flex flex-col w-full">
            <div className="flex w-full flex-col xl:flex-row">
              <article
                className={`py-8 px-5 xl:px-8 flex flex-col ${
                  !userPrimaryDeposit ? "w-full" : "xl:w-3/5 h-full xl:border-r"
                }`}
              >
                <p className="font-extrabold">{formatDate(currentDate)}</p>
                <>
                  {!userPrimaryDeposit && (
                    <section
                      id="primary-deposit"
                      className="w-full flex flex-col gap-3 mt-32 items-center"
                    >
                      <section
                        id="primary-deposit"
                        className="w-full flex flex-col gap-3 mt-32 items-center"
                      >
                        <h1 className="text-2xl font-extrabold">
                          Faça seu primeiro depósito
                        </h1>
                        <form
                          className="flex flex-col gap-5"
                          onSubmit={handleSubmit}
                        >
                          <Input
                            placeholder="valor"
                            name="value"
                            value={inputValues.value}
                            onChange={handleTakeValue}
                          />
                          <Input
                            placeholder="descrição"
                            name="description"
                            value={inputValues.description}
                            onChange={handleTakeValue}
                          />
                          <div className="flex gap-3 items-center">
                            <Select onValueChange={handleSelectTake}>
                              <SelectTrigger className="w-[180px] my-3">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Selecione</SelectLabel>
                                  {depositTypes.map((depositType) => (
                                    <SelectItem
                                      value={depositType.id}
                                      key={depositType.id}
                                    >
                                      {depositType.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <Button className="w-32 text-white bg-newBlue hover:bg-newBlue/30 hover:translate-y-1 transition-all">
                              Enviar
                            </Button>
                          </div>
                        </form>
                      </section>
                    </section>
                  )}
                  {userPrimaryDeposit && (
                    <>
                      <section id="control-values" className="">
                        <form className="gap-3 pt-28" onSubmit={handleSubmit}>
                          <div className="flex items-center gap-5 flex-wrap xl:w-full xl:flex-nowrap ">
                            <div>
                              <label htmlFor="" className="font-extrabold">
                                Valor:
                              </label>
                              <Input
                                name="value"
                                placeholder="valor"
                                className="w-80 xl:w-52 my-3"
                                value={inputValues.value}
                                onChange={handleTakeValue}
                              />
                            </div>
                            <div>
                              <label htmlFor="" className="font-extrabold">
                                Descrição:
                              </label>
                              <Input
                                name="description"
                                placeholder="Descrição"
                                className="w-80 xl:w-52 my-3"
                                value={inputValues.description}
                                onChange={handleTakeValue}
                              />
                            </div>
                            <div>
                              <label htmlFor="" className="font-extrabold">
                                Categorias de despesas:
                              </label>
                              <Select onValueChange={handleSelectTake}>
                                <SelectTrigger className="w-[322px] xl:w-[200px] my-3">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Selecione</SelectLabel>
                                    {depositTypes.map((depositType) => (
                                      <SelectItem
                                        value={depositType.id}
                                        key={depositType.id}
                                      >
                                        {depositType.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center xl:mt-5 gap-3 bg-newBlue/30 px-3 py-3 rounded-md">
                              <input
                                id="deposit"
                                type="checkbox"
                                checked={isDeposit}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 cursor-pointer"
                              />
                              <label
                                htmlFor="deposit"
                                className="text-lg font-extrabold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {checkboxLabel}
                              </label>
                            </div>
                          </div>
                          <div className="flex items-end gap-2 py-5">
                            <Button className="w-32 text-white bg-newBlue hover:bg-newBlue/30 hover:translate-y-1 transition-all">
                              Enviar
                            </Button>
                          </div>
                        </form>
                        <div className="flex gap-3 xl:pr-5 pt-5 flex-col xl:flex-row">
                          <section className="bg-neutral-800 flex flex-col justify-center px-4 py-7 rounded-md w-full xl:w-64">
                            <div className="flex items-center gap-2 font-extrabold text-neutral-500">
                              <span className="bg-neutral-700 p-2 rounded-full">
                                <Coins size={25} weight="fill" color="#fff" />
                              </span>
                              Último Depósito
                            </div>
                            <p className="pl-12 font-extrabold">
                              {formatCurrency(entryValue)}
                            </p>
                          </section>
                          <section className="bg-neutral-800 flex flex-col justify-center  px-4 py-7 rounded-md w-full xl:w-64">
                            <div className="flex items-center gap-2 font-extrabold text-neutral-500">
                              <span className="bg-neutral-700 p-2 rounded-full">
                                <HandCoins
                                  size={25}
                                  weight="fill"
                                  color="#fff"
                                />
                              </span>
                              Último Saque
                            </div>
                            <p className="pl-12 font-extrabold">
                              - {formatCurrency(withdrawalValue)}
                            </p>
                          </section>
                          <section className="bg-neutral-800 flex flex-col justify-center px-4 py-7 rounded-md w-full xl:w-64">
                            <div className="flex items-center gap-2 font-extrabold text-neutral-500">
                              <span className="bg-neutral-700 p-2 rounded-full">
                                <PiggyBank
                                  size={25}
                                  weight="fill"
                                  color="#fff"
                                />
                              </span>
                              Total
                            </div>
                            <p className="pl-12 font-extrabold">
                              {formatCurrency(totalValue)}
                            </p>
                          </section>
                        </div>
                      </section>
                      <section className="pt-20">
                        <AreaGraphic userId={userId} sharedData={sharedData} />
                      </section>
                    </>
                  )}
                </>
              </article>
              <>
                {userPrimaryDeposit ? (
                  <article className="w-full py-8 px-5 xl:pl-8">
                    <h3 className="pb-20  font-extrabold">
                      Categoria de despesas
                    </h3>
                    <section className="pt-8  xl:px-8 flex flex-col items-center justify-center w-full ">
                      <PieGraphic userId={userId} sharedData={sharedData} />
                      <div className="xl:w-10/12 w-[300px] mt-20">
                        <CalendarDefault />
                      </div>
                    </section>
                  </article>
                ) : (
                  <></>
                )}
              </>
            </div>
            <>
              {userPrimaryDeposit ? (
                <TableValues userId={userId} sharedData={sharedData} />
              ) : (
                <></>
              )}
            </>
          </main>
        </>
      )}
    </>
  );
}
