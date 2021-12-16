require('dotenv').config()
const Validator  = require('fastest-validator');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const db = require('../models');
const crypto = require("crypto");
const sendEmailMiddleware = require('../middleware/sendEmailMiddleware');
const { send } = require('process');
const User = db.User;

exports.signUp = async(req, res) => {
    User.findAll({where: 
        {[Op.or]: [
            {login: req.body.login}, 
            {email: req.body.email}
        ]
    }}).then(user => {
        if(user.length) {
            return res.status(400).send({message: "User already exist"});
        }
        const schema = {
            login: {type: "string", option: false, max: "100"},
            real_name: {type: "string", option: false, max: "100"},
            email: {type: "email"},
            password: { type: "string", min: 3 },
            passwordConfirmation: { type: "equal", field: "password" },
            role: { type: "string", enum: [ "user", "admin" ], optional: true, default: 'user'},
        }

        if(req.body.role) {
            if (req.body.role.localeCompare('admin') == 0) {
                if(!res.locals.admin) {
                    return res.status(401).send({message:"Only admin can create admin"})
                }
            }
        }
    
        let data = {
            login: req.body.login,
            real_name: req.body.real_name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation,
            role: req.body.role,
            image_path: "User.png",
            rating: 0
        }

        const v = new Validator();
        const validationresponse = v.validate(data, schema);
        if(validationresponse !== true) {
            return res.status(400).json({
                message: "Validation fail",
                errors: validationresponse
            });
        }

        data.password = bcrypt.hashSync(req.body.password, 8)
        User.create(data);
        res.status(201).send({
            message: "User created",
        });
    });
    
}

exports.signIn = async(req, res) => {
    User.findOne({where: {login: req.body.login}}).then(user => {
        if(!user) {
            return res.status(404).send({message: "User not found"});
        };
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password"
            });
        };

        var token = jwt.sign({id: user.id}, process.env.SECRET, {
            expiresIn: 86400
        });

        User.update({token: token}, {where: {id: user.id}});

        res.status(200).send({
            id: user.id,
            login: user.login,
            real_name: user.real_name,
            email: user.email,
            role: user.role,
            rating: user.rating,
            accessToken: token
        })
    })
};

exports.logout = async(req, res) => {
    if(res.locals.user) {
        User.update({token: null}, {where: {id:  res.locals.user.id}});
        res.cookie('jwt', '', {maxAge: 1});
        res.status(200).send('success')
    }
};

exports.requestForPasswordReset = async(req, res) => {
    const user = await User.findOne({where: { email: req.body.email}})
    if(user) {
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(process.env.SECRET));
        const link = `${process.env.CLIENTURL}/resetPassword/${resetToken}/${user.id}`;
        User.update({password_reset_token: resetToken}, {where: {id: user.id}});

        sendEmailMiddleware.sendEmail(user.email, 
        "Password Reset Request", 
        {name: user.real_name, link: link,}, 
        "../template/requestResetPassword.handlebars", res);
    }
    else {
        res.status(404).send({message: "user not found"});
    }
}

exports.resetPassword = async(req, res) => {
    let user = await User.findOne({where:{id: req.param('id')}});

    if(!user) {
        return res.stauts(403).send({message: "user not found"})
    }

    if(user.password_reset_token && user.password_reset_token.localeCompare(req.param('token')) == 0) {
        const schema = {
            password: { type: "string", min: 3 },
            passwordConfirmation: { type: "equal", field: "password" },
        }

        let data = {
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation,
        }

        const v = new Validator();
        const validationresponse = v.validate(data, schema);
        if(validationresponse !== true) {
            return res.status(400).json({
                message: "Validation fail",
                errors: validationresponse
            });
        }

        data.password = bcrypt.hashSync(req.body.password, 8)
        res.cookie('jwt', '', {maxAge: 1});

        User.update({password_reset_token: null, token: null, password: data.password}, {where: {id:  req.param('id')}});
        res.status(200).send({message: "password reseted"})
    }
    else {
        res.status(403).send({message: "reset token not matched"})
    }
}