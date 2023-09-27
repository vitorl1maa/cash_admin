import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const Chart = dynamic(() => import("react-apexcharts"));

const getCurrentYearMonths = () => {
  const currentYear = new Date().getFullYear();
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return months.map((month) => `${month} ${currentYear}`);
};

const optionsChartLine = {
  colors: ["#4046d2", "#da6559"],
  tooltip: {
    enabled: true,
    theme: "dark",
  },
  xaxis: {
    categories: getCurrentYearMonths(),
  },
  chart: {
    foreColor: "white",
    toolbar: {
      show: false,
      offsetX: 0,
      offsetY: 0,
      color: "#000",
      tools: {
        download: false,
        reset: false,
        pan: false,
        zoom: false,
      },
    },
  },
  markers: {
    size: 4,
    strokeWidth: 2,
    strokeColor: "#fff",
  },
  legend: {
    show: true,
    fontSize: "15px",
    fontFamily: "Helvetica, Arial",
    fontWeight: 800,
    itemMargin: {
      horizontal: 10,
      vertical: 30,
    },
  },
};

interface Transaction {
  id: string;
  createdAt: string;
  entryValue: any;
  withdrawalValue: any;
}

interface GraphicProps {
  userId: string;
}

export function AreaGraphic({ userId }: GraphicProps) {
  const [depositData, setDepositData] = useState<Transaction[]>([]);
  const [withdrawalData, setWithdrawalData] = useState<Transaction[]>([]);
  const [chartSeries, setChartSeries] = useState<
    { name: string; data: number[] }[]
  >([]);

  const getMonthString = (dateString: string) => {
    const date = new Date(dateString);

    return date.getMonth();
  };

  const extractMonthlyValues = (transactions: Transaction[]) => {
    const monthlyData = {
      deposits: Array(12).fill(0),
      withdrawals: Array(12).fill(0),
    };

    transactions.forEach((transaction: Transaction) => {
      const month = getMonthString(transaction.createdAt);
      monthlyData.deposits[month] =
        (monthlyData.deposits[month] || 0) + (transaction.entryValue || 0);
      monthlyData.withdrawals[month] =
        (monthlyData.withdrawals[month] || 0) +
        (transaction.withdrawalValue || 0);
    });

    return monthlyData;
  };

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then((response) => {
      const userData = response.data;

      if (userData && userData.transactions) {
        const monthlyValues = extractMonthlyValues(userData.transactions);

        // Atualizar os estados com os dados da API
        setDepositData(monthlyValues.deposits);
        setWithdrawalData(monthlyValues.withdrawals);

        // Atualizar a série do gráfico com os dados de depósito e saque
        setChartSeries([
          {
            name: "Total em Depósitos R$",
            data: monthlyValues.deposits,
          },
          {
            name: "Total em Saques R$",
            data: monthlyValues.withdrawals,
          },
        ]);
      }
    });
  }, [userId]);

  return (
    <>
      <Chart
        options={optionsChartLine}
        series={chartSeries}
        height={400}
        type="area"
      />
    </>
  );
}
