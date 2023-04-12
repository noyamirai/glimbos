import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dashRouter from './routes/home.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 9000;

app.locals.fs = fs;
app.locals.characterAmount = 6;
app.locals.cellAmount = 16;

// SET TEMPLATE ENGINE
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('static'));
app.use('/static', express.static(__dirname + '/static/'));
app.use('/', express.static(__dirname + '/'));

// ROUTES
app.use('/', dashRouter);

app.get('*', (req, res) => {

    res.render('layout', {
        'view': '404',
        'bodyClass': 'error',
    });
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});