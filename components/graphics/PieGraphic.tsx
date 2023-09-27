import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Chart = dynamic(() => import("react-apexcharts"));

interface PieProps {
  userId: string;
}

interface Transaction {
  depositTypeId: string;
}

export function PieGraphic({ userId }: PieProps) {
  const [investmentLabels, setInvestmentLabels] = useState([
    "Essencial",
    "Não Essencial",
    "Investimentos",
  ]);

  const [investmentData, setInvestmentData] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    // Fazer uma solicitação à sua API para obter os tipos de investimento
    axios.get(`/api/users/${userId}`).then((response) => {
      const userData = response.data;

      if (userData && userData.transactions) {
        // Filtrar transações relacionadas a tipos de investimento
        const investmentTransactions = userData.transactions.filter(
          (transaction: Transaction) => transaction.depositTypeId
        );

        // Contar a quantidade de cada tipo de investimento
        const investmentCounts = [0, 0, 0];

        investmentTransactions.forEach((transaction: Transaction) => {
          switch (transaction.depositTypeId) {
            case "6509b436339746d595af5116":
              investmentCounts[0]++;
              break;
            case "6509b436339746d595af5117":
              investmentCounts[1]++;
              break;
            case "6509b436339746d595af5118":
              investmentCounts[2]++;
              break;
            default:
              break;
          }
        });

        // Calcular as porcentagens com base nas contagens
        const totalCount = investmentCounts.reduce(
          (total, count) => total + count,
          0
        );
        const investmentPercentages = investmentCounts.map(
          (count) => (count / totalCount) * 100
        );

        // Atualizar os rótulos e dados de investimento
        setInvestmentLabels(investmentLabels);
        setInvestmentData(investmentPercentages);
      }
    });
  }, [userId]);

  const pieOptions: any = {
    labels: investmentLabels,
    colors: ["#85c3d1", "#da6559", "#4046d2"],
    series: investmentData,
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
            total: {
              show: false,
              showAlways: true,
              fontSize: "20px",
              label: "Total",
              color: "#fff",
            },
          },
        },
      },
    },
    dataLabels: {
      style: {
        fontSize: "14px",
      },
    },
    stroke: {
      show: true,
      colors: ["#000"],
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: true,
      fontSize: "15px",
      fontFamily: "Helvetica, Arial",
      fontWeight: 800,
      position: "bottom",

      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },

      labels: {
        colors: ["#FFF", "#FFF", "#FFF"],
      },
    },

    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <>
      <Chart
        options={pieOptions}
        series={investmentData}
        type="donut"
        height={400}
        width={450}
      />
    </>
  );
}
