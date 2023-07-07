const Comment = require('../models/comment');
const Post = require('../models/post');
const nodemailer = require('../mailer/comments_mailer');
const Like = require('../models/likes');
// const queue = require('../config/kue');
// const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req, res){
    let post = await Post.findById(req.body.post);
    if(post){
        let comment = await  Comment.create({
            content : req.body.content,
            post : req.body.post,
            user : req.user._id
        })
        req.flash('success', 'New Comment Added');
        post.comments.push(comment);

        post.save();
        comment = await comment.populate('user', 'name email');
        // let job  = queue.create('emails', comment).save(function (err){
        //     if(err){
        //         console.log("&&&&&&&&7Error is " + err);
        //         return;
        //     }
        //     console.log(job.id);
        // })
         nodemailer.newComment(comment);
        if(req.xhr){
            
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
        }
        res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    let comment = await Comment.findById(req.params.id);
    if(comment && comment.user == req.user.id){
        let postId = comment.post;
        await Comment.deleteOne({_id : req.params.id});
        // await Post.findById(postId, {$pull : {comments : req.params.id}});
        await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
        await Like.deleteMany({likeable : comment._id, onModel  : 'Comments'});
        req.flash('success', 'Comment deleted');
    }
    return res.redirect('back');
}