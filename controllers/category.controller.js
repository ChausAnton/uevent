const Validator  = require('fastest-validator');
const db = require('../models');
const Category = db.Category

exports.getCategory = async(req, res) => {
    Category.findOne({where: {id: req.params.id}}).then((category) => {
        if(category) {
            res.status(200).send(category);
        }
        else {
            res.status(404).send("category not found")
        }
    });
};

exports.getCategories = async(req, res) => {
    Category.findAll({}).then((category) => {
        if(category) {
            res.status(200).send(category);
        }
        else {
            res.status(404).send("categories not found")
        }
    });
};

exports.createCategory = async(req, res) => {
    if(res.locals.admin) {
        const schema = {
            title: {type: "string"},
            description: {type: "string"}
        }

        let data = {
            title: req.body.title,
            description: req.body.description,
        }

        const v = new Validator();
        const validationresponse = v.validate(data, schema);
        if(validationresponse !== true) {
            return res.status(400).json({
                message: "Validation fail",
                errors: validationresponse
            });
        }

        Category.create(data);
        res.status(201).send(data);
    }
    else {
        res.status(403).send("you don't have permission to create category");
    }
};

exports.updateCategory = async(req, res) => {
    if(res.locals.admin) {
        Category.findOne({where: {id: req.params.id}}).then((category) => {
            if(category) {
                const schema = {
                    title: {type: "string", optional: true},
                    description: {type: "string", optional: true}
                }
        
                let data = {
                    title: req.body.title,
                    description: req.body.description,
                }
        
                const v = new Validator();
                const validationresponse = v.validate(data, schema);
                if(validationresponse !== true) {
                    return res.status(400).json({
                        message: "Validation fail",
                        errors: validationresponse
                    });
                }

                if((req.body.title || req.body.description)) {
                    Category.update({title: req.body.title, description: req.body.description}, {where: {id: req.params.id}}).then(() => {
                        res.status(200).send("data updated")
                    });
                }
                else {
                    res.status(204).send("no content")  
                }
            }   
            else {
                res.status(404).send("catgory not found");
            }
        });
    }
    else {
        res.status(403).send("you don't have permission to update category");
    }
};

exports.deleteCategory = async(req, res) => {

    if(!res.locals.admin) {
        return res.status(401).send("Only andmin can delete category");
    }
    Category.destroy({where: {id: req.params.id}}).then(() => {
        res.status(200).send("success");
    })
};