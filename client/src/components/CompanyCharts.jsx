import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import api from "./axiosConfig";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, TimeScale, LineElement, Title, Tooltip, CategoryScale, LinearScale, PointElement, Legend } from "chart.js";

ChartJS.register(TimeScale, LineElement, Title, Legend, Tooltip, CategoryScale, LinearScale, PointElement);

const CompanyCharts = ({ ticker, interval }) => {
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(""); // store AI response
  const [loadingAI, setLoadingAI] = useState(false); // loading state for AI

  // Call Gemini API with stock data
  const getSuggestions = async () => {
    if (!stockData) return;

    setLoadingAI(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Here is stock data for ${ticker}. Provide insights and suggestions:\n\n${JSON.stringify(
                    stockData
                  )}`,
                },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      setAiInsights(
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No insights generated."
      );
    } catch (err) {
      console.error("Error fetching AI insights", err);
      setAiInsights("Error fetching insights.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Fetch stock data
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

  // Prepare chart data
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
          data: stockData.open.map(
            (open, idx) => open - stockData.close[idx]
          ),
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
            tension: 0.4,
          },
        ],
      }));

      setChartData(preparedData);
    }
  }, [stockData]);

  if (isLoading) {
    return (
      <div className="text-center text-white font-bold h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartData.map((data, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                {data.datasets[0].label}
              </h2>
              <div className="h-64">
                <Line
                  data={data}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>
          ))}

          {/* AI Insights Section */}
          <div className="col-span-full mt-6">
            <button
              onClick={getSuggestions}
              disabled={loadingAI}
              className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
                loadingAI
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loadingAI && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loadingAI ? "Analyzing..." : "Get AI insights and suggestions"}
            </button>

            {loadingAI && (
              <p className="text-blue-400 mt-2">Fetching AI insights...</p>
            )}

            {aiInsights && !loadingAI && (
              <div className="mt-4 p-4 bg-gray-700 text-white rounded max-h-96 overflow-y-auto">
                <h3 className="font-bold mb-2">AI Insights:</h3>
                <ReactMarkdown>{aiInsights}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-white font-bold">No data available</div>
      )}
    </div>
  );
};

export default CompanyCharts;