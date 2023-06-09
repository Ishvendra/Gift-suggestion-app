var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var productModel = require('../model/productSchema');
var userModel = require('../model/userSchema');
var jsonParser = bodyParser.json({limit: '10mb', extended: true})
var bcrypt = require('bcryptjs');
var Authenticate = require('../middleware/authenticate');
var multer = require('../middleware/multer');
var upload = multer.single("testImage");
var fs = require('fs');
var path = require('path')

var category = '';
var gender = '';
var lowerAge = 0;
var upperAge = 100;
const log = console.log;

router.post('/getProducts',jsonParser, function(req, res, next) {
    lowerAge = req.body.lowerAge;
    upperAge = req.body.upperAge;
    gender = req.body.gender;
    console.log('fetch API- ',lowerAge, upperAge, gender);
    var query = '';
    if(gender == undefined || gender.length==0){
        query = { age : { $gte :  lowerAge, $lte : upperAge}};
    }else{
        query = { age : { $gte :  lowerAge, $lte : upperAge}, gender:gender};
    }
    productModel.find(query,(err, Products) => {
        if (!err) {
            res.json({products: Products});
        } else {
            console.log('Failed to retrieve the Products: ' + err);
        }
    });
});

router.post('/filterProducts', jsonParser, function(req,res,next){
    category = req.body.cat;
    var query = '';
    console.log('sample filter- ', lowerAge, upperAge, gender);
    if(gender == undefined || gender.length==0){
        query = { age : { $gte :  lowerAge, $lte : upperAge}, category:category}
    }else {
        query = { age : { $gte :  lowerAge, $lte : upperAge},category:category, gender:gender}
    }
    console.log('filter query- ',query);
    productModel.find(query,(err, Products) => {
        if (!err) {
            res.json({
                products: Products
            });
        } else {
            console.log('Failed to retrieve the filtered Products: ' + err);
        }
    }); 
})

router.post('/sortProducts', jsonParser, function(req,res){
    var sortCategory = {};
    if(req.body.sortCat == 'price'){
        sortCategory = {[req.body.sortCat]: 1}
    }else{
        sortCategory = {[req.body.sortCat]: -1}
    }
    var query = '';
    if(category.length>0 && (gender!=undefined && gender.length>0)){
        query = { age : { $gte :  lowerAge, $lte : upperAge}, gender: gender, category:category}
    }else if(category.length>0 && (gender==undefined || gender.length==0)){
        query = { age : { $gte :  lowerAge, $lte : upperAge}, category:category}
    }else if(category.length==0 && (gender!=undefined && gender.length>0)){
        query = { age : { $gte :  lowerAge, $lte : upperAge}, gender: gender}
    }else{
        query = { age : { $gte :  lowerAge, $lte : upperAge}}
    }
    console.log('sort query- ',query,' sort on- ',sortCategory);
    productModel.find(query).sort(sortCategory).exec((err, Products)=>{
        if (!err) {
            res.json({products: Products})
        } else {
            console.log('Failed to retrieve the sorted Products: ' + err);
        }
    })  
})

router.get('/cartItems',jsonParser,Authenticate,(req,res)=>{
    productModel.find({cart:true},(err, Products)=>{
        if (!err) {
            res.json({products: Products})
        } else {
            console.log('Failed to retrieve the products in cart: ' + err);
        }
    })
})

router.put('/findItemInCart',jsonParser,Authenticate,(req,res)=>{
    const id = req.body.id;
    productModel.find({id:id,cart:true},(err,product)=>{
        if(!err){
            res.json({product:product})
        } else {
            console.log('Failed to find item in cart: ' + err);
        }
    })
})

router.put('/addItemToCart',jsonParser, Authenticate, (req,res)=>{
    const productId = Object.values(req.body)[0];
    console.log('req.userId- ',req.userId)
    userModel.findOne({_id:req.userId, cartItems: {$elemMatch: {productId: productId}}}, function (err, productExists) {

        if (err){
            return res.status(500).json({ error: err });
        }    
        if (productExists) {
            console.log("Product already exists in cart");
            return res.status(403).json({ error: 'Product already exists in cart' });
        } else {
            userModel.updateOne({_id:req.userId},{
                $push:{cartItems:{productId:productId, quantity: 1}}
            }, (err,docs)=>{
                if(err){
                    return res.status(500).json({ error: err });
                } else {
                    console.log('item added in cart- ',docs);
                    return res.status(200).json({ message: 'Item added to cart successfully!',docs });
                }
            })
        }
    })
})

router.put('/deleteItemFromCart', jsonParser, Authenticate, (req,res)=>{
    const productId = Object.values(req.body)[0];
    console.log('productId',productId);
    userModel.find({_id:req.userId, cartItems: {$elemMatch: {productId: productId}}}, function (err, productExists) {
        if (err){
            return res.status(500).json({ error: err });
        }
        if (productExists) {
            console.log('req.userId- ',req.userId)
            userModel.updateOne({_id:req.userId},{"$pull":{"cartItems":{"productId":productId}}}, { safe: true, multi:true }, 
            (err,docs)=>{
                if(err){
                    return res.status(500).json({ error: 'cant find cart',err });
                } else {
                    console.log('item removed from cart- ',docs);
                    return res.status(200).json({ message: 'item removed from cart',docs });
                }
            })
        } else {
            console.log("Product does not exist in cart");
            return res.status(403).json({ error: 'Product does not exist in cart' });
        }
    })
})

router.put('/resetFilterCategory', jsonParser, (req,res)=>{
    console.log('reset sort and filter category');
    category = '';
    sort='';
})

router.post('/registerUser', jsonParser, (req,res)=>{
    const {firstName, lastName, email, password, dob, street, area, city, state, pincode, phoneNo} = req.body.user;
    if(!firstName || !email || !password || !dob || !street || !city || !state || !pincode || !phoneNo){
        return res.status(422).json({ error: "Fill all the required fields!"})
    }
    userModel.findOne({email:email})
    .then((userExists)=>{
        if(userExists){
            return res.status(422).json({ error: "Email already exists!" });
        }

        const user = new userModel({firstName, lastName, email, password, dob, address:{street, area, city, state, pincode}, phoneNo});

        user.save().then(()=>{
            res.status(201).json({ message: "User registered successfully!" });
        }).catch(err=>{
            res.status(500).json({ error: "Failed to register User" });
        })
    })
})

router.post('/loginUser',jsonParser,async function(req,res){
    try{
        const {email, password} = req.body.user;
        let token;

        if(!email || !password){
            return res.status(422).json({  error: "Fill both the fields!"});
        }

        const user = await userModel.findOne({email:email});

        if(!user){
            log("user not found: ",user);
            return res.status(401).json({ error: "Invalid credentials"});
        }

        const result  =await bcrypt.compare(password, user.password);
        console.log('result- ',result);
        if(result){
            token = await user.generateAuthToken();
            log('token- ',token);
            res.cookie("jwtoken",token, {
                expires: new Date(Date.now() + 2589200000),
                httpOnly: true
            });
            const name = user.firstName;
            return res.status(200).json({ message: `Welcome ${name}`});
        } else {
            log("username and pwd do not match: ",user);
            return res.status(401).json({ error: "Invalid credentials"})
        }
    } catch(err){
        log(err);
    }
})

router.get('/getProfileDetails', jsonParser, Authenticate, (req, res)=>{
    //console.log("get Profile details- ",req.rootUser)
    res.status(200).send(req.rootUser);
})

router.patch('/updateUserDetails', jsonParser, Authenticate, (req,res)=>{
    //console.log('deets- ',req.body.profileDeets)
    const {firstName, lastName, email, dob, phoneNo} = req.body.profileDeets;
    const {street, area, city, state, pincode} = req.body.profileDeets.address;
    if(!firstName || !lastName || !email || !dob || !street || !area || !city || !state || !pincode || !phoneNo){
        return res.status(422).json({ error: "Fill all the required fields!"})
    }
    userModel.updateOne({_id:req.userId},
        {
            $set: {firstName:firstName, lastName:lastName, email:email, dob:dob, address:{city:city, state:state, area:area, street:street, pincode:pincode}, phoneNo:phoneNo },
            $currentDate: { lastModified: true }
        },(err, docs) => {
            if(err){
                return res.status(500).json({ error: err });
            } else {
                console.log('docs- ',docs);
                return res.status(200).json({ message: 'Profile details updated successfully! ',docs });
            }
        })
})

router.post('/updatePassword', jsonParser, Authenticate, (req,res)=>{
    const {current, newPassword, confirmedNew} = req.body.password;
    if(newPassword != confirmedNew){
        return res.status(422).json({ error: "New password and confirmed password do not match"});
    }
    
})

router.post('/uploadImg', jsonParser, (req,res)=>{
    upload(req,res, function (err){
        if(req.fileValidationError) {
            console.log(req.fileValidationError);
            return res.status(403).json({error: {message:req.fileValidationError}});
        }
        if(err){
            console.log("Error- ", err);
            return res.status(403).json({error: err});
        }
        // everything goes fine
        console.log("firstname- ", req.body.firstName);
        userModel.updateOne({firstName:req.body.firstName},
            {
                $set: {
                    profileImage:{
                        data: fs.readFileSync('profile-img-uploads/' + req.file.filename),
                        contentType: "image/" + req.fileExtension.substring(1,req.fileExtension.length)
                    }},
                $currentDate: { lastModified: true }
            },(err, docs) => {
                if(err){
                    return res.status(500).json({ error: err });
                } else {
                    console.log('docs- ',docs);
                    return res.status(200).json({ message: 'Image uploaded successfully! '});
                }
            })
        })}
)

router.get('/logout', (req,res)=>{
    console.log("Logging out");
    res.clearCookie('jwtoken', { path: '/'});
    res.status(200).send({ message: 'User logged out!' });
})

module.exports = router;