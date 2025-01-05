import { useEffect, useState } from "react";
import api from "./axiosConfig";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, TimeScale, LineElement, Title, Tooltip, CategoryScale, LinearScale, PointElement, Legend } from "chart.js";

ChartJS.register(TimeScale, LineElement, Title, Legend, Tooltip, CategoryScale, LinearScale, PointElement);

const CompanyCharts = ({ ticker, interval }) => {
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/stock/history/${ticker}/${interval}`);
        setStockData(res.data);
      } catch (err) {
        console.error("Error fetching stock data", err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [ticker, interval]);

  useEffect(() => {
    if (stockData) {
      const chartConfig = [
        {
          label: "Open",
          data: stockData.open,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        {
          label: "Close",
          data: stockData.close,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
        {
          label: "Low",
          data: stockData.low,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
        {
          label: "High",
          data: stockData.high,
          borderColor: "rgb(255, 206, 86)",
          backgroundColor: "rgba(255, 206, 86, 0.2)",
        },
        {
          label: "High - Low",
          data: stockData.high.map((high, idx) => high - stockData.low[idx]),
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
        },
        {
          label: "Open - Close",
          data: stockData.open.map((open, idx) => open - stockData.close[idx]),
          borderColor: "rgb(255, 159, 64)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
        },
      ];

      const preparedData = chartConfig.map((config) => ({
        labels: stockData.labels,
        datasets: [
          {
            ...config,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.4, // Smooth curves
          },
        ],
      }));

      setChartData(preparedData);
    }
  }, [stockData]);

  if (isLoading) {
    return <div className="text-center text-white font-bold h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartData.map((data, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">{data.datasets[0].label}</h2>
              <div className="h-64">
                <Line data={data} options={{ maintainAspectRatio: false, responsive: true }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white font-bold">No data available</div>
      )}
    </div>
  );
};

export default CompanyCharts;
