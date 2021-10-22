/* local libraries */
const path = require('path');
const fs = require('fs');

/* global libraries */
const express = require('express');
const app = express();
const compression = require('compression');
const morgan = require('morgan');

const pullRoutes = require("./routes/pull");
const extractRoutes = require('./routes/extract');

/* Log tracking */
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  
  app.use(compression());
  app.use(morgan('combined', { stream: accessLogStream }));

/* CORS PERMESSION'S */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/pull', pullRoutes);
app.use('/extract', extractRoutes);
app.listen(process.env.PORT || 8080);