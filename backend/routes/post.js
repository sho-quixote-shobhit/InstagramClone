const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')
const requireLogin = require('../middlewares/requireLogin')

router.post('/createpost', requireLogin, async (req, res) => {
    const { title, body, imageurl } = req.body;
    if (!body || !title || !imageurl) {
        console.log(title, body, imageurl)
        return res.json({ error: "Please add all fields" })
    }
    try {
        req.user.password = undefined
        const newPost = new Post({
            title, body,
            photo: imageurl,
            postedBy: req.user
        })
        await newPost.save().then(async (result) => {
            await User.findByIdAndUpdate(req.user._id, {
                $push: { posts: newPost._id }
            })
            res.json({ post: result })
        }).catch(err => {
            res.json({ error: "Server error!!" })
            console.log(err)
        })
    } catch (error) {
        res.json({ error: "Server error!!" })
        console.log(error)
    }
})

router.get('/allposts', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'posts',
            populate: {
                path: 'postedBy',
            },
        }).populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate : {
                    path : 'createdBy'
                }
            },
        })
        const followingArray = user.following
        const allposts = [];
        for (const following of followingArray) {
            const user = await User.findById(following)
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'postedBy',
                    },
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                        populate : {
                            path : 'createdBy'
                        }
                    },
                })
                .exec();

            user.posts.forEach((post) => {
                post.postedBy.password = undefined
                post.postedBy.email = undefined
                allposts.push(post);
            });
        }
        user.posts.forEach((post) => {
            post.postedBy.password = undefined
            post.postedBy.email = undefined
            allposts.push(post);
        });
        allposts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({allposts})
    } catch (error) {
        console.log(error)
    }
})

router.get('/myposts', requireLogin, async (req, res) => {
    try {
        await User.find({ _id: req.user._id }).populate('posts', '-password -email').then(myposts => {
            myposts[0].password = undefined
            res.json({ myposts })
        }).catch(err => {
            console.log(err)
        })
    } catch (error) {
        res.json({ error: "Server error!!" })
        console.log(error)
    }
})

router.post('/one', requireLogin, async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.json({ error: "No post" })
    }
    try {
        await Post.find({ _id: postId }).populate('postedBy comments.createdBy', '-password -email').then(post => {
            res.json({ post })
        }).catch(err => {
            res.json({ error: "server error" })
            console.log(err)
        })

    } catch (error) {
        res.json({ error: 'server error!!' })
        console.log(error)
    }
})

router.put('/like', requireLogin, async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.json({ error: "No post" })
    }
    try {
        const post = await Post.findByIdAndUpdate(postId, {
            $push: { likes: req.user._id }
        }, { new: true }).populate('postedBy comments.createdBy', '-password -email')

        const user = await User.findByIdAndUpdate(req.user._id , {
            $push : {likedPosts : postId}
        } , {new : true})
        user.password = undefined

        res.json({post , user})

    } catch (error) {
        res.json({ error: "Server error try again" })
        console.log(error)
    }
})

router.put('/unlike', requireLogin, async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.json({ error: "No post" })
    }
    try {
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: { likes: req.user._id }
        }, { new: true }).populate('postedBy comments.createdBy', '-password -email')

        const user = await User.findByIdAndUpdate(req.user._id , {
            $pull : {likedPosts : postId}
        } , {new : true})
        user.password = undefined

        res.json({post , user})

    } catch (error) {
        res.json({ error: "Server error try again" })
        console.log(error)
    }
})

router.put('/comment', requireLogin, async (req, res) => {
    const { text, postId } = req.body;
    if (!text) {
        return res.json({ error: 'Comment cannot be empty!!' })
    }
    try {
        const comment = {
            text: text,
            createdBy: req.user._id
        }
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment }
        }, { new: true }).populate('postedBy comments.createdBy', '-password -email').then(post => {
            return res.json({ post })
        })
    } catch (error) {
        console.log(error)
        res.json({ error: 'Server error!!' })
    }
})

router.delete('/delete/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    if (!postId) {
        return res.json({ error: 'No Post' })
    }
    try {
        await User.findByIdAndUpdate(req.user._id , {
            $pull : {posts : postId}
        })
        await Post.findByIdAndDelete(postId).then(post => {
            res.json({ post })
        })
    } catch (error) {
        res.json({ error: " 'server error" })
    }
})



module.exports = router