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

app.use(express.json());
app.use(cors());
app.use(session({ 
  secret: '0c8735e7592242c12f1fc7e3ba8e2ea7a34c3eb17f2eaddd2cf24f663493bcf3', 
  resave: false, 
  saveUninitialized: false 
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

app.post('/products', isAdmin, productController.createProduct);
app.put('/products/:id', isAdmin, productController.updateProduct);
app.delete('/products/:id', isAdmin, productController.deleteProduct);

app.use('/products', productRoutes);
app.use('/users', userRoutes); // Usa las rutas de usuario

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
