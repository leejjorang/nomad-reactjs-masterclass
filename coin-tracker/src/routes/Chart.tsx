import React from "react";
import { fetchCoinHistory } from "../api";
import { useQuery } from "@tanstack/react-query";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";

const Loader = styled.span`
  display: block;
`;

interface ChartProps {
  coinId: string;
}

interface IHistory {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const Chart = ({ coinId }: ChartProps) => {
  const { isLoading, data } = useQuery<IHistory[]>({
    queryKey: ["history", coinId],
    queryFn: () => fetchCoinHistory(coinId),
    refetchInterval: 10000,
  });

  const isDark = useRecoilValue(isDarkAtom);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
  };

  const series = [
    {
      name: "Price",
      data: data?.map((price) => Number(price.close)) as number[],
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Loader>Loading Chart...</Loader>
      ) : (
        <ApexChart
          type="line"
          options={options}
          series={series}
          width={500}
          height={300}
        />
      )}
    </div>
  );
};

export default Chart;
