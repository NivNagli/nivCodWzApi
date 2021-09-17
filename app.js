const express = require('express');
const app = express();

const pullRoutes = require("./routes/pull");
const extractRoutes = require('./routes/extract');

/* CORS PERMESSION'S */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/pull', pullRoutes);
app.use('/extract', extractRoutes);
app.listen(8080);