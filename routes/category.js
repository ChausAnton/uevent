import { Router } from "express";
const category = require('../controllers/category.controller');
const router = Router();

router.get('/getCategory/:id', category.getCategory);
router.get('/getCategories', category.getCategories);
router.post('/createCategory', category.createCategory);
router.put('/updateCategory/:id', category.updateCategory);
router.delete('/deleteCategory/:id', category.deleteCategory);

export default router;