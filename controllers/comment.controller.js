const Validator  = require('fastest-validator');
const db = require('../models');
const Comment = db.Comments

exports.getComment = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        Comment.findOne({where: {id: req.params.id}}).then((comment) => {
            if(comment) {
                res.status(200).send(comment);
            }
            else {
                res.status(404).send("comment not found");
            }
        });
    }
    else {
        Comment.findOne({where: {id: req.params.id, status_comment: "active"}}).then((comment) => {
            if(comment) {
                res.status(200).send(comment);
            }
            else {
                res.status(404).send("comment not found");
            }
        });
    }
};

exports.getComments = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        Comment.findAll({}).then((comments) => {
            if(comments) {
                res.status(200).send(comments)
            }
            else {
                res.status(404).send("comments not found")
            }
        });
    }
    else {
        Comment.findAll({where: {status_comment: "active"}}).then((comments) => {
            if(comments) {
                res.status(200).send(comments)
            }
            else {
                res.status(404).send("comments not found")
            }
        });
    }
};

exports.getCommentsForPost = async(req, res) => {
    if(res.locals.user && res.locals.admin && req.params.id) {
        db.sequelize.query(`select * from users inner join comments on comments.author_id_comment = users.id where comments.event_id_comment = ${req.params.id} order by comments.likes_comment ASC;`,{ type: db.sequelize.QueryTypes.SELECT }).then((comments) => {
            if(comments) {
                let data = []
                for(let iter of comments) {
                    let temp = {
                        id: iter.id,
                        real_name: iter.real_name,
                        author_id_comment: iter.author_id_comment,
                        content_comment: iter.content_comment,
                        likes_comment: iter.likes_comment,
                        event_id_comment: iter.event_id_comment,
                        status_comment: iter.status_comment,
                        createdAt: iter.CommentCreatedAt,
                        updatedAt: iter.CommentUpdatedAt
                    }
                    data.push(temp)
                }
                res.status(200).send(data)
            }
            else {
                res.status(404).send({message: "comments not found"})
            }
        });
    }
    else if(req.params.id) {
        db.sequelize.query(`select * from users inner join comments on comments.author_id_comment = users.id where comments.event_id_comment = ${req.params.id} and comments.status_comment = 'active' order by comments.likes_comment ASC;`,{ type: db.sequelize.QueryTypes.SELECT }).then((comments) => {
            if(comments) {
                let data = []
                for(let iter of comments) {
                    let temp = {
                        id: iter.id,
                        real_name: iter.real_name,
                        author_id_comment: iter.author_id_comment,
                        content_comment: iter.content_comment,
                        likes_comment: iter.likes_comment,
                        event_id_comment: iter.event_id_comment,
                        createdAt: iter.CommentCreatedAt,
                        updatedAt: iter.CommentUpdatedAt
                    }
                    data.push(temp)
                }
                res.status(200).send(data)
            }
            else {
                res.status(404).send({message: "comments not found"})
            }
        });
    }
    else {
        res.status(404).send({message: "no id"})
    }
};


exports.createComment = async(req, res) => {
    if(res.locals.user) {
        const schema = {
            event_id_comment: {type: "number"},
            content_comment: {type: "string"},
        };

        let data = {
            event_id_comment: parseInt(req.body.event_id_comment),
            author_id_comment: res.locals.user.id,
            content_comment: req.body.content_comment,
            likes_comment: 0,
            status_comment: "active",
        };

        const v = new Validator();
        const validationresponse = v.validate(data, schema);
        if(validationresponse !== true) {
            return res.status(400).json({
                message: "Validation fail",
                errors: validationresponse
            });
        }

        Comment.create(data);
        res.status(201).send(data);
    }
    else {
        res.status(403).send("only logged users can create posts");
    }
}

exports.updateComment = async(req, res) => {
    const schema = {
        status_comment: { type: "string", optional: true, enum: [ "active", "inactive" ] },
        content_comment: {type: "string", optional: true}
    }

    let data = {
        status_comment: req.body.status_comment,
        content_comment: req.body.content_comment
    }

    const v = new Validator();
    const validationresponse = v.validate(data, schema);
    if(validationresponse !== true) {
        return res.status(400).json({
            message: "Validation fail",
            errors: validationresponse
        });
    }

    let comment = await Comment.findOne({where: {id: req.params.id}})

    if(res.locals.admin && req.body.status_comment) {

        Comment.update({status_comment: req.body.status_comment}, {where: {id: req.params.id}});
    }
    
    if(res.locals.user && (req.body.title_comment || req.body.content_comment) && comment && comment.author_id_comment == res.locals.user.id) {
        Comment.update({title_comment: req.body.title, content_comment: req.body.content_comment}, {where: {id: req.params.id}})
    }

    if(!res.locals.admin && !res.locals.user)
        res.status(403).send({message: "You don't have permission to change this data"});
    else
        res.status(200).send({message: "data updated"});
};

exports.deleteComment = async(req, res) => {
    let comment = await Comment.findOne({where: {id: req.params.id}})

    if(!res.locals.admin && (!res.locals.user || (comment.author_id_comment != res.locals.user.id))) {
        return res.status(401).send("Only andmin and author can delete comment");
    }
    Comment.destroy({where: {id: req.params.id}}).then(() => {
        res.status(200).send("success");
    })
};
