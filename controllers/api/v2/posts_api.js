module.exports.index = (req, res)=>{
    return res.json(200,{
        message : "List of post in version 2",
        post : '[]'

    });
}