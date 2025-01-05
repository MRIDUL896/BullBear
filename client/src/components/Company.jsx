import { useEffect, useState } from "react";
import api from "./axiosConfig";
import { useParams } from "react-router-dom";
import CompanyCharts from "./CompanyCharts";

const Company = () => {
    const { ticker } = useParams();
    const [companyInfo, setCompanyInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [interval, setInterval] = useState("1d"); // Default interval

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/api/stock/stockInfo/${ticker}`);
                console.log(res.data);
                setCompanyInfo(res.data);
            } catch (err) {
                console.error("Error fetching stock info", err);
            } finally {
                setIsLoading(false);
            }
        };
        getData();
    }, [ticker]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-xl font-bold">Loading...</div>
            </div>
        );
    }

    if (!companyInfo) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-red-500 text-xl font-bold">No data available.</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white px-6 py-10">
            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">{ticker || "Company Name"}</h1>
                <img
                    src={companyInfo.icon}
                    alt="Company Logo"
                    className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-700"
                />
            </div>

            {/* Company Details */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <p>
                        <strong>Address:</strong> {companyInfo.address1}, {companyInfo.city}, {companyInfo.state}, {companyInfo.country}, {companyInfo.zip}
                    </p>
                    <p>
                        <strong>Phone:</strong> {companyInfo.phone}
                    </p>
                    <p>
                        <strong>Sector:</strong> {companyInfo.sector}
                    </p>
                    <p>
                        <strong>Industry:</strong> {companyInfo.industry}
                    </p>
                    <p>
                        <strong>Employees:</strong> {companyInfo.fullTimeEmployees.toLocaleString()}
                    </p>
                    <p>
                        <strong>Website:</strong>{" "}
                        <a
                            href={companyInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                        >
                            {companyInfo.website}
                        </a>
                    </p>
                </div>
                <div className="mt-6">
                    <p>
                        <strong>Summary:</strong> {companyInfo.longBusinessSummary}
                    </p>
                </div>
            </div>

            {/* Interval Selector */}
            <div className="flex items-center justify-center mb-8">
                <label htmlFor="interval" className="text-lg font-bold mr-4">
                    Select Interval:
                </label>
                <select
                    id="interval"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                >
                    <option value="1d">Day</option>
                    <option value="1wk">Week</option>
                    <option value="1mo">Month</option>
                    <option value="3mo">3 Months</option>
                </select>
            </div>

            {/* Chart Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Stock Performance</h2>
                <CompanyCharts ticker={ticker} interval={interval} />
            </div>
        </div>
    );
};

export default Company;
