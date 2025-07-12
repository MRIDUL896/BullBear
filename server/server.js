const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const stockRoute = require('./routes/stocksRoutes');
const userRoute = require('./routes/userRoutes')
const database = require('./dbConnection')
const cors = require('cors');
const cookieSession = require('cookie-session');

dotenv.config();
const app = express();
database();

app.use(cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || 'default_secret_key'], // Add a secret key
    maxAge: 24 * 60 * 60 * 1000 // Corrected maxAge to 1 day (previously 100ms)
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const allowedOrigins = [
  'https://mridul896.github.io'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use('/api/stock', stockRoute);
app.use('/api/user' , userRoute)

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`server started on ${port}`);
})