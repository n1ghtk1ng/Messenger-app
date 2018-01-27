/**
 * Created by Aman on 1/4/2018.
 */
var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post('/',function (req,res,next) {
    var user = new User({
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       password: bcrypt.hashSync(req.body.password,10),
       email: req.body.email,
    });
    user.save(function (err,result) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        res.status(201).json( {
            message: 'user Created',
            obj: result
        });
    })
});
router.post('/signin',function (req,res,next) {
    User.findOne({email: req.body.email},function (err,user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!user) {
            return res.status(401).json({
                title: 'login failed',
                error: {message: "invalid login credentials "}
            })
        }
        if(!bcrypt.compareSync(req.body.password,user.password)) {
            return res.status(401).json({
                title: 'login failed',
                error: {message: "invalid login credentials "}
            })
        }
        //now we need to create token which our client can use for the future requests
        var token = jwt.sign({user: user},'secret',{expiresIn: 7200});  // in 2 hrs the token will expire
        res.status(200).json({
            message: 'successfully logged in',
            token: token,
            userId: user._id
        })

    });

});


module.exports = router;