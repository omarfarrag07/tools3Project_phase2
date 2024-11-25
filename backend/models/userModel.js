const pool =require('../config/db');

const createUser= async(name , email , phone , hashedpassword,role) =>{
    sqlQuery='INSERT INTO users (name , email, phone , password ,role) VALUES ($1,$2,$3,$4,$5) RETURNING *' ;
    const result = await pool.query(sqlQuery,[name,email,phone,hashedpassword, role]);
    return result.rows[0];
};

const findUserByEmail =async (email)=>{
    sqlQuery='SELECT * FROM users WHERE email = $1';
    const result = await pool.query(sqlQuery,[email]);
    return result.rows[0];
};

const getCouriers = async () => {
    try {
        const COURIER_ROLE_ID = 2;
        const sqlQuery = 'SELECT * FROM users WHERE role = $1';
        const result = await pool.query(sqlQuery, ['courier']);
        return result.rows;
    } catch (error) {
        console.error('Error fetching couriers:', error.message);
        throw error;
    }
};


module.exports= {
    createUser,
    findUserByEmail,
    getCouriers,
};