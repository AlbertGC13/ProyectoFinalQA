const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./models');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const { isAdmin } = require('./middleware/authMiddleware');
const productController = require('./controllers/productController');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3001', 'https://proyectofinalqa-production.up.railway.app'],// URL del cliente
  credentials: true // Permitir enviar y recibir cookies
}));

app.options('*', cors()); // Esto permite que todas las rutas respondan correctamente a las solicitudes preflight OPTIONS

app.use(express.json());

app.use(session({ 
  secret: '0c8735e7592242c12f1fc7e3ba8e2ea7a34c3eb17f2eaddd2cf24f663493bcf3', 
  resave: false, 
  saveUninitialized: false, 
  cookie: {
    maxAge: 30 * 60 * 10000, // 30 minutos
    secure: process.env.NODE_ENV === 'production' ? true : false, // Solo true en producción
    httpOnly: true, // Las cookies no estarán disponibles a través de JavaScript
    sameSite: 'None'  // Esto es crucial para que las cookies funcionen en un entorno de dominio cruzado
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

      console.log("Password from DB:", user.password);
      console.log("Password provided:", password);

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          console.log("Password mismatch");
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    }).catch(err => done(err));
  }
));


passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findByPk(id).then(user => {
    console.log('Deserializing user:', user);
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

// Asegúrate de usar las rutas correctamente
app.use('/products', productRoutes);
app.use('/users', userRoutes); 
app.use('/stock-movements', stockRoutes);

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

const createDefaultUser = async () => {
  try {
    const adminUser = await db.User.findOne({ where: { username: 'admin' } });

    if (!adminUser) {
      await db.User.create({
        username: 'admin',
        password: bcrypt.hashSync('admin', 10), // Asegúrate de usar un hash seguro para la contraseña
        role: 'admin'
      });
      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
};

// Llamada a la función después de la sincronización de la base de datos
db.sequelize.sync().then(async () => {
  await createDefaultUser();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

