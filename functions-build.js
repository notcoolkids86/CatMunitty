// Fungsi ini membantu membangun fungsi serverless untuk Netlify
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Membuat direktori fungsi jika belum ada
if (!fs.existsSync('netlify/functions')) {
  fs.mkdirSync('netlify/functions', { recursive: true });
}

// Script untuk build API serverless
console.log('Building serverless functions for Netlify...');

// Membuat fungsi API
const apiFunction = `
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const session = require('express-session');
const passport = require('passport');
const connectPgSimple = require('connect-pg-simple');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Session setup
const PgStore = connectPgSimple(session);
const sessionMiddleware = session({
  store: new PgStore({
    pool,
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'catmunitty-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// API for campaigns, donations, users, etc. would go here
// ...

// Netlify function handler
exports.handler = serverless(app);
`;

// Simpan API function
fs.writeFileSync('netlify/functions/api.js', apiFunction);

console.log('Build completed successfully!');