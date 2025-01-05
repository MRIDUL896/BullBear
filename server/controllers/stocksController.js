const axios = require('axios');
const dotenv = require('dotenv');


dotenv.config();
const RAPID_API_KEY = process.env.RAPID_API_KEY

const getTrendingStocks = async (req, res) => {
    try {
        // Fetch the most active stocks data from Yahoo Finance API
        const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/options/most-active', {
            params: { type: 'STOCKS' },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
            },
        });
        const trendingWithLogos = response.data.body;

        trendingWithLogos.map((stock) => {
            stock.icon = `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock.symbol}.png`
        })

        // Send the trending stocks with their logos
        res.json({ body: trendingWithLogos });
    } catch (error) {
        console.error('Error fetching most active options:', error);
        res.status(500).json({ error: 'Failed to fetch most active options' });
    }
};

// Controller to handle the stock search
const searchStock = async (req, res) => {
    const {searchQuery} = req.params;
    // console.log(RAPID_API_KEY)
    try {
        const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/search', {
            params: { search: searchQuery },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        });

        const stocks = response.data.body;

        stocks.map((stock) => {
            stock.icon = `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock.symbol}.png`;
        })

        // Send the response data as JSON to the client
        res.json(response.data.body);
    } catch (error) {
        console.error('Error searching stock:', error);
        res.status(500).json({ error: 'Failed to search stock' });
    }
};

const getStockInfo = async (req,res) => {
    const {symbol} = req.params;
    try{
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules?ticker=${symbol}&module=asset-profile`, {
            params: {
                symbol: symbol,
            },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        });
        const info = response.data.body;
        info.icon = `https://logo.clearbit.com/${info.website}`;
        res.status(200).json(info);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
}

const getStockHistory = async (req, res) => {
    const {symbol,range} = req.params;
    try {
        const resp = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history', {
            params: {
                symbol: symbol,
                interval: range,
                diffandsplits: 'false'
            },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        });
        let response = {};
        let history = resp.data.body;
        const labels = [],open = [],close = [], high = [], low = [];
        if(range == '1d'){
            let historyEntries = Object.entries(history);
            //historyEntries.sort((a, b) => new Date(a[0]) - new Date(b[0]));
            historyEntries = historyEntries.slice(-30);
            for (const [key, value] of historyEntries) {
                labels.push(value.date); // Use key as the date
                open.push(value.open);
                close.push(value.close);
                high.push(value.high);
                low.push(value.low);
            }
        }else{
            for(let day in history){
                labels.push(history[day].date)
                open.push(history[day].open)
                close.push(history[day].close)
                high.push(history[day].high)
                low.push(history[day].low)
            }
        }
        response.meta = resp.data.meta
        response.labels = labels;
        response.open = open;
        response.close = close;
        response.high = high;
        response.low = low;
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching stock history:', error);
        res.status(500).json({ error: 'Failed to fetch stock history' });
    }
};

const getNews = async (req, res) => {
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v2/markets/news`, {
            params: {
                type: 'ALL',
            },
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY, // Use environment variables for API keys
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        });

        // Send only the data part of the response back to the client
        res.status(200).json(response.data);
    } catch (err) {
        console.error('Error fetching stock news:', err.message);
        res.status(500).json({ error: 'Failed to fetch stock news' });
    }
};

module.exports = {getTrendingStocks,searchStock,getStockHistory,getStockInfo,getNews}