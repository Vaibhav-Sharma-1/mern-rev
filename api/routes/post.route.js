import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, getPosts, deletePost, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createPost)
router.get("/getposts", getPosts)
router.delete("/delete/:post_id/:user_id", verifyToken, deletePost)
router.put("/update/:post_id/:user_id", verifyToken, updatePost)

export default router