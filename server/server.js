const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const stockRoute = require('./routes/stocksRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173", // Allow requsts from this origin
    credentials: true, // Allow credentials (cookies, etc.)
}));

app.use('/api/stock', stockRoute);

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`server started on ${port}`);
})