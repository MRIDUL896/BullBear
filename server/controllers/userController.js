const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const dotenv = require("dotenv");
const generateTokenAndSetCookie = require("../utils/generateToken");

dotenv.config();

//Firebase Admin SDK
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CONFIG_BASE64, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const handleSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists in MongoDB" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let userRecord = await admin.auth().getUserByEmail(email);
        if(!userRecord){
            return res.status(400).json({ error: "User already exists in MongoDB" });
        }
        const newUser = new User({
            uid: userRecord.uid,
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { idToken } = req.body; 
        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        // Find user in MongoDB
        let user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Generate JWT Token
        generateTokenAndSetCookie(uid,res);
        res.json({ message: "Login successful" , user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleGoogleLogin = async (req, res) => {
    try {
        const { idToken , name, email} = req.body; 
        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        // Find user in MongoDB
        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({
                uid,
                name,
                email
            });
            await user.save();
        }
        // Generate JWT Token
        generateTokenAndSetCookie(uid,res);
        res.json({ message: "Login successful" , user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const handleLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Error occurred during logout",
        });
    }
};

const addSymbol = async (req,res) => {
    try{
        const {uid,symbol} = req.body;
        let user = await User.findOne({ uid });
        if(!user){
            return res.status(500).json({ error: error.message });
        }
        // console.log(symbol);
        const stocks = user.interestedStocks;
        stocks.push(symbol);
        user.interestedStocks = stocks;
        await user.save();
        res.status(200).json({message : 'success'});
    }catch(err){
        res.status(500).json({ error: err });
    }
}

module.exports = { handleSignup, handleLogin , handleLogout, handleGoogleLogin, addSymbol};
