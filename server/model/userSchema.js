const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    dob: {
        type: Date,
    },
    address: {
        type: {
            street:{
                type: String
            },
            area:{
                type: String
            },
            city:{
                type: String
            },
            state:{
                type: String
            },
            pincode:{
                type: String
            },
        },
    },
    phoneNo: {
        type: String,
    },
    cartItems: [{
            productId: {
                type: Number
            },
            quantity: {
                type: Number
            }
    }],
    profileImage:{
        data: Buffer,
        contentType: String
    },
    tokens: [
        {
            token:{
                type: String
            }
        }
    ]
}, {collection: 'userbase'});

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

//generating token
let token;
userSchema.methods.generateAuthToken = async function(){
    try{
        token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token});
        await this.save();
        return token;
    } catch(err){
        console.log(err);
    }
}

var userModel = mongoose.model('userbase',userSchema);

module.exports = userModel;