
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
