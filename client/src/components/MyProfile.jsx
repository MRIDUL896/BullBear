import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "./axiosConfig";

const MyProfile = () => {
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo?.user);
    const [stockIcons, setStockIcons] = useState({}); // Store stock symbols & their icons

    useEffect(() => {
        const fetchIcons = async () => {
            try {
                if (!userInfo?.interestedStocks?.length) return;

                const res = await api.post('/api/stock/getIcons', { symbols: userInfo.interestedStocks });
                
                // Assuming API response: { icons: ["url1", "url2", ...] }
                const iconsData = res.data.icons;

                // Map symbols to their respective icons
                const mappedIcons = userInfo.interestedStocks.reduce((acc, symbol, index) => {
                    acc[symbol] = iconsData[index]; 
                    return acc;
                }, {});

                setStockIcons(mappedIcons);
            } catch (error) {
                console.error("Error fetching stock icons:", error);
            }
        };

        fetchIcons();
    }, [userInfo]); // Depend on userInfo to update when it changes

    if (!userInfo) {
        return <div className="text-center text-white font-bold h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-800 p-6 m-4 rounded-lg text-white">
            <h1 className="text-3xl font-bold mb-4 text-blue-300">My Profile</h1>
            <div className="bg-gray-950 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-purple-400">{userInfo.name}</h2>
                <p className="text-gray-400">Email: {userInfo.email}</p>
                <p className="text-gray-400">User ID: {userInfo.uid}</p>
                <p className="text-gray-400">Joined: {new Date(userInfo.createdAt).toDateString()}</p>

                <h3 className="text-lg font-semibold text-green-400 mt-4">Interested Stocks</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    {userInfo.interestedStocks?.length > 0 ? (
                        userInfo.interestedStocks.map((stock, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-700 p-2 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center justify-center gap-2"
                                onClick={() => navigate(`/company/${stock}`)}
                            >
                                {stockIcons[stock] && (
                                    <img src={stockIcons[stock]} alt={stock} className="w-6 h-6" />
                                )}
                                <span>{stock}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No interested stocks</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
