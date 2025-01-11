import express from 'express';
import Connection from './Database/db.js';
import dotenv from 'dotenv';
import Defaultdata from './default.js';

const app = express();

const PORT =8000;
dotenv.config();

const Username=process.env.USERNAME;
const Password=process.env.PASSWORD;

Connection();

app.listen(PORT,()=>{
    console.log(`Server is successfully running at port ${PORT} `);
})

Defaultdata();