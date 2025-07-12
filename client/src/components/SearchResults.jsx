import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "./axiosConfig";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchResults = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/api/stock/search/${searchTerm}`);
      setResults(response.data);
    } catch (err) {
      console.error("Error searching stocks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="bg-gray-800 p-4 m-2 rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-300 text-center">
        Search Results for "{initialQuery}"
      </h1>

      {isLoading ? (
        <div className="text-center text-white font-bold">Searching...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((stock, index) => (
            <div
              key={index}
              className="bg-gray-950 p-3 rounded-lg shadow-lg hover:scale-105 hover:border-2 hover:border-purple-900 cursor-pointer transition"
              onClick={() => navigate(`/company/${stock.symbol}`)}
            >
              <img
                src={stock.icon}
                alt={`${stock.symbol} logo`}
                className="w-16 h-16 mx-auto mb-2"
              />
              <h2 className="text-lg font-semibold text-white text-center">
                {stock.shortname}
              </h2>
              <p className="text-gray-400 text-center">Symbol: {stock.symbol}</p>
              <p className="text-blue-400 text-center">{stock.exchDisp}</p>
              <p className="text-green-400 text-center">{stock.sector}</p>
              <p className="text-yellow-400 text-center text-sm">{stock.industry}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-center">No results found.</div>
      )}
    </div>
  );
};

export default SearchResults;
