const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    return res.json(200, {
        message : "List of post",
        post : posts
    });
}

module.exports.destroy = async function(req, res){
    
    let post = await Post.findById(req.params.id);
    
    
    try{
        if(post && post.user == req.user.id){
            let p = await Post.deleteOne({_id : req.params.id});
            await Comment.deleteMany({post : req.params.id});
            return res.json(200, {
                message : "Post and the associtates deleted"
            });
        }else{
            return res.json(404, {
                message : "Unauthorized, you can not delete this post!"
            })
        }
        
    }catch{
        return res.json(500, {
            message : "Internal Server Error"
        });
    }
}