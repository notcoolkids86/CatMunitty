// functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const { registerRoutes } = require('../server/routes');
const app = express();

app.use(express.json());

// Register all routes from the main application
registerRoutes(app);

// Export the serverless handler
module.exports.handler = serverless(app);