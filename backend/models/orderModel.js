const pool =require('../config/db');

const createOrder =async(userId,pickupLocation,dropoffLocation,packageDetails,deliveryTime)=>{

    try {
        const sqlQuery=`INSERT INTO orders (user_id, pickup_location,dropoff_location,package_details,delivery_time,status)
        VALUES ($1,$2,$3,$4,$5,'pending') RETURNING *;
        `;
        const result=await pool.query(sqlQuery,[userId,pickupLocation,dropoffLocation,packageDetails,deliveryTime]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating order:', error.message);
        throw error;
    }

};


const getOrderByUserId=async(userId)=>{
        try {
            const sqlQuery='SELECT * FROM orders WHERE user_id = $1';
            const result =await pool.query(sqlQuery,[userId]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching orders by user ID:', error.message);
        throw error;
        }
};

const getOrderById = async (orderId) => {
    try {
        const sqlQuery = 'SELECT * FROM orders WHERE order_id = $1';
        const result = await pool.query(sqlQuery, [orderId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching order by ID:', error.message);
        throw error;
    }
};


const updateOrderStatus=async(orderId,status)=>{
       try {
        const sqlQuery=`
        UPDATE orders 
        SET status= $1
        WHERE order_id =$2
        RETURNING *;
        `;
        const result= await pool.query(sqlQuery,[status,orderId]);
        return result.rows[0];
       } catch (error) {
        console.error('Error updating order status:', error.message);
        throw error;
       }
};

const deleteOrder = async (orderId) => {
    try {
        const sqlQuery = 'DELETE FROM orders WHERE order_id = $1 RETURNING *';
        const result = await pool.query(sqlQuery, [orderId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting order:', error.message);
        throw error;
    }
};

const getOrdersByCourier = async (courierId) => {
    try {
        const sqlQuery = 'SELECT * FROM orders WHERE courier_id = $1';
        const result = await pool.query(sqlQuery, [courierId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching orders by courier ID:', error.message);
        throw error;
    }
};


const getAllOrders = async()=>{
    try {
        const sqlQuery='SELECT * FROM orders ';
        const result=await pool.query(sqlQuery);
        return result.rows;
    } catch (error) {
        console.error('Error fetching orders', error.message);
        throw error;
    }
};

const updateOrderStatusByCourier = async (orderId, status) => {
    try {
        const sqlQuery = `
            UPDATE orders
            SET status = $1
            WHERE order_id = $2 AND courier_id IS NOT NULL
            RETURNING *;
        `;
        const result = await pool.query(sqlQuery, [status, orderId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating order status by courier:', error.message);
        throw error;
    }
};

const assignCourierToOrder = async (orderId, courierId) => {
    try {
        const sqlQuery = `
            UPDATE orders
            SET courier_id = $1
            WHERE order_id = $2
            RETURNING *;
        `;
        const result = await pool.query(sqlQuery, [courierId, orderId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error assigning courier to order:', error.message);
        throw error;
    }
};

module.exports={
    getAllOrders,
    createOrder,
    getOrderById,
    getOrderByUserId,
    updateOrderStatus,
    updateOrderStatusByCourier,
    deleteOrder,
    getOrdersByCourier,
    assignCourierToOrder,
};