"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Circle, Faders, Trash } from "@phosphor-icons/react";
import axios from "axios";
import { formatCurrency } from "@/utils/formated";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableProps {
  userId: string;
}

interface Transaction {
  id: string;
  createdAt: string;
  entryValue: number;
  withdrawalValue: number | null;
  description: string;
  depositTypeId: string;
}

const typeMappings: Record<string, string> = {
  "6509b436339746d595af5116": "Essencial",
  "6509b436339746d595af5117": "Não Essencial",
  "6509b436339746d595af5118": "Investimentos",
};

const typeStyles: Record<string, React.CSSProperties> = {
  "6509b436339746d595af5116": {
    backgroundColor: "rgba(133, 195, 209, 0.3)",
    color: "#85c3d1",
  },
  "6509b436339746d595af5117": {
    backgroundColor: "rgba(218, 101, 89, 0.3)",
    color: "#da6559",
  },
  "6509b436339746d595af5118": {
    backgroundColor: "rgba(64, 70, 210, 0.3)",
    color: "#4046d2",
  },
};

export function TableValues({ userId }: TableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>("");

  const handleFilter = (value: string) => {
    setFilter(value);
  };

  const filterOrder = () => {
    let transactionsFilter = [...transactions];

    if (filter === "entryValue") {
      transactionsFilter = transactionsFilter.filter(
        (transaction) => transaction.entryValue > 0
      );
    } else if (filter === "withdrawalValue") {
      transactionsFilter = transactionsFilter.filter(
        (transaction) => transaction.withdrawalValue !== null
      );
    } else if (filter === "essential") {
      transactionsFilter = transactionsFilter.filter(
        (transaction) =>
          transaction.depositTypeId === "6509b436339746d595af5116"
      );
    } else if (filter === "unessential") {
      transactionsFilter = transactionsFilter.filter(
        (transaction) =>
          transaction.depositTypeId === "6509b436339746d595af5117"
      );
    } else if (filter === "investments") {
      transactionsFilter = transactionsFilter.filter(
        (transaction) =>
          transaction.depositTypeId === "6509b436339746d595af5118"
      );
    } else if (filter === "all") {
      setFilter("");
    }

    transactionsFilter.sort(
      (a: Transaction, b: Transaction) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return transactionsFilter;
  };

  const listTransactions = filterOrder();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    filterOrder();
  };

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then((response) => {
      const userData = response.data;

      if (userData && userData.transactions) {
        // Classificar as transações por data, da mais recente para a mais antiga
        const sortedTransactions = userData.transactions.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Atualizar o estado com as transações ordenadas
        setTransactions(sortedTransactions);
      }
    });
  }, [userId]);

  return (
    <div>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead className="text-center">Categoria</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
            <TableHead className="text-center">Descrição</TableHead>
            <TableHead className="w-[100px] cursor-pointer">
              <form className="" onSubmit={handleSubmit}>
                <Select onValueChange={handleFilter} value={filter}>
                  <SelectTrigger className="w-full  bg-transparent border-none focus:none">
                    <Faders size={25} weight="fill" />
                    <SelectValue placeholder="Filtar por:" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Filtar por:</SelectLabel>
                      <SelectItem value="entryValue">Depósitos</SelectItem>
                      <SelectItem value="withdrawalValue">Saques</SelectItem>
                      <SelectItem value="essential">Essencial</SelectItem>
                      <SelectItem value="unessential">Não Essencial</SelectItem>
                      <SelectItem value="investments">Investimentos</SelectItem>
                      <SelectItem value="all">Todos</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </form>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex items-center justify-center">
                <div
                  style={
                    typeStyles[transaction.depositTypeId] || {
                      backgroundColor: "transparent",
                      color: "inherit",
                    }
                  }
                  className="px-3 py-2 rounded-md flex items-center gap-2 w-36"
                >
                  <Circle
                    size={10}
                    weight="fill"
                    color={
                      typeStyles[transaction.depositTypeId]
                        ? typeStyles[transaction.depositTypeId].color
                        : "#000"
                    }
                  />
                  <p className="text-white">
                    {typeMappings[transaction.depositTypeId] || "Desconhecido"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {transaction.entryValue
                  ? `Depósito: ${formatCurrency(transaction.entryValue)}`
                  : `Saque: ${formatCurrency(
                      Math.abs(transaction.withdrawalValue || 0)
                    )}`}
              </TableCell>
              <TableCell className="text-center">
                {transaction.description}
              </TableCell>
              <TableCell className="text-center cursor-pointer">
                <Trash size={25} weight="fill" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
