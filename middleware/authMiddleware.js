const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

exports.checkUser = async(req, res, next) => {
    const token = req.headers["x-access-token"];
    if(token) {
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if(err) {
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findOne({ where: { id: decodedToken.id } })
                let bdToken = user.token
                if(bdToken && bdToken.localeCompare(token) == 0) {
                    res.locals.user = user;
                    res.locals.admin = (res.locals.user.role.localeCompare('admin') == 0);
                    next();
                }
                else {
                    res.locals.user = null;
                    next();
                }
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}