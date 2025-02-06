const express = require('express');
const { handleSignup, handleLogin, handleLogout, handleGoogleLogin } = require('../controllers/authController');
const router = express.Router(); 

router.post('/signup',handleSignup);
router.post('/login',handleLogin);
router.post('/google-login',handleGoogleLogin)
router.post('/logout',handleLogout);

module.exports = router;