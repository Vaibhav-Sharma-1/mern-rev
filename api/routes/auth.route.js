import express from "express";
import { signUp, signIn, google } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp).post("/signin", signIn).post('/google', google)

export default router