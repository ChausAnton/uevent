import { Router } from "express";
const multer = require("multer");
const image = require('../controllers/image.controller');
const router = Router();

router.get('/getUserImage/:id', image.getUserImage);
// router.delete('/deletelike/:id', like.deletelike);

const upload = multer();
router.post('/uploadUserImage/:id', upload.single("file"), image.uploadUserImage);
export default router;