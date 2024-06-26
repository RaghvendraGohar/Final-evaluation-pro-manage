import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv"
import cors from 'cors';
import taskRouter from "./routes/task.js"
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
// ---------------------------------------------------------------------

app.get('/health',(req,res)=>{
    console.log("health api");
    res.json({
        service:"Backed app",
        status:"active",
        time:new Date(),
    })
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/task",taskRouter);

// ----------------------------------------------------------------
mongoose
.connect("mongodb+srv://raghv:123123123@cluster0.9sw4ktm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
    serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
  })
.then(()=>{console.log("Db connected")})
.catch((e)=>{console.log("Db failed to connect :",e)})

app.listen(PORT,()=>{
    console.log(`backendend running on ${PORT}`)
});