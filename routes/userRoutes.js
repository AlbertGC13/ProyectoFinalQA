const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../models');

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await db.User.create({ username, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Añadir la ruta de inicio de sesión
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: 'Login successful' });
});

// Añadir una ruta GET para obtener todos los usuarios (para depuración)
router.get('/', async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
