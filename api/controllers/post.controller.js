import Post from "../models/post.models.js";
import { errorHandler } from "../utils/error.js"

export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) return next(errorHandler(403, "Not allowed to create a post "));

    const { title, content, category, image } = req.body;

    if (!title || !content) return next(errorHandler(400, "Please provide title and content"));

    const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new Post({ title, content, slug, userId: req.user.id, category, image })

    try {
        const savedPost = await newPost.save();
        res.status(200).json({ error: false, message: 'Post Published Successfully!', data: savedPost })
    } catch (error) {
        next(error)
    }

}

export const getPosts = async (req, res, next) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    try {
        const posts = await Post.find(
            {
                ...(req.query.userId && { userId: req.query.userId }),
                ...(req.query.category && { category: req.query.category }),
                ...(req.query.slug && { slug: req.query.slug }),
                ...(req.query.postId && { _id: req.query.postId }),
                ...(req.query.searchTerm && {
                    $or: [
                        { title: { $regex: req.query.searchTerm, $options: 'i' } },
                        { content: { $regex: req.query.searchTerm, $options: 'i' } },
                    ]
                }),
            }
        ).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(), now.getMonth() - 1, now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        res.status(200).json({ error: false, message: 'Posts Fetched Successfully!', data: posts, totalPosts, lastMonthPosts })
    } catch (error) {
        next(error)
    }
}

export const deletePost = async (req, res, next) => {
    const { post_id, user_id } = req.params
    if (!req.user.isAdmin || req.user.id !== user_id) return next(errorHandler(403, "Not allowed to delete a post "));

    try {
        const deletedPost = await Post.findByIdAndDelete(post_id);
        res.status(200).json({ error: false, message: 'Post Deleted Successfully!', })
    } catch (error) {
        next(error)
    }

}


export const updatePost = async (req, res, next) => {
    const { post_id, user_id } = req.params
    const { title, content, category, image } = req.body
    if (!req.user.isAdmin || req.user.id !== user_id) return next(errorHandler(403, "Not allowed to update a post "));

    try {
        const updatedPost = await Post.findByIdAndUpdate(post_id, {
            $set: { title, content, category, image }
        }, { new: true });
        
        res.status(200).json({ error: false, message: 'Post Updated Successfully!', data: updatedPost })

    } catch (error) {
        next(error)
    }

}



