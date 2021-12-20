const Validator  = require('fastest-validator');
const db = require('../models');
const subscrition = db.subscritionToEvent
const Event = db.Event

exports.createSubscription = async(req, res) => {
    if(!res.locals.user) {
        return res.status(404).send({message: "user not found"})

    }
    const schema = {
        event_id: { type: "number", optional: false},
        user_id: {type: "number", optional: false},
        promoCode: {type: "string", optional: true, min: 4, max: 4},
    }

    let data = {
        event_id: (req.params.id ? parseInt(req.params.id) : null),
        user_id: res.locals.user.id,
        promoCode: req.body.promoCode
    }

    const v = new Validator();
    const validationresponse = v.validate(data, schema);
    if(validationresponse !== true) {
        return res.status(400).json({
            message: "Validation fail",
            errors: validationresponse
        });
    }
    let check = null
    if(req.body.promoCode)
        check = await Event.findOne({where: {id: req.params.id, promoCode: req.body.promoCode}})

    if(req.body.promoCode && !check) {
        return res.status(403).send({message: "unknown promocode"})

    }

    delete data.promoCode
    const result = await subscrition.findOrCreate({where: data})

    if(result[1] === false) {
        await subscrition.destroy({where: data})
    }

    return res.status(201).send({subscrition: result[0], status: result[1]})
}

exports.getAllSubsForUser = async(req, res) => {
    if(!res.locals.user) {
        return res.status(404).send({message: "user not found"})
    }

    const subs = await subscrition.findAll({where: {user_id: res.locals.user.id}})
    const ids = subs.map((sub, index) => {
        if(isNaN(sub.event_id))
            return null
        return sub.event_id
    })
    const cleanUp = ids.filter((v) => v !== null)

    const result = await Event.findAll({where: {id: cleanUp}})
    return res.status(200).send(result)
}

exports.getAllEventsWithSubsForUser = async(req, res) => {
    if(!res.locals.user) {
        return res.status(404).send({message: "user not found"})
    }

    const subs = await subscrition.findAll({where: {user_id: res.locals.user.id}})

    const ids = subs.map((sub, index) => {
        if(isNaN(sub.event_id))
            return null
        if(index === 0)
            return (`${sub.event_id}`)
        return (` or id=${sub.event_id}`)
    })
    const cleanUp = ids.filter(([_, v]) => v !== null)

    if(res.locals.user && res.locals.admin) {
        const events = await db.sequelize.query(`select * from events where id=${cleanUp.join('')} order by id DESC;`, { type: db.sequelize.QueryTypes.SELECT })
        if(events) {
            return res.status(200).send(events);
        }
        else {
            return res.status(404).send({message: "events not found"});
        }
    }
    else {
        const events = await db.sequelize.query(`select * from events where id=${cleanUp.join('')} and status = "active" order by id DESC;`, { type: db.sequelize.QueryTypes.SELECT })
        if(events) {
            return res.status(200).send(events);
        }
        else {
            return res.status(404).send({message: "events not found"});
        }
    }

}