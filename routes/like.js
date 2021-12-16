import { Router } from "express";
const like = require('../controllers/like.controller');
const router = Router();

router.get('/getLike/:id', like.getLike);
router.get('/getLikes', like.getLikes);
router.get('/getLikesForPost/:id', like.getLikesForPost);
router.get('/getLikesForComment/:id', like.getLikesForComment);
router.post('/createLike', like.createLike);
// router.delete('/deletelike/:id', like.deletelike);

export default router;