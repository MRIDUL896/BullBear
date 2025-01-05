import { useEffect, useState } from "react";
import api from "./axiosConfig";

const News = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [news, setNews] = useState([]);

    useEffect(() => {
        const getNews = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/stock/news');
                setNews(response.data.body);
                console.log(response.data.body);
            } catch (err) {
                console.error("Error fetching trending news:", err);
            } finally {
                setIsLoading(false);
            }
        };
        getNews();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-xl font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen py-6 px-4 rounded-lg">
            <h1 className="text-white text-4xl font-bold mb-6 text-center">Trending News</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((info, index) => (
                    <a
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        className="bg-gray-800 hover:bg-gray-700 transition duration-200 p-4 rounded-lg shadow-md"
                    >
                        <div className="flex flex-col h-full">
                            <img
                                src={info.img}
                                alt={info.title}
                                className="rounded-lg mb-4 object-cover w-full h-48"
                            />
                            <div className="flex-1">
                                <h2 className="text-white text-lg font-semibold mb-2">{info.title}</h2>
                                <p className="text-gray-400 text-sm line-clamp-3">{info.text}</p>
                            </div>
                            <div className="mt-4 text-gray-500 text-sm">
                                <span className="block">Source: <span className="text-gray-300">{info.source}</span></span>
                                <span className="block">{info.ago}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default News;
