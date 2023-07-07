const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId
    },

    // define the type of the object id of the linked object

    likeable : {
        type : mongoose.Schema.ObjectId,
        require : true,
        refPath : 'onModel'
    },

    // this field is used for defining the liked object since this is dynamic referance.

    onModel : {
        type : String,
        required : true,
        enum : ['Post', 'Comment']
    }
} , {
    timestamps : true
}
);

const Like = mongoose.model('Like' , likeSchema);
module.exports = Like;