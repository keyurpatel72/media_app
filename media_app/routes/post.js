const express = require('express');
const router = express.Router();
const Post = require('../modules/post');
const User = require('../modules/user');

//create a post
//http://localhost:8000/api/post
router.post('/',async (req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost); 
    } catch (error) {
        return res.status(500).json(error)
    }
});

//update a post
//http://localhost:8000/api/post/630f412001599c457739e487
router.put('/:id',async (req,res)=>{
    try {        
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body});
        }else{
        res.status(403).json('you can update only one post')
        }         
        } catch (error) {
            return res.status(500).json(error);
        }
});

//delete a post
//http://localhost:8000/api/post/630f412001599c457739e487
router.delete('/:id',async(req,res)=>{
        try {        
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne({$set:req.body});
            }else{
            res.status(403).json('you can delete one post')
            }         
            } catch (error) {
                return res.status(500).json(error);
            }
    
});

//like dislike a post
//http://localhost:8000/api/post/630f412001599c457739e487/like
router.put('/:id/like',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json('you can like this post');
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json('you can dislike this post');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

//get post
//http://localhost:8000/api/user/630ef5ef24899e9923c8a4ed/follow
router.get('/:id',async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(error){
        return res.status(500).json(error);
    }
});

//get timeline 
//http://localhost:8000/api/post/timeline/all
router.get('/timeline/all',async(req,res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});    
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
            return Post.find({userId:friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts));

    }catch(error){
        return res.status(500).json(error);
    }
})


module.exports =router;
