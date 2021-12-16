require('dotenv').config()
const jwt = require('jsonwebtoken');
const Validator  = require('fastest-validator');
const db = require('../models');
const User = db.User;


exports.getUser = async(req, res) => {
    User.findOne({ attributes: {
            exclude: ['password', 'token', 'password_reset_token']
        }, where: {id: req.params.id}}).then((user) => {
        res.status(200).send(user);
    })
};

exports.getUsers = async(req, res) => {
    if(!res.locals.admin) {
        return res.status(401).send("Only andmin can see all users");
    }
    User.findAll({ attributes: {
            exclude: ['password', 'token', 'password_reset_token']
        }
    }).then((users) => {
        res.send(users);
    })
}

exports.updateUser = async(req, res) => {
    const schema = {
        role: { type: "string", optional: true, enum: [ "user", "admin" ] },
        real_name: {type: "string", optional: true, max: "100"},
    }

    let data = {
        role: req.body.role,
        real_name: req.body.real_name,
    }

    const v = new Validator();
    const validationresponse = v.validate(data, schema);
    if(validationresponse !== true) {
        return res.status(400).json({
            message: "Validation fail",
            errors: validationresponse
        });
    }

    if(res.locals.admin && req.body.role) {
        User.update({role: req.body.role}, {where: {id: req.params.id}});
    }
    
    if(res.locals.user && res.locals.user.id == req.params.id && req.body.real_name) {
        User.update({real_name: req.body.real_name}, {where: {id: req.params.id}});
    }

    if(!res.locals.admin && !(res.locals.user && res.locals.user.id == req.params.id))
        res.status(403).send({message: "You don't have permission to change this data"});
    else
        res.status(201).send({message: "data updated"});
}

exports.deleteUser = async(req, res) => {
    if(!res.locals.admin) {
        return res.status(401).send("Only andmin can delete user");
    }
    User.destroy({where: {id: req.params.id}}).then(() => {
        res.status(200).send("success");
    })
}

