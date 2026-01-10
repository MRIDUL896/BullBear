import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import api from "./axiosConfig";

const Trending = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [trending, setTrending] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                await api.get('/api/stock/trending').then((res) => {
                    console.log(res.data.body)
                    setTrending(res.data.body);
                    setIsLoading(false);
                });
            } catch (err) {
                console.error("Error fetching trending stocks:", err);
            }
        };
        getData();
    }, []);

    return (
        <div className="bg-gray-800 p-4 m-2 rounded-lg">
            {isLoading ? (
                <div className="text-center text-white font-bold h-screen">Loading...
                <br />
                (Might take upto a minute for first time)</div>
            ) : (
                <div>
                    <h1 className="text-2xl font-bold mb-4 text-blue-300">Trending Stocks</h1>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                        {trending.map((stock, index) => (
                            <div key={index} className="bg-gray-950 p-2 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105
                        hover:border-2 hover:border-purple-900 " onClick={() => navigate(`/company/${stock.symbol}`)} >
                                <img
                                    src={stock.icon}
                                    alt={`${stock.symbol} logo`}
                                    className="w-16 h-16 mx-auto mb-4"
                                />
                                <div className="flex-col items-center justify-center">
                                    <h2 className="text-lg font-semibold text-center text-white">
                                        {stock.symbolName}
                                    </h2>
                                    <p className="text-center text-gray-400">
                                        Symbol: {stock.symbol}
                                    </p>
                                    <p className="text-center text-green-400 font-bold">
                                        Last Price: ${stock.lastPrice}
                                    </p>
                                    <p className="text-center text-blue-400">
                                        Change: {stock.priceChange} ({stock.percentChange})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trending;
