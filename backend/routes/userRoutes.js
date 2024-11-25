const express =require('express');
const {register,login,getCouriersController} =require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router= express.Router();

router.post('/register' ,register);
router.post('/login', login);
router.get('/couriers',getCouriersController);

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

module.exports= router;