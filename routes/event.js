import { Router } from "express";
const Event = require('../controllers/event.controller');
const router = Router();

router.get('/getEvent/:id', Event.getEvent);
router.get('/getEvents', Event.getEvents);
router.get('/getEventDateFilter', Event.getEventDateFilter);//
router.get('/getEventCategoryFilter', Event.getEventCategoryFilter);
router.get('/getEventsForUser/:id', Event.getEventsForUser);
router.get('/getEventPerPage/:page/:category?/:SearchField?', Event.getEventPerPage);
router.get('/getEventDetail/:id', Event.getEventDetail);
router.post('/createEvent', Event.createEvent);
router.put('/updateEvent/:id', Event.updateEvent);
router.delete('/deleteEvent/:id', Event.deleteEvent);

export default router;