const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../models');
const { isAdmin } = require('../middleware/authMiddleware');

// Endpoint de registro
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log('Intentando registrar usuario:', username);
    const user = await db.User.create({ username, password, role });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint de login
router.post('/login', (req, res, next) => {
  console.log('Intentando iniciar sesión para el usuario:', req.body.username);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error en autenticación:', err);
      return res.status(500).json({ message: 'Error en autenticación' });
    }
    if (!user) {
      console.warn('Usuario no encontrado o credenciales incorrectas:', info);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error al iniciar sesión:', err);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
      }
      console.log('Inicio de sesión exitoso para el usuario:', user.username);
      return res.status(200).json({ message: 'Login successful' });
    });
  })(req, res, next);
});

// Endpoint protegido
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
