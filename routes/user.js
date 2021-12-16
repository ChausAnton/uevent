import { Router } from "express";
const user = require('../controllers/user.controller');
const router = Router();

router.get('/getUser/:id', user.getUser)
router.get('/getUsers', user.getUsers)
router.delete('/deleteUser/:id', user.deleteUser)
router.put('/updateUser/:id', user.updateUser)

export default router;