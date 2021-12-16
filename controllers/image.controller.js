const Validator = require('fastest-validator');
const path = require("path");
const db = require('../models');
const User = db.User;

exports.getUserImage = async(req, res) => {
    const user = await User.findOne({where: {id: req.params.id}});

    if(user) {
        
        res.sendFile(path.join(__dirname, '/../public/img/' + user.image_path));
    }
    else {
        res.status(404).send({message: "user not found"});
    }

};

exports.uploadUserImage = async(req, res) => {
    if(res.locals.user && res.locals.user.id == req.params.id && req.files) {
        const fileName = res.locals.user.id + ".png";
        req.files.file.mv(`${__dirname}/../public/img/${fileName}`)
        User.update({image_path: fileName}, {where: {id: res.locals.user.id}});
        res.status(200).send({message: "success"})
    }
    else
        res.status(403).send({message: "only the owner of account can change their profile image"})
};