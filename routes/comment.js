import { Router } from "express";
const comment = require('../controllers/comment.controller');
const router = Router();

router.get('/getComment/:id', comment.getComment);
router.get('/getComments', comment.getComments);
router.post('/createComment', comment.createComment);
router.get('/getCommentsForPost/:id', comment.getCommentsForPost)
router.put('/updateComment/:id', comment.updateComment);
router.delete('/deleteComment/:id', comment.deleteComment);

export default router;