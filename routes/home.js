import express from 'express';
import fsPromise from 'fs/promises';


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const homeRouter = express.Router();

async function getFileNames(directoryPath) {
  try {
    let result = {}
    const files = await fsPromise.readdir(directoryPath);
    const fileNames = files.map((file, i) => {
        const fileType = file.split('-')[1].split('.')[0];
        return  { name: file, type: fileType };
    });

    return fileNames;
  } catch (err) {
    console.log('Unable to scan directory: ' + err);
    return [];
  }
}


homeRouter.get('/', async (req, res) => {

    getFileNames(`./views/partials/characters/`).then((result) => {

        res.render('layout', {
            'view': 'home',
            'characterObject': result
        });
    })
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
}); });

homeRouter.get('/ine', async (req, res) => {
    res.render('layout', {
        'view': 'blanco',
        'partial': './partials/characters/character-worm',
    });
});

homeRouter.get('/ui', async (req, res) => {
    res.render('layout', {
        'view': 'ui',

    });
});

export default homeRouter;