const bcrypt = require('bcryptjs');
const joi = require('joi');
const jwt = require('jsonwebtoken'); // Import jwt
const {createUser, findUserByEmail ,getCouriers}= require('../models/userModel');

const validateRegistration =(data)=>{
    const schema = joi.object({
        name:joi.string().min(3).max(50).required(),
        email:joi.string().email().required(),
        password:joi.string().min(6).required(),
        phone:joi.string().min(10).max(15).required(),
        role: joi.string().required()
    });
    return schema.validate(data);
};


const register = async(req , res)=>{
    const {error}=validateRegistration(req.body);
    if (error) return res.status(400).json({error:error.details[0].message});
    const {name , email , phone,password, role}=req.body;
    try {
        const existingUser =  await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({error: 'User already exists with this email'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password ,salt);

        const newUser= await createUser(name,email,phone,hashedpassword,role);

        res.status(201).json({
            id: newUser.id,
            name:newUser.name,
            email:newUser.email,
            phone:newUser.phone,
            role: newUser.role,
        });
    } catch (err) {
        console.error(err);
        res.status(502).json({error:'server error'});
    }
};

const validateLogin = (data)=>{
    const schema =joi.object( {
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),});

    return schema.validate(data);
};
const login = async(req,res) =>{
    const {error}= validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const {email , password}= req.body;
    try {
        const user =await findUserByEmail(email);
        if(!user){
            return res.status(400).json({error: 'Invalid email or password'});
     }

     const isMatch = await bcrypt.compare(password,user.password);
     if(!isMatch){
        return res.status(400).json({error :'Invalid email or password'})
     }
     const token = jwt.sign(
        {id :user.id,role:user.role },
         process.env.JWT_SECRET,
        {expiresIn: '1h'}); 

        res.status(200).json({
            token, // Send the token to the client
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role // Include the role in the response
        });
        
     } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
};

const getCouriersController = async (req, res) => {
    try {
        const couriers = await getCouriers();
        if (couriers.length === 0) {
            return res.status(404).json({ message: 'No couriers found' });
        }
        res.status(200).json(couriers);
    } catch (err) {
        console.error('Error fetching couriers:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports={
    register,
    login,
    getCouriersController,
};