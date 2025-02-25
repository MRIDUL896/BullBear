const express = require('express');
const {searchStock, getStockHistory, getTrendingStocks, getStockInfo, getNews, getStockIcons } = require('../controllers/stocksController');
const router = express.Router();

router.get('/history/:symbol/:range', getStockHistory);
router.get('/search/:searchQuery', searchStock);
router.get('/trending',getTrendingStocks);
router.get('/stockInfo/:symbol',getStockInfo);
router.get('/news',getNews);
router.post('/getIcons',getStockIcons);


module.exports = router;