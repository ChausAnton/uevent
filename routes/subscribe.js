import { Router } from "express";
const subscribe = require('../controllers/subscribe.controller');
const router = Router();

router.post('/createSubscription/:id', subscribe.createSubscription);
router.get('/getAllSubsForUser', subscribe.getAllSubsForUser);
router.get('/getAllEventsWithSubsForUser', subscribe.getAllEventsWithSubsForUser);


export default router;