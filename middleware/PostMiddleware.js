const db = require('../models');
const Category_sub_table = db.Category_sub_table;
const Event = db.Event
const { Op } = require("sequelize");

exports.addCategory = async(CategroyJson, postID) => {
    Category_sub_table.destroy({where: {event_id: postID}}).then(async() => {
        for(const [key, value] of Object.entries(CategroyJson)) {
            $data = {
                event_id: postID,
                category_id: value
            };
            try {
                await Category_sub_table.create($data);
            }
            catch (e) {
            }
        }
    });
};

exports.getCategoriesForPost = async(post) => {
    let res = [];

    categories = await Category_sub_table.findAll({where: 
        {event_id: post.id}
    });

    res.push(post)
    res.push(categories)

    return res;
}

exports.getCategoriesForPosts = async(posts) => {

    let res = [];
    let posts_id = [];
    for(const post of posts) {
        posts_id.push(post.id);
    }

    categories = await Category_sub_table.findAll({where: 
        {event_id:  {
                [Op.or]: posts_id
            }
        }
    });

    for(const post of posts) {
        let temp = [];
        temp.push(post);
        for(const cat of categories) {
            if(cat.event_id == post.id)
                temp.push(cat);
        }
        res.push(temp);
    }

    return res;

};

exports.getPostForPage = (page, posts) => {
    if(!page && page != 0) {
        return posts;
    }
    const postsPerPage = 10;

    const startPost = page * postsPerPage;
    const endPost = page * postsPerPage + 10;
    let pagePosts = [];

    for(let i = startPost; i < endPost; i++) {
        if(posts[i])
            pagePosts.push(posts[i]);
    }
    return pagePosts;
};

exports.getPostsByCategory = async(CategroyJson) => {
    let posts;
    let categories_id = [];
    let posts_id = [];
    for(const [key, value] of Object.entries(CategroyJson)) {
        categories_id.push(value);
    }

    categories = await Category_sub_table.findAll({ where: 
        {category_id:  {
                [Op.or]: categories_id
            }
        }
    });


    for(let cat of categories) {
        posts_id.push(cat.event_id);
    }
    posts = await Event.findAll({where: 
        {id:  {
                [Op.or]: posts_id
            }
        }
    });


    
    return posts;
};