/**
 * Created by Aman on 1/4/2018.
 */

var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var mongoose = require('mongoose');

router.get('/',function (req,res,next) {
   Message.find()
       .populate('user', 'firstName')
       .exec(function (err,messages) {
           if(err){
               return res.status(500).json({
                   title: 'An error occurred',
                   error: err
               })
           }
           res.status(200).json({
               message: 'Success',
               obj: messages
           });
       });
});

router.use('/',function (req,res,next) { // query params are ---> "/?key=value " here key is the query params
    jwt.verify(req.query.token, 'secret', function (err,decoded) {  // here we check if the token is valid or not
        if(err){
            return res.status(401).json({
                title: 'Not authenticated',
                error: err
            })
        }
        next();
    })
});
router.post('/', function (req, res, next) {// here we only decode the token (we have checked the validity already in above middleware)
    var decoded = jwt.decode(req.query.token);
        User.findById(decoded.user._id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            var message = new Message({
                content: req.body.content,
                user: user
            });
            message.save(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                user.messages.push(
                   mongoose.Types.ObjectId(result._id) // typecasted to avid error of full call stack
                )
                ;
                user.save();
                return res.status(201).json({
                    message: 'Saved message',
                    obj: result
            });
        });
    });
});

router.patch('/:id', function (req,res,next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function (err,message) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!message) {
            return res.status(500).json({
                title: 'No Message Found!!',
                error: {message: 'message not found!!'}
            })
        }
        if(decoded.user._id != message.user){
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            })
        }
        message.content = req.body.content;
        message.save(function (err,result ) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            res.status(200).json({
                message: 'Updated Message',
                object: result
            })
        });
    })
});
//patch is an http word used to change the existing data
// patch request typically has both-- some data in the path and some data in  the body

router.delete('/:id',function (req,res,next) {
    var decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function (err,message) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!message) {
            return res.status(500).json({
                title: 'No Message Found!!',
                error: {message: 'message not found!!'}
            })
        }
        if(decoded.user._id != message.user){
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            })
        }
        message.remove(function (err,result ) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            res.status(200).json({
                message: 'Updated Message',
                object: result
            })
        });
    })
});


module.exports = router;