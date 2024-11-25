const { error } = require('console');
const joi = require('joi');

const { 
    createOrder, 
    getOrderByUserId, 
    getOrderById, 
    updateOrderStatus, 
    updateOrderStatusByCourier,
    deleteOrder ,
    getAllOrders,
    getOrdersByCourier,
    assignCourierToOrder,
} = require('../models/orderModel');


const validateOrder = (data) => {
    const schema = joi.object({
        userId: joi.number().required(),
        pickupLocation: joi.string().required(),
        dropoffLocation: joi.string().required(),
        packageDetails: joi.string().required(),
        deliveryTime: joi.date().required(),
    });
    return schema.validate(data);
};

const createOrderController = async(req,res)=>{
    const{error}=validateOrder(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const{userId,pickupLocation,dropoffLocation,packageDetails,deliveryTime}=req.body;
    try {
        const newOrder =await createOrder(userId,pickupLocation,dropoffLocation,packageDetails,deliveryTime);
        res.status(201).json(newOrder);
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getOrderDetailsController = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await getOrderById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (err) {
        console.error("Error fetching order details:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getOrdersByUserController= async(req,res)=>{
        const{userId}=req.params;
        try {
            const orders=await getOrderByUserId(userId);
            res.status(201).json(orders);
        } catch (err) {
            console.error("error fetching orders : ",err);
            res.status(500).json({error:'server error'});
        }
};

const updateOrderStatusController=async(req,res)=>{
    const{orderId}=req.params;
    const{status}=req.body;
    try {
        const updatedOrder= await updateOrderStatus(orderId,status);
        res.status(201).json(updatedOrder);
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteOrderController=async(req,res)=>{
    const{orderId}=req.params;
    try {
        const deletedOrder= deleteOrder(orderId);
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error("error deleting order:", err);
        res.status(500).json({error:'server error'});
    }
};

const getOrdersByCourierController = async (req, res) => {
    const { courierId } = req.params;

    try {
        const orders = await getOrdersByCourier(courierId);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'No orders assigned to this courier' });
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders for courier:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateCourierOrderStatusController = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = await updateOrderStatusByCourier(orderId, status);

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found or not assigned to this courier' });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ error: 'Server error' });
    }
};


const assignCourierController = async (req, res) => {
    const { orderId, courierId } = req.body; // Extract both values from the request body

    // Validate input
    if (!orderId || !courierId) {
        return res.status(400).json({ error: 'Both orderId and courierId are required' });
    }

    try {
        // Call the service function to assign the courier
        const updatedOrder = await assignCourierToOrder(orderId, courierId);

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Respond with the updated order details
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error assigning courier to order:', err);
        res.status(500).json({ error: 'Server error' });
    }
};



const getAllOrdersController=async(req,res)=>{
    try {
        const orders=await getAllOrders();
        res.status(201).json(orders);
   } catch (err) {
    console.error("error fetching orders:", err);
    res.status(500).json({error:'server error'});
    }
};


module.exports={
    getAllOrdersController,
    createOrderController,
    getOrdersByUserController,
    updateOrderStatusController,
    deleteOrderController,
    getOrderDetailsController,
    getOrdersByCourierController,
    updateCourierOrderStatusController,
    assignCourierController,
};