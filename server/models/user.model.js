const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    number: {
        type: Number,
        unique: true
    },
    age: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    saltSecret: String
})
var addressSchema=new mongoose.Schema({
    name: {
        type: String,
    },
    no:{
        type:Number,
    }, 
    pincode:{
        type:Number
    },
    locality:{
        type:String,
    },
    address:{
        type:String
    },
    district:{
        type:String
    },
    state:{
        type:String
    },
    addressid:{
        type:String
    }
})
var checkoutSchema=new mongoose.Schema({
    id:{
        type:String
    },
    productid:{
        type:Array
    }
})
var dataSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    description: {
        type: String,  
    },
    category: {
        type: String,  
    },
    imagePath:{
        type:Object,
    }
})
// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}
mongoose.model('User', userSchema);
mongoose.model('Record',dataSchema);
mongoose.model('Address',addressSchema);
mongoose.model('Checkout',checkoutSchema);