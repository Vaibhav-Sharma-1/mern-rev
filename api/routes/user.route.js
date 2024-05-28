import express from "express";
import { test, updateUser, deleteUser, signOut, getUsers,deleteUsers, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", test).get("/getusers", verifyToken, getUsers).get('/:userId', getUser);
router.put("/update/:user_id", verifyToken, updateUser)
router.delete("/delete/:user_id", verifyToken, deleteUser).delete("/deleteusers/:user_id", verifyToken, deleteUsers)
router.post("/signout", signOut);


export default router