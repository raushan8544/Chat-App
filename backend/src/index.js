//const express = require('express');
import express from 'express';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connectDB } from './database/db.js';
import { app , server} from './database/socket.io.js'

import path from 'path';

dotenv.config();

console.log('OPENAI_API_KEY loaded:', Boolean(process.env.OPENAI_API_KEY));

 
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Always set limit BEFORE routes and only once
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());


// ✅ Register routes after middleware
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

// ✅ Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}


// ✅ Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  connectDB();
});

 

 

