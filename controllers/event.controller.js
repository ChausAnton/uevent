const Validator  = require('fastest-validator');
const db = require('../models');
const EventMiddleware = require('../middleware/EventMiddleware');
const Event = db.Event
const sequelize = db.sequelize
const { Op } = require("sequelize");
const subscrition = db.subscritionToEvent

exports.getEventDetail = async(req, res) => {
    const result = await db.sequelize.query("select * from Category_sub_tables inner join Categories on Category_sub_tables.category_id = Categories.id inner join events on Category_sub_tables.event_id = events.id left join comments on events.id = comments.event_id_comment inner join users on events.author_id = users.id where events.id = " + req.params.id + " ORDER BY Category_sub_tables.category_id ASC;", { type: db.sequelize.QueryTypes.SELECT });
    if(!result[0]) {
        return res.status(404).send({message: "event not found"})
    }
    const subscribe = await subscrition.findOne({where: {user_id: res.locals.user.id, event_id: req.params.id}})
    let data = {
        Event_data: {
            event_id: result[0].event_id,
            title: result[0].title,
            content: result[0].content,
            likes: result[0].likes,
            status: result[0].status,
            ticketPrice: result[0].ticketPrice,
            promoCode: result[0].promoCode,
            eventLocation: result[0].eventLocation,
            eventDate: result[0].eventDate,
            createdAt: result[0].eventCreatedAt,
            Subscribed: (subscribe ? true : false)
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

exports.getEventsForUser = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        const events = await db.sequelize.query(`select * from events where author_id = ${req.params.id} order by id DESC;`, { type: db.sequelize.QueryTypes.SELECT })
        if(events) {
            res.status(200).send(events);
        }
        else {
            res.status(404).send({message: "events not found"});
        }
    }
    else {
        const events = await db.sequelize.query(`select * from events where author_id = ${req.params.id} and status = "active" order by id DESC;`, { type: db.sequelize.QueryTypes.SELECT })
        if(events) {
            res.status(200).send(events);
        }
        else {
            res.status(404).send({message: "events not found"});
        }
    }
}

exports.getEvent = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        Event.findOne({where: {id: req.params.id}}).then(async(Event) => {
            if(Event) {
                const EventCategories = await EventMiddleware.getCategoriesForEvent(Event);
                res.status(200).send(EventCategories);
            }
            else {
                res.status(404).send("Event not found");
            }
        });
    }
    else {
        Event.findOne({where: {id: req.params.id, status: "active"}}).then(async(Event) => {
            if(Event) {
                const EventCategories = await EventMiddleware.getCategoriesForEvent(Event);
                res.status(200).send(EventCategories);
            }
            else {
                res.status(404).send("Event not found");
            }
        });
    }
};

exports.getEvents = async(req, res) => {
    if(res.locals.user && res.locals.admin) {
        Event.findAll({}).then(async(events) => {
            if(events) {
                events = EventMiddleware.getEventForPage(req.body.page, events)
                const eventsCats = await EventMiddleware.getCategoriesForEvents(events);
                res.status(200).send(eventsCats)
            }
            else {
                res.status(404).send("events not found")
            }
        });
    }
    else {
        Event.findAll({where: {status: "active"}}).then(async(events) => {
            if(events) {
                events = EventMiddleware.getEventForPage(req.body.page, events)
                const eventsCats = await EventMiddleware.getCategoriesForEvents(events);
                res.status(200).send(eventsCats)
            }
            else {
                res.status(404).send("events not found")
            }
        });
    }
};

exports.createEvent = async(req, res) => {
    if(res.locals.user) {
        const schema = {
            title: {type: "string", optional: false},
            content: {type: "string", optional: false},
            category_id: {type: "object", optional: false},
            ticketPrice: {type: "number", optional: false},
            promoCode: {type: "string", optional: true, min: 4, max: 4},
            eventLocation: {type: "string", optional: false},
            eventDate: {type: "string", optional: false}
        };

        let data = {
            author_id: res.locals.user.id,
            title: req.body.title,
            content: req.body.content,
            category_id: req.body.category_id,
            likes: 0,
            status: "active",
            ticketPrice: (req.body.ticketPrice ? parseInt(req.body.ticketPrice) : null),
            promoCode: req.body.promoCode,
            eventLocation: req.body.eventLocation,
            eventDate: req.body.eventDate
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

        Event.create(data).then(async(Event) => {
            await EventMiddleware.addCategory(req.body.category_id, Event.id)
            res.status(201).send(data);
        });
        
    }
    else {
        res.status(403).send({message: "only logged users can create events"});
    }
}

exports.updateEvent = async(req, res) => {
    const schema = {
        status: { type: "string", optional: true, enum: [ "active", "inactive" ] },
        title: {type: "string", optional: true},
        content: {type: "string", optional: true},
        category_id: {type: "object", optional: true},
        ticketPrice: {type: "number", optional: true},
        promoCode: {type: "string", optional: true, min: 4, max: 4},
        eventLocation: {type: "string", optional: true},
        eventDate: {type: "string", optional: true},
    }
   
    let data = {
        status: req.body.status,
        title: req.body.title,
        content: req.body.content,
        category_id: req.body.category_id,
        ticketPrice: (req.body.ticketPrice ? parseInt(req.body.ticketPrice) : null),
        promoCode: req.body.promoCode,
        eventLocation: req.body.eventLocation,
        eventDate: req.body.eventDate,
    }

    const v = new Validator();
    const validationresponse = v.validate(data, schema);
    if(validationresponse !== true) {
        return res.status(400).json({
            message: "Validation fail",
            errors: validationresponse
        });
    }

    const validAuthorAccessToData = {
        title: data.title,
        content: data.content,
        category_id: data.category_id,
        ticketPrice: data.ticketPrice,
        promoCode: data.promoCode,
        eventLocation: data.eventLocation,
    }

    if(req.body.category_id)
        if(Object.keys(req.body.category_id).length === 0) {
            return res.status(400).json({
                message: "Validation fail",
                error: "no categories selected" 
            });
        }

    let event = await Event.findOne({where: {id: req.params.id}})

    if(req.body.category_id && ((res.locals.user && event.author_id == res.locals.user.id) || res.locals.admin)) {
        EventMiddleware.addCategory(req.body.category_id, event.id);
    }

    if(res.locals.admin && req.body.status) {

        Event.update({status: req.body.status}, {where: {id: req.params.id}});
    }
    if(res.locals.user && event && event.author_id == res.locals.user.id) {
        const cleanUp = Object.fromEntries(Object.entries(validAuthorAccessToData).filter(([_, v]) => v != null))
        event.set(cleanUp)
        event.save()
    }

    if((!res.locals.admin && !res.locals.user) || res.locals.user.id !== event.author_id)
        res.status(403).send({message: "You don't have permission to change this data"});
    else
        res.status(200).send({message: "data updated"});
};

exports.deleteEvent = async(req, res) => {
    let event = await Event.findOne({where: {id: req.params.id}});

    if(!res.locals.admin && (!res.locals.user || (event.author_id != res.locals.user.id))) {
        return res.status(401).send("Only andmin and author can delete Event");
    }
    event.destroy({where: {id: req.params.id}}).then(() => {
        res.status(200).send("success");
    })
};

exports.getEventDateFilter = async(req, res) => {

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
        Event.findAll({where: {eventCreatedAt: {
                    [Op.between]: [data.dateStart, data.dateEnd]
                }
            }}).then(async(events) => {
            if(events) {
                let eventsCats = [];
                for(let Event of events) {
                    categories = await EventMiddleware.getCategoriesForEvent(Event.id);
                    eventsCats.push([Event, categories])
                }
                res.status(200).send(eventsCats);
            }
            else {
                res.status(404).send("events not found")
            }
        });
    }
    else {
        Event.findAll({where: {eventCreatedAt: {
            [Op.between]: [data.dateStart, data.dateEnd]
        }, status: 'active'
        }}).then(async(events) => {
            if(events) {
                let eventsCats = [];
                for(let Event of events) {
                    categories = await EventMiddleware.getCategoriesForEvent(Event.id);
                    eventsCats.push([Event, categories])
                }
                res.status(200).send(eventsCats);
            }
            else {
                res.status(404).send("events not found")
            }
        });
    }
}

exports.getEventCategoryFilter = async(req, res) => {
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
    const events = await EventMiddleware.getEventsByCategory(data.categories_id);
    let eventsCats = [];
    for(let Event of events) {
        categories = await EventMiddleware.getCategoriesForEvent(Event);
        eventsCats.push([Event, categories])
    }
    const pageevents = EventMiddleware.getEventForPage(req.body.page, eventsCats)
    res.status(200).send(pageevents)
    
    
};

exports.getEventPerPage = async(req, res) => {
    const eventsPerPage = 2
    if(res.locals.user && res.locals.admin && req.params.page > 0) {
        let events;
        let count;
        if(req.params.category) {
            if(req.params.category.localeCompare('!') === 0 && req.params.SearchField) {
                events = await db.sequelize.query(`select * from users inner join events on users.id = events.author_id where events.title like "%${req.params.SearchField}%" order by events.id DESC limit ${(req.params.page - 1) * eventsPerPage}, ${eventsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(*) from events where events.title like "%${req.params.SearchField}%";`, { type: db.sequelize.QueryTypes.SELECT });
            }
            else {
                events = await db.sequelize.query(`select * from users inner join events on users.id = events.author_id where exists (select * from Category_sub_tables where events.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}')) order by events.id DESC limit ${(req.params.page - 1) * eventsPerPage}, ${eventsPerPage};`, { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(*) from events where exists (select * from Category_sub_tables where events.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}'));`, { type: db.sequelize.QueryTypes.SELECT });
            }
        }
        else {
            events = await db.sequelize.query(`select * from users inner join events on users.id = events.author_id order by events.id DESC limit ${(req.params.page - 1) * eventsPerPage}, ${eventsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
            count = await db.sequelize.query(`select count(*) from events;`, { type: db.sequelize.QueryTypes.SELECT });
        }
        if(!events.length || !count.length)
            res.status(404).send({message: "events not found"})
        else {
            const data = events.map((event) => { 
                return {
                    id: event.id,
                    author_id: event.author_id,
                    content: event.content,
                    createdAt: event.createdAt,
                    likes: event.likes,
                    rating: event.rating,
                    real_name: event.real_name,
                    title: event.title,
                    status: event.status,
                    ticketPrice: event.ticketPrice,
                    promoCode: event.promoCode,
                    eventDate: event.eventDate,
                    eventLocation: event.eventLocation,
                    createdAt: event.eventCreatedAt,
                }
            })
            res.status(200).send({events: [...data], eventsCount: count[0][Object.keys(count[0])[0]], CurPage: req.params.page})
        }
    }
    else if (req.params.page > 0) {
        let events;
        let count;
        if(req.params.category) {
            if(req.params.category.localeCompare('!') === 0 && req.params.SearchField) {
                events = await db.sequelize.query(`select * from users inner join events on users.id = events.author_id where status = 'active' and events.title like "%${req.params.SearchField}%" order by events.id DESC limit ${(req.params.page - 1) * eventsPerPage}, ${eventsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(IF(status = 'active', 1, null)) from events where events.title like "%${req.params.SearchField}%";`, { type: db.sequelize.QueryTypes.SELECT });
            }
            else {
                events = await db.sequelize.query(`select * from events inner join users on users.id = events.author_id where status = 'active' and exists (select * from Category_sub_tables where events.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}')) order by events.id DESC limit ${(req.params.page - 1) * eventsPerPage}, ${eventsPerPage};`, { type: db.sequelize.QueryTypes.SELECT });
                count = await db.sequelize.query(`select count(IF(status = 'active', 1, null)) from events where exists (select * from Category_sub_tables where events.id = Category_sub_tables.event_id and exists (select * from Categories where Categories.id = Category_sub_tables.category_id and Categories.category_title = '${req.params.category}'));`, { type: db.sequelize.QueryTypes.SELECT });
            }
        }
        else {
            events = await db.sequelize.query(`select * from users inner join events on users.id = events.author_id where status = 'active' order by events.id DESC limit ${(req.params.page - 1) * eventsPerPage}, ${eventsPerPage};` , { type: db.sequelize.QueryTypes.SELECT });
            count = await db.sequelize.query(`select count(IF(status = 'active', 1, null)) from events;`, { type: db.sequelize.QueryTypes.SELECT });
        }
        if(!events.length || !count.length)
            res.status(404).send({message: "events not found"})
        else {
            const data = events.map((event) => { 
                return {
                    id: event.id,
                    author_id: event.author_id,
                    content: event.content,
                    createdAt: event.createdAt,
                    likes: event.likes,
                    rating: event.rating,
                    real_name: event.real_name,
                    title: event.title,
                    ticketPrice: event.ticketPrice,
                    promoCode: event.promoCode,
                    eventLocation: event.eventLocation,
                    eventDate: event.eventDate,
                    createdAt: event.eventCreatedAt,
                }
            })
            res.status(200).send({events: [...data], eventsCount: count[0][Object.keys(count[0])[0]], CurPage: req.params.page})
        }
    }
    else 
        res.status(404).send("events not found")
};