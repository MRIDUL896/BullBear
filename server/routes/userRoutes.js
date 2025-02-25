const express = require('express');
const { handleSignup, handleLogin, handleLogout, handleGoogleLogin, addSymbol } = require('../controllers/userController');
const router = express.Router(); 

router.post('/signup',handleSignup);
router.post('/login',handleLogin);
router.post('/google-login',handleGoogleLogin);
router.post('/logout',handleLogout);
router.put('/addSymbol',addSymbol);

module.exports = router;