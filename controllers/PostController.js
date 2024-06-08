import PostModel from '../models/Post.js'

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId
        })
        const post = await doc.save();
        return res.status(200).json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Post creation failed'})
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec()

        return res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Failed to get posts'})
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()

        const _tags = posts.reduce((acc, cur) => [...acc, ...cur.tags], []);
        const tags = [...new Set(_tags)].slice(0,5);

        return res.status(200).json(tags)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Failed to get tags'})
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: "after"
            },
        ).populate("user")

        if (!post) return res.status(404).json({message: 'Post not found'})
        return res.status(200).json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Failed to get post'})
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const deleteInfo = await PostModel.deleteOne({_id: postId})

        if (!deleteInfo?.deletedCount) return res.status(404).json({message: 'Post not found'})
        return res.status(200).json({message: 'Post has been successfully deleted'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Failed to delete post'})
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await PostModel.updateOne({_id: postId}, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
        })
        if (!updatedPost?.matchedCount) res.status(404).json({message: 'Post not found'})
        return res.status(200).json({message: 'Post has been successfully updated'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Post has not been updated'})
    }
}

