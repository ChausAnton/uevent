const Validator  = require('fastest-validator');
const db = require('../models');
const PostMiddleware = require('../middleware/PostMiddleware');
const Event = db.Event
const sequelize = db.sequelize
const { Op } = require("sequelize");

exports.getPostDetail = async(req, res) => {
    const result = await db.sequelize.query("select * from Category_sub_tables inner join Categories on Category_sub_tables.category_id = Categories.id inner join posts on Category_sub_tables.event_id = posts.id left join comments on posts.id = comments.event_id_comment inner join users on posts.author_id = users.id where posts.id = " + req.params.id + " ORDER BY Category_sub_tables.category_id ASC;", { type: db.sequelize.QueryTypes.SELECT });
    let data = {
        Post_data: {
            event_id: result[0].event_id,
            title: result[0].title,
            content: result[0].content,
            likes: result[0].likes,
            status: result[0].status,
            createdAt: result[0].PostCreatedAt,
            updatedAt: result[0].PostUpdatedAt,
        },

        Author_data: {
            author_id: result[0].author_id,
            login: result[0].login,
            real_name: result[0].real_name,
            email: result[0].email,
            rating: result[0].rating,
            image_path: result[0].image_path,
            role: result[0].role,
        },

        Categories_data: [],

        Comments_data: [],
    };

    let comments = [];
    let categories = [];

    for(const iter of result) {
        comments.push(JSON.stringify({
            author_id_comment: iter.author_id_comment, 
            event_id_comment: iter.event_id_comment, 
            content_comment: iter.content_comment, 
            likes_comment: iter.likes_comment, 
            likes_comment: iter.likes_comment
        }))

        categories.push(JSON.stringify({
            category_title: iter.category_title, 
            category_description: iter.description, 
            category_id: iter.category_id
        }))
    }
    data.Categories_data = [...new Set(categories)].map((category) => {
        return JSON.parse(category)
    });
    
    data.Comments_data = [...new Set(comments)].map((comment) => {
        return JSON.parse(comment)
    });;

    let index = 0;
    let getCommentsAuthors = "select id, real_name from users where id = ";
    for(let comment of data.Comments_data) {
        if(index == 0 && comment) {
            getCommentsAuthors += comment.author_id_comment;
        }
        else if(comment && index > 0) {
            getCommentsAuthors += " or id = " + comment.author_id_comment;
        }
        index++;
    }
    const CommentsAuthors = await db.sequelize.query(`${getCommentsAuthors};`, { type: db.sequelize.QueryTypes.SELECT })
    for(let i = 0; i < data.Comments_data.length; i++) {
        data.Comments_data[i].CommentAuthor = CommentsAuthors[i]
    }
    res.status(200).send(data)
}

exports.getPostsForUser = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        const posts = await db.sequelize.query(`select * from posts where author_id = ${req.params.id} order by id DESC;`, { type: db.sequelize.QueryTypes.SELECT })
        if(posts) {
            res.status(200).send(posts);
        }
        else {
            res.status(404).send({message: "posts not found"});
        }
    }
    else {
        const posts = await db.sequelize.query(`select * from posts where author_id = ${req.params.id} and status = "active" order by id DESC;`, { type: db.sequelize.QueryTypes.SELECT })
        if(posts) {
            res.status(200).send(posts);
        }
        else {
            res.status(404).send({message: "posts not found"});
        }
    }
}

exports.getPost = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        Event.findOne({where: {id: req.params.id}}).then(async(post) => {
            if(post) {
                const postCategories = await PostMiddleware.getCategoriesForPost(post);
                res.status(200).send(postCategories);
            }
            else {
                res.status(404).send("post not found");
            }
        });
    }
    else {
        Event.findOne({where: {id: req.params.id, status: "active"}}).then(async(post) => {
            if(post) {
                const postCategories = await PostMiddleware.getCategoriesForPost(post);
                res.status(200).send(postCategories);
            }
            else {
                res.status(404).send("post not found");
            }
        });
    }
};

exports.getPosts = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        Event.findAll({}).then(async(posts) => {
            if(posts) {
                posts = PostMiddleware.getPostForPage(req.body.page, posts)
                const PostsCats = await PostMiddleware.getCategoriesForPosts(posts);
                res.status(200).send(PostsCats)
            }
            else {
                res.status(404).send("posts not found")
            }
        });
    }
    else {
        Event.findAll({where: {status: "active"}}).then(async(posts) => {
            if(posts) {
                posts = PostMiddleware.getPostForPage(req.body.page, posts)
                const PostsCats = await PostMiddleware.getCategoriesForPosts(posts);
                res.status(200).send(PostsCats)
            }
            else {
                res.status(404).send("posts not found")
            }
        });
    }
};

exports.createPost = async(req, res) => {
    if(res.locals.user) {
        const schema = {
            title: {type: "string", empty: false},
            content: {type: "string", empty: false},
            category_id: {type: "object", empty: false}
        };
        console.log(typeof req.body.category_id)
        let data = {
            author_id: res.locals.user.id,
            title: req.body.title,
            content: req.body.content,
            category_id: req.body.category_id,
            likes: 0,
            status: "active",
        };

        const v = new Validator();
        const validationresponse = v.validate(data, schema);
        if(validationresponse !== true) {
            return res.status(400).json({
                message: "Validation fail",
                errors: validationresponse
            });
        }

        if(Object.keys(req.body.category_id).length === 0) {
            return res.status(400).json({
                message: "Validation fail",
                error: "no categories selected" 
            });
        }

        Event.create(data).then(async(post) => {
            await PostMiddleware.addCategory(req.body.category_id, post.id)
            res.status(201).send(data);
        });
        
    }
    else {
        res.status(403).send({message: "only logged users can create posts"});
    }
}

exports.updatePost = async(req, res) => {
    const schema = {
        status: { type: "string", optional: true, enum: [ "active", "inactive" ] },
        title: {type: "string", optional: true},
        content: {type: "string", optional: true},
        category_id: {type: "object", optional: true}
    }
   
    let data = {
        status: req.body.status,
        title: req.body.title,
        content: req.body.content,
        category_id: req.body.category_id
    }

    const v = new Validator();
    const validationresponse = v.validate(data, schema);
    if(validationresponse !== true) {
        return res.status(400).json({
            message: "Validation fail",
            errors: validationresponse
        });
    }

    if(req.body.category_id)
        if(Object.keys(req.body.category_id).length === 0) {
            return res.status(400).json({
                message: "Validation fail",
                error: "no categories selected" 
            });
        }

    let post = await Event.findOne({where: {id: req.params.id}})

    if(req.body.category_id && ((res.locals.user && post.author_id == res.locals.user.id) || res.locals.admin)) {
        PostMiddleware.addCategory(req.body.category_id, post.id);
    }

    if(res.locals.admin && req.body.status) {

        Event.update({status: req.body.status}, {where: {id: req.params.id}});
    }
    
    if(res.locals.user && (req.body.title || req.body.content) && post && post.author_id == res.locals.user.id) {
        Event.update({title: req.body.title, content: req.body.content}, {where: {id: req.params.id}})
    }

    if(!res.locals.admin && !res.locals.user)
        res.status(403).send({message: "You don't have permission to change this data"});
    else
        res.status(200).send({message: "data updated"});
};

exports.deletePost = async(req, res) => {
    let post = await Event.findOne({where: {id: req.params.id}});

    if(!res.locals.admin && (!res.locals.user || (post.author_id != res.locals.user.id))) {
        return res.status(401).send("Only andmin and author can delete post");
    }
    Event.destroy({where: {id: req.params.id}}).then(() => {
        res.status(200).send("success");
    })
};

exports.getPostDateFilter = async(req, res) => {

    const schema = {
        dateStart: { type: "string"},
        dateEnd: {type: "string"}
    };

    let data = {
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd
    };

    const v = new Validator();
    const validationresponse = v.validate(data, schema);
    if(validationresponse !== true) {
        return res.status(400).json({
            message: "Validation fail",
            errors: validationresponse
        });
    }

    if(res.locals.user && res.locals.admin) {
        Event.findAll({where: {createdAt: {
                    [Op.between]: [data.dateStart, data.dateEnd]
                }
            }}).then(async(posts) => {
            if(posts) {
                let PostsCats = [];
                for(let post of posts) {
                    categories = await PostMiddleware.getCategoriesForPost(post.id);
                    PostsCats.push([post, categories])
                }
                res.status(200).send(PostsCats);
            }
            else {
                res.status(404).send("posts not found")
            }
        });
    }
    else {
        Event.findAll({where: {createdAt: {
            [Op.between]: [data.dateStart, data.dateEnd]
        }, status: 'active'
        }}).then(async(posts) => {
            if(posts) {
                let PostsCats = [];
                for(let post of posts) {
                    categories = await PostMiddleware.getCategoriesForPost(post.id);
                    PostsCats.push([post, categories])
                }
                res.status(200).send(PostsCats);
            }
            else {
                res.status(404).send("posts not found")
            }
        });
    }
}

exports.getPostCategoryFilter = async(req, res) => {
    const schema = {
        categories_id: { type: "object"},
    };

    let data = {
        categories_id: req.body.categories_id
    };

    const v = new Validator();
    const validationresponse = v.validate(data, schema);
    if(validationresponse !== true) {
        return res.status(400).json({
            message: "Validation fail",
            errors: validationresponse
        });
    }
    const posts = await PostMiddleware.getPostsByCategory(data.categories_id);
    let PostsCats = [];
    for(let post of posts) {
        categories = await PostMiddleware.getCategoriesForPost(post);
        PostsCats.push([post, categories])
    }
    const pagePosts = PostMiddleware.getPostForPage(req.body.page, PostsCats)
    res.status(200).send(pagePosts)
    
    
};

exports.getPostPerPage = async(req, res) => {
    const postsPerPage = 2
    if(res.locals.user && res.locals.admin && req.params.page > 0) {
        let posts;
        let count;
        if(req.params.category) {
            if(req.params.category.localeCompare('!') === 0 && req.params.SearchField) {
                posts = await db.sequelize.query(`select * from users inner join posts on users.id = posts.author_id where posts.title like "%${req.params.SearchField}%" order by posts.id DESC limit ${(req.params.page - 1) * postsPerPage}, ${postsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(*) from posts where posts.title like "%${req.params.SearchField}%";`, { type: db.sequelize.QueryTypes.SELECT });
            }
            else {
                posts = await db.sequelize.query(`select * from users inner join posts on users.id = posts.author_id where exists (select * from Category_sub_tables where posts.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}')) order by posts.id DESC limit ${(req.params.page - 1) * postsPerPage}, ${postsPerPage};`, { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(*) from posts where exists (select * from Category_sub_tables where posts.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}'));`, { type: db.sequelize.QueryTypes.SELECT });
            }
        }
        else {
            posts = await db.sequelize.query(`select * from users inner join posts on users.id = posts.author_id order by posts.id DESC limit ${(req.params.page - 1) * postsPerPage}, ${postsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
            count = await db.sequelize.query(`select count(*) from posts;`, { type: db.sequelize.QueryTypes.SELECT });
        }
        if(!posts.length || !count.length)
            res.status(404).send({message: "posts not found"})
        else {
            const data = posts.map((post) => { 
                return {
                    id: post.id,
                    author_id: post.author_id,
                    content: post.content,
                    createdAt: post.createdAt,
                    likes: post.likes,
                    rating: post.rating,
                    real_name: post.real_name,
                    title: post.title,
                    status: post.status,
                    createdAt: post.PostCreatedAt,
                    updatedAt: post.PostUpdatedAt
                }
            })
            res.status(200).send({posts: [...data], postsCount: count[0][Object.keys(count[0])[0]], CurPage: req.params.page})
        }
    }
    else if (req.params.page > 0) {
        let posts;
        let count;
        if(req.params.category) {
            if(req.params.category.localeCompare('!') === 0 && req.params.SearchField) {
                posts = await db.sequelize.query(`select * from users inner join posts on users.id = posts.author_id where status = 'active' and posts.title like "%${req.params.SearchField}%" order by posts.id DESC limit ${(req.params.page - 1) * postsPerPage}, ${postsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(IF(status = 'active', 1, null)) from posts where posts.title like "%${req.params.SearchField}%";`, { type: db.sequelize.QueryTypes.SELECT });
            }
            else {
                posts = await db.sequelize.query(`select * from posts inner join users on users.id = posts.author_id where status = 'active' and exists (select * from Category_sub_tables where posts.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}')) order by posts.id DESC limit ${(req.params.page - 1) * postsPerPage}, ${postsPerPage};`, { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(IF(status = 'active', 1, null)) from posts where exists (select * from Category_sub_tables where posts.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}'));`, { type: db.sequelize.QueryTypes.SELECT });
            }
        }
        else {
            posts = await db.sequelize.query(`select * from users inner join posts on users.id = posts.author_id where status = 'active' order by posts.id DESC limit ${(req.params.page - 1) * postsPerPage}, ${postsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
            count = await db.sequelize.query(`select count(IF(status = 'active', 1, null)) from posts;`, { type: db.sequelize.QueryTypes.SELECT });
        }
        if(!posts.length || !count.length)
            res.status(404).send({message: "posts not found"})
        else {
            const data = posts.map((post) => { 
                return {
                    id: post.id,
                    author_id: post.author_id,
                    content: post.content,
                    createdAt: post.createdAt,
                    likes: post.likes,
                    rating: post.rating,
                    real_name: post.real_name,
                    title: post.title,
                    createdAt: post.PostCreatedAt,
                    updatedAt: post.PostUpdatedAt
                }
            })
            res.status(200).send({posts: [...data], postsCount: count[0][Object.keys(count[0])[0]], CurPage: req.params.page})
        }
    }
    else 
        res.status(404).send("posts not found")
};