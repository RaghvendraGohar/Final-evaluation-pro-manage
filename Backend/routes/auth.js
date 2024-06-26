import express from "express";
import { registerUser,loginUser, updateUser, addPerson, getAddPeople } from "../controller/user.js";
const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.patch("/update/:userId",updateUser)
router.post('/:userId/addPeople', addPerson);
router.get('/:userId/addPeople', getAddPeople);


export default router;