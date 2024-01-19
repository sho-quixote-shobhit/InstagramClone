const express = require('express');
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.get('/:userId' , requireLogin , async(req,res)=>{
    const {userId} = req.params;
    if(!userId){
        return res.json({error : "No user!!"})
    }
    try {
        await User.find({_id : userId}).populate('posts' , '-password -email').then(result => {
            result[0].password = undefined
            res.json({profile : result})
        })
    } catch (error) {
        res.json({error : "Server error!!"})
        console.log(error)
    }
})

router.put('/follow' , requireLogin , async(req,res)=>{
    const {userId} = req.body
    if(!userId){
        return res.json({error : 'No user'})
    }
    try {
        await User.findByIdAndUpdate(userId , {
            $push : {followers : req.user._id}
        })
        await User.findByIdAndUpdate(req.user._id , {
            $push : {following : userId}
        } , {new : true}).then(user => {
            user.password = undefined
            res.json({user})
        })
    } catch (error) {
        res.json({error : 'Server error'})
        console.log(error)
    }
})

router.put('/unfollow' , requireLogin , async(req,res)=>{
    const {userId} = req.body
    if(!userId){
        return res.json({error : 'No user'})
    }
    try {
        await User.findByIdAndUpdate(userId , {
            $pull : {followers : req.user._id}
        })
        await User.findByIdAndUpdate(req.user._id , {
            $pull : {following : userId}
        } , {new : true}).then((user)=>{
            user.password = undefined
            res.json({user})
        })
        
    } catch (error) {
        res.json({error : 'Server error'})
        console.log(error)
    }
})

router.post('/editprofile' , requireLogin , async(req,res)=>{
    const {newname , oldpassword , newpassword , photoUrl , removepp} = req.body
    if(!newname){
        return res.json({error : 'Username can not be empty!!'})
    }
    try {
        if(!oldpassword){
            if(photoUrl){
                await User.findByIdAndUpdate(req.user._id , {
                    name : newname,
                    photo : photoUrl
                } , {new : true}).populate('posts', '-password -email').then(user => {
                    console.log(user)
                    res.json({user})
                })
            }else if(removepp){
                await User.findByIdAndUpdate(req.user._id , {
                    name : newname,
                    photo : ''
                } , {new : true}).populate('posts', '-password -email').then(user => {
                    console.log(user)
                    res.json({user})
                })
            }else{
                await User.findByIdAndUpdate(req.user._id , {
                    name : newname,
                } , {new : true}).populate('posts', '-password -email').then(user => {
                    console.log(user)
                    res.json({user})
                })
            }
        }else{
            const user = await User.findById(req.user._id)
            await bcrypt.compare(oldpassword , user.password).then(async(match)=>{
                if(match){
                    if(photoUrl){
                        await User.findByIdAndUpdate(req.user._id , {
                            name : newname,
                            photo : photoUrl,
                            password : await bcrypt.hash(newpassword, 12)
                        } , {new : true}).populate('posts', '-password -email').then(user => {
                            console.log(user)
                            res.json({user})
                        })
                    }else if(removepp){
                        await User.findByIdAndUpdate(req.user._id , {
                            name : newname,
                            photo : '',
                            password : await bcrypt.hash(newpassword, 12)
                        } , {new : true}).populate('posts', '-password -email').then(user => {
                            console.log(user)
                            res.json({user})
                        })
                    }else{
                        await User.findByIdAndUpdate(req.user._id , {
                            name : newname,
                            password : await bcrypt.hash(newpassword, 12)
                        } , {new : true}).populate('posts', '-password -email').then(user => {
                            console.log(user)
                            res.json({user})
                        })
                    }
                }else{
                    res.json({error : 'Wrong Old password'})
                }
            })
        }
    } catch (error) {
        res.json({error : 'Server error'})
        console.log(error)
    }
})

router.post('/getusers', requireLogin, async (req, res) => {
    const { search } = req.body;
    if (!search) {
        return res.json({ error: 'Search is empty!!' });
    }

    try {
        let userPattern = new RegExp('^' + search, 'i'); 

        await User.find({
            $or: [
                { email: { $regex: userPattern } },
                { name: { $regex: userPattern } }
            ]
        }).then(users => {
            users.forEach((user)=>{
                user.password = undefined
            })
            res.json({users})
        });
    } catch (error) {
        res.json({ error: 'Server error' });
        console.log(error);
    }
});




module.exports = router