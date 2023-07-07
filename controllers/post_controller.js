const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/likes');

module.exports.create = async function(req, res){
    let post = await Post.create({
        content : req.body.content,
        user : req.user.id
    });
    if(req.xhr){
        return res.status(200).json({
            data : {
                post : post
            },
            message : 'Post Created'
        })
    }
    req.flash('success', 'New Post Was Added');
    // console.log(post);
    return res.redirect('back');
}

module.exports.destroy = async function(req, res){
    //console.log(req.params + " parama");
    let post = await Post.findById(req.params.id);
    // console.log(req.params.id);
    // console.log(post + " post");
    if(post && post.user == req.user.id){
        let p = await Post.deleteOne({_id : req.params.id});
        
        await Like.deleteMany({likeable : post, onModel : 'Post'});
        await Like.deleteMany({_id : {$in : post.comments}});

        await Comment.deleteMany({post : req.params.id});
        if(req.xhr){
            return res.status(200).json({
                data :{
                    post_id : req.params.id
                },
                message : "Post deleted Sussfully"
            })
        }
        req.flash('success', 'Post and the associated comments are deleted');
        //await post.remove();
    }
    return res.redirect('back');
}