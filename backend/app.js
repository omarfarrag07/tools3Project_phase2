const express =require('express');
const dotenv= require('dotenv');
const cors = require('cors');
const userRoutes =require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app =express();

const corsOptions = {
    origin: 'http://localhost:4200', // For an Angular app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Enable cookies if needed
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/users',userRoutes);

app.use('/api',orderRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
});