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
const { isAdmin, isEmployee, isAuthenticated } = require('./middleware/authMiddleware');
const productController = require('./controllers/productController');
require('dotenv').config();

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
console.log('Environment:', process.env.NODE_ENV);
console.log('Is Production:', isProduction);

const allowedOrigins = [
  'https://proyectofinalqa-production.up.railway.app',
  'http://localhost:3001',
  'https://reimagined-dollop-ppj6r5wxvprc4qj-3001.app.github.dev'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || '0c8735e7592242c12f1fc7e3ba8e2ea7a34c3eb17f2eaddd2cf24f663493bcf3',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  }
};

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("-------- Nueva solicitud --------");
  console.log("Método:", req.method);
  console.log("URL:", req.url);
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  console.log("Is Authenticated:", req.isAuthenticated());
  console.log("User:", req.user);
  console.log("Cookies:", req.headers.cookie);
  next();
});

passport.use(new LocalStrategy(async (username, password, done) => {
  console.log("Attempting authentication for user:", username);
  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      console.log("User not found:", username);
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log("Password match for user:", username);
      return done(null, user);
    } else {
      console.log("Incorrect password for user:", username);
      return done(null, false, { message: 'Incorrect password.' });
    }
  } catch (err) {
    console.error("Error during authentication:", err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user:', id);
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/stock-movements', stockRoutes);

app.get('/logout', (req, res) => {
  console.log("Logout request received");
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send('Error al cerrar sesión');
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send('Error al destruir la sesión');
      }
      res.clearCookie('connect.sid');
      console.log("Logout successful");
      res.redirect('/');
    });
  });
});

app.get('/check-auth', (req, res) => {
  console.log("Check auth request received");
  console.log("Is Authenticated:", req.isAuthenticated());
  console.log("User:", req.user);
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

const createDefaultUser = async () => {
  try {
    const adminUser = await db.User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await db.User.create({
        username: 'admin',
        password: hashedPassword,
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

db.sequelize.sync().then(async () => {
  await createDefaultUser();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = app;