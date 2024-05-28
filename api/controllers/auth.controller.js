import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        return next(errorHandler(400, "All fields are required"))
    }
    else {

        const hashedPassword = bcryptjs.hashSync(password, 12)

        const newUser = new User({
            username, email, password: hashedPassword
        })

        try {
            await newUser.save()

            res.status(200).json({ message: "Account Successfully Created", error: false })
        } catch (error) {
            next(error)
        }
    }
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        next(errorHandler(400, "All fields are required"))
    }

    try {
        const validUser = await User.findOne({ email })

        if (!validUser) {
            return next(errorHandler(404, "email or password is not correct"))
        }
        const { password, ...restUser } = validUser._doc
        const validPassword = bcryptjs.compare(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(404, "email or password is not correct"))
        }

        const token = jwt.sign({ id: validUser._id, isAdmin: restUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.status(200).cookie('access_token', token, { httpOnly: true }).json({ message: "Successfully Logged In", error: false, data: restUser })

    } catch (error) {
        next(error)
    }
}


export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body

    if (!name || !email || !googlePhotoUrl || name === "" || email === "" || googlePhotoUrl === "") {
        return next(errorHandler(400, "All fields are required"))
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" })
            const { password, ...restUser } = user._doc
            res.status(200).cookie('access_token', token, { httpOnly: true }).json({ message: "Successfully Logged In", error: false, data: restUser })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedGeneratedPassword = bcryptjs.hashSync(generatedPassword, 12)

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedGeneratedPassword,
                profilePicture: googlePhotoUrl
            })

            await newUser.save();

            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" })
            const { password, ...restUser } = newUser._doc
            res.status(200).cookie('access_token', token, { httpOnly: true }).json({ message: "Successfully Logged In", error: false, data: restUser })

        }
    } catch (error) {
        next(error)
    }
}