import express from 'express';

const homeRouter = express.Router();

homeRouter.get('/', async (req, res) => {
    res.render('layout', {
        'view': 'home',
    });
});


homeRouter.get('/sas', async (req, res) => {
    res.render('layout', {
        'view': 'blanco',
        'partial': './partials/characters/character-kitty',
    });
});


homeRouter.get('/pip', async (req, res) => {
    res.render('layout', {
        'view': 'blanco',
        'partial': './partials/characters/character-eyeguy',
    });
});

export default homeRouter;