import dotenv from "dotenv"
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import authRoutes from "./routes/auth.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from 'path';

dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log("DB Connection Failed", err)
})

const __dirname = path.resolve();

const app = express()

const PORT = 3000

app.use(express.json());
app.use(cookieParser())

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    res.status(statusCode).json({
        error: true,
        statusCode, message
    })
})

app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})