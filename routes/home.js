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

export default homeRouter;