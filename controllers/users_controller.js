const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res){
    let user = await User.findById(req.params.id);
    //console.log(user + " from user_controller");
    return res.render('user_profile', {
        title: 'User Profile',
        profileUser : user
    })
}


module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        
        let user = await User.findByIdAndUpdate(req.params.id, req.body);
        //console.log(user);
        User.uploadedAvatar(req, res, function(err){
            if(err){
                console.log("*********Multer Error");
                // return ;
            }
            user.name = req.body.name;
            user.email = req.body.email;
            if(req.file){
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname + ".." + user.avatar));
                }
                // this is saving the path of the uploaded ile into the avatarfield in the user.
                user.avatar = User.avatarPath + "/"+ req.file.filename;
            }
            user.save();
            return res.redirect('back');
        })
        
    }else{
        return res.status(401).send('Unathaurized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return  res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
   }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){
    //TODO
    if (req.body.password != req.body.confirm_password) {
        return res.redirect("back");
      }
      let user = await User.findOne({ email: req.body.email });
      //console.log(user);
      if (!user) {
        //console.log(user);
        await User.create(req.body);
        //console.log(a);
        return res.redirect("/users/sign-in");
      }
      return res.redirect("back");


}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    //req.flash('success', 'Logged in succesfull');
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
}


// forrget password page

module.exports.forgetPasswordPage = function(req, res){
    return res.render('forget_password',{
        title : 'Forget Password'
    });
}

module.exports.forgetPasswordLink = async function(req, res){
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    //console.log(req.body);
    if(!user){
        return res.redirect('/users/sign-up');
    }
    if(req.body.password == req.body.confirmPassword){
        user.password = req.body.password;
        await user.updateOne({password : req.body.password});
        return res.redirect('/users/sign-in');
    }
    return res.redirect('back');

}