const db = require('../models');
const Category_sub_table = db.Category_sub_table;
const Event = db.Event
const { Op } = require("sequelize");

exports.addCategory = async(CategroyJson, eventID) => {
    Category_sub_table.destroy({where: {event_id: eventID}}).then(async() => {
        for(const [key, value] of Object.entries(CategroyJson)) {
            $data = {
                event_id: eventID,
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

exports.getCategoriesForEvent = async(event) => {
    let res = [];

    categories = await Category_sub_table.findAll({where: 
        {event_id: event.id}
    });

    res.push(event)
    res.push(categories)

    return res;
}

exports.getCategoriesForEvents = async(events) => {

    let res = [];
    let events_id = [];
    for(const event of events) {
        events_id.push(event.id);
    }

    categories = await Category_sub_table.findAll({where: 
        {event_id:  {
                [Op.or]: events_id
            }
        }
    });

    for(const event of events) {
        let temp = [];
        temp.push(event);
        for(const cat of categories) {
            if(cat.event_id == event.id)
                temp.push(cat);
        }
        res.push(temp);
    }

    return res;

};

exports.getEventForPage = (page, events) => {
    if(!page && page != 0) {
        return events;
    }
    const eventsPerPage = 10;

    const startevent = page * eventsPerPage;
    const endevent = page * eventsPerPage + 10;
    let pageevents = [];

    for(let i = startevent; i < endevent; i++) {
        if(events[i])
            pageevents.push(events[i]);
    }
    return pageevents;
};

exports.getEventsByCategory = async(CategroyJson) => {
    let events;
    let categories_id = [];
    let events_id = [];
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
        events_id.push(cat.event_id);
    }
    events = await Event.findAll({where: 
        {id:  {
                [Op.or]: events_id
            }
        }
    });


    
    return events;
};