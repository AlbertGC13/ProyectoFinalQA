const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./models');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas de usuario
const { isAdmin } = require('./middleware/authMiddleware');
const productController = require('./controllers/productController');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // URL del cliente
  credentials: true // Permitir enviar y recibir cookies
}));
app.use(express.json());

app.use(session({ 
  secret: '0c8735e7592242c12f1fc7e3ba8e2ea7a34c3eb17f2eaddd2cf24f663493bcf3', 
  resave: false, 
  saveUninitialized: false, 
  cookie: {
    maxAge: 30 * 60 * 10000 // 30 minutos
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({ where: { username } }).then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    }).catch(err => done(err));
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findByPk(id).then(user => {
    done(null, user);
  }).catch(err => done(err, null));
});

// Middleware para actualizar la sesión
app.use((req, res, next) => {
  if (req.session) {
    req.session._garbage = Date();
    req.session.touch();
  }
  next();
});

app.post('/products', isAdmin, productController.createProduct);
app.put('/products/:id', isAdmin, productController.updateProduct);
app.delete('/products/:id', isAdmin, productController.deleteProduct);

app.use('/products', productRoutes);
app.use('/users', userRoutes); 

// Ruta de cierre de sesión
app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/'); // redirige a la página de inicio después de cerrar sesión
  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
