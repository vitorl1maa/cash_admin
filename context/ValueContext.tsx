"use client";

import React, { createContext, useContext, useState } from "react";

interface ValueContextData {
  entryValue: any;
  withdrawalValue: any;
  totalValue: number;
  updateValues: (
    entryValue: any,
    withdrawalValue: any,
    totalValue: number
  ) => void;
}

const ValueContext = createContext<ValueContextData | undefined>(undefined);

export const useValueContext = () => {
  const context = useContext(ValueContext);
  if (!context) {
    throw new Error("useValueContext must be used within a ValueProvider");
  }
  return context;
};

export const ValueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [entryValue, setEntryValue] = useState<any>();
  const [withdrawalValue, setWithdrawalValue] = useState<any>();
  const [totalValue, setTotalValue] = useState<number>(0);

  const updateValues = (
    newEntryValue: any,
    newWithdrawalValue: any,
    newTotalValue: number
  ) => {
    setEntryValue(newEntryValue);
    setWithdrawalValue(newWithdrawalValue);
    setTotalValue(newTotalValue);
  };

  return (
    <ValueContext.Provider
      value={{ entryValue, withdrawalValue, totalValue, updateValues }}
    >
      {children}
    </ValueContext.Provider>
  );
};
