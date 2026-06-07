const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAllPizzas, getPizzaById, createPizza, updatePizza, deletePizza } = require('../controllers/pizzaController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);

router.post('/', verifyToken, isAdmin, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Valid price required'),
  body('category').isIn(['Veg', 'Non-Veg', 'Specialty']).withMessage('Invalid category'),
  body('imageUrl').trim().notEmpty().withMessage('Image URL is required'),
], createPizza);

router.put('/:id', verifyToken, isAdmin, updatePizza);
router.delete('/:id', verifyToken, isAdmin, deletePizza);

module.exports = router;
