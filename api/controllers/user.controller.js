import bcryptjs from "bcryptjs";
import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.send("User API")
}

export const updateUser = async (req, res, next) => {
    console.log("after")
    if (req.user.id !== req.params.user_id) return next(errorHandler(403, 'you are not allowed to update this user'))

    const { username, password, profilePicture } = req.body;

    if (!username && !password && !profilePicture) return next(errorHandler(400, "Please provide one of the following: username, password, profilePicture"))

    if (password) {
        if (password.length < 6) return next(errorHandler(400, "Password must be at least 6 characters"))

        password = bcryptjs.hashSync(password, 12)
    }

    if (username) {
        if (username.length < 7 || username.length > 20) return next(errorHandler(400, "Username must be between 7 and 20 characters"))
        if (username.includes(" ")) return next(errorHandler(400, "Username cannot contain spaces"))
        if (username !== username.toLowerCase()) return next(errorHandler(400, "Username must be lowercase"))
        if (!username.match(/^[a-zA-Z0-9]+$/)) return next(errorHandler(400, 'Username can only contain letters and numbers'));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.user_id, {
            $set: {
                username, password, profilePicture
            }
        }, { new: true })

        const { pasword, ...restUser } = updatedUser._doc
        res.status(200).json({ message: "User Updated Successfully", error: false, data: restUser })
    } catch (error) {
        next(error)
    }

}


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.user_id) return next(errorHandler(403, 'you are not allowed to delete this user'))

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.user_id);
        res.status(200).json({ error: false, message: "User Deleted Successfully", })
    } catch (error) {
        next(error)
    }
}
export const deleteUsers = async (req, res, next) => {
    if (!req.user.isAdmin) return next(errorHandler(403, 'you are not allowed to delete this user'))

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.user_id);
        res.status(200).json({ error: false, message: "User Deleted Successfully", })
    } catch (error) {
        next(error)
    }
}

export const signOut = (req, res, next) => {
    try {
        res.status(200).clearCookie('access_token').json({ error: false, message: "Signout Successfully" })
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) return next(errorHandler(403, "Not allowed to get all users"))

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find().sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);
        const usersWithOutPassword = users.map((user) => {
            const { pasword, ...restUser } = user._doc
            return restUser
        })

        const totalUsers = await User.countDocuments();

        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(), now.getMonth() - 1, now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        res.status(200).json({ error: false, message: 'Users Fetched Successfully!', data: usersWithOutPassword, totalUsers, lastMonthUsers })
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };