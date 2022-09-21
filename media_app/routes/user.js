const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const bcrypt = require('bcrypt');

//user update
//http://localhost:8000/api/user/630ef449341693c355cb691c
router.put("/:id",async(req,res)=>{
    if (req.body.userId===req.params.id ||req.user.isAdmin) {
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            } catch (error) {
                    return res.status(500).json(error);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set :req.body,
            });
            res.status(200).json('Account has been updated')
        }catch(error){
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json('You can update only account')
        
    }
})
//user delete
// /http://localhost:8000/api/user/630ef5ef24899e9923c8a4ed
router.delete('/:id',async(req,res)=>{
if (req.body.userId===req.params.id ||req.user.isAdmin) {
    try {
        const user = await User.deleteOne(req.params.id)
        res.status(200).json('Account has been deleted')
    } catch (error) {
        return res.status(500).json(error)
    }
    
} else {
    return res.status(403).json("You can delete only account")
}
});
//get user
//
router.get('/:id',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password,updateAt,...other} =user._doc
        res.status(200).json(other);
    } catch (error) {
        return res.status(500).json(error)
    }
});
// user follow
//http://localhost:8000/api/user/630ef5ef24899e9923c8a4ed/follow
router.put('/:id/follow',async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json('user has been followed');
            }else{
                res.status(403).json('you can follow this user');
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        return res.status(403).json("you can follow your self")
    }
});

//user unfollow
//http://localhost:8000/api/user/630ef5ef24899e9923c8a4ed/unfollow
router.put('/:id/unfollow',async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json('user has been unfollowed');
            }else{
                res.status(403).json('you can unfollow this user');
            }
        } catch (error) {
            return res.status(500).json(error)
        }

    }else{
        return res.status(403).json("you can follow your self")
    }
})
module.exports =router;