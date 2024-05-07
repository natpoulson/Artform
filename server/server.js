const express = require('express');
const db = require('./config/database');

const PORT = 3001;
const app = express();

db.once('open', () => {
    app.listen(PORT, () => {
        console.log('Now listening on port', PORT);
    });
});