import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Tooltip,
  LineElement,
  LinearScale,
  PointElement,
  Filler,
  ArcElement,
  Legend,
  Chart as ChartJS,
  plugins,
} from "chart.js";
import { getLast7Days } from "../../lib/features";
import { brown, purple } from "@mui/material/colors"
ChartJS.register(
  Tooltip,

  CategoryScale,
  LinearScale,
  LineElement,

  PointElement,
  Filler,
  ArcElement,
  Legend
);
const labels = getLast7Days();
const LineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};
const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: "rgba(75,19,19,0.2)",
        borderColor: "rgba(75,19,19,1)",
      },
    ],
  };
  return <Line data={data} options={LineChartOptions} />;
};
const DoughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
   
  },
 cutout:70
};
const DoughnutChart = ({value=[],labels=[]}) => {
  const data = {
    labels,
    datasets: [
      { 
        data: value,
      
      
        backgroundColor: ["rgba(75,19,19,0.2)",brown[500]],
        borderColor: ["rgba(75,19,19,1)",brown[500]],
        spacing:"4"
      },
    ],
  };
  return <Doughnut data={data} options={DoughnutChartOptions} style={{
    zIndex:10
  }}/>;
};

export { LineChart, DoughnutChart };
