//const express = require('express');
import express from 'express';

import authRouter  from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';

import dotenv from 'dotenv';
import cors from 'cors';

import cookieParser from "cookie-parser"
import { connectDB } from './database/db.js';


dotenv.config();



const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

app.listen(PORT , ()=>{
    console.log( `Server is running on port ${PORT}`);
    connectDB(); 


})

 

app.use('/api/auth', authRouter);
app.use('/api/message',messageRouter);


