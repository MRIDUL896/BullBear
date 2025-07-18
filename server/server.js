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
  keys: [process.env.SESSION_SECRET || 'default_secret_key'],
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'none',
  secure: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const allowedOrigins = [
  'http://localhost:5173',
  'https://mridul896.github.io',
  'https://mridul896.github.io/BullBear',
  'https://bullbear-zctw.onrender.com'
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