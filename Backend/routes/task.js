import express from "express";
import { createTask, deleteTask, getTasksByUser, updateTask } from "../controller/task.js";
import { verifyToken } from "../middleware/verify.js";
const router = express.Router();

router.post('/create',verifyToken,createTask);
router.put('/update/:id',verifyToken,updateTask);
router.get('/user/:userId',getTasksByUser);
router.delete('/delete/:id',deleteTask)


export default router;


