const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const bodyParser = require('body-parser');
const User = mongoose.model('User');
const Record = mongoose.model('Record');
module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.number=req.body.number;
    user.age=req.body.age
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}
module.exports.getrecord=async(req,res,next)=>{
  await  Record.find((err, docs) => {
        if (!err) {
            res.send(docs)
        }
        else {
            console.log("error in retriving list " + JSON.stringify(err, undefined, 2));
            return next(err);
        }
    });
}
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['fullName', 'email','number','age']) });
        }
    )}

