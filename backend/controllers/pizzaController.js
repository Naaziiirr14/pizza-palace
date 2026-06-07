const { validationResult } = require('express-validator');
const Pizza = require('../models/Pizza');

// GET /api/pizzas
exports.getAllPizzas = async (req, res, next) => {
  try {
    const { category, search, available } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (available !== 'false') filter.isAvailable = true;
    if (search) filter.$text = { $search: search };

    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: pizzas.length, pizzas });
  } catch (error) {
    next(error);
  }
};

// GET /api/pizzas/:id
exports.getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found.' });
    res.json({ success: true, pizza });
  } catch (error) {
    next(error);
  }
};

// POST /api/pizzas  [Admin]
exports.createPizza = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, message: 'Pizza created.', pizza });
  } catch (error) {
    next(error);
  }
};

// PUT /api/pizzas/:id  [Admin]
exports.updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found.' });
    res.json({ success: true, message: 'Pizza updated.', pizza });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/pizzas/:id  [Admin]
exports.deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found.' });
    res.json({ success: true, message: 'Pizza deleted.' });
  } catch (error) {
    next(error);
  }
};
