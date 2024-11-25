const express = require('express');
const {
    createOrderController,
    getOrdersByUserController,
    getOrderDetailsController,
    updateOrderStatusController,
    deleteOrderController,
    getAllOrdersController,
    getOrdersByCourierController,
    updateCourierOrderStatusController,
    assignCourierController,
} = require('../controllers/orderController');

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Create a new order
router.post('/orders', authenticateToken, createOrderController);

// Get all orders (admin only)
router.get('/orders', authenticateToken, authorizeRole('admin'), getAllOrdersController);

// Get orders by a specific user
// router.get('/orders/user/:userId', authenticateToken, (req, res, next) => {
//     if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Access denied' });
//     }
//     next();
// }, getOrdersByUserController);

router.get('/orders/user/:userId',authenticateToken,getOrdersByUserController);

// Get a specific order's details
router.get('/orders/:orderId', authenticateToken, getOrderDetailsController);

// Update the status of an order (admin only)
router.put('/orders/newStatus/:orderId', authenticateToken, updateOrderStatusController);

// Delete an order (admin only)
router.delete('/orders/:orderId', authenticateToken, authorizeRole('admin'), deleteOrderController);

// Get all orders assigned to a specific courier (courier only)
router.get('/courier/orders/:courierId', authenticateToken, authorizeRole('courier'), getOrdersByCourierController);

// Update the status of an order by a courier
router.put('/courier/orders/:orderId/status', authenticateToken, authorizeRole('courier'), updateCourierOrderStatusController);

// Assign a courier to an order (admin only)
router.post('/orders/assign', authenticateToken, authorizeRole('admin'), assignCourierController);

module.exports = router;
