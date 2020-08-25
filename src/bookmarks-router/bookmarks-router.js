const express = require('express')

const bookmarksRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store');

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { title, url, rating, desc } = req.body;

    if (!title) {
        logger.error('Title is required')
        return res
            .status(400)
            .send('Invalid data')
    }

    if (!url) {
        logger.error('URL is required')
        return res
            .status(400)
            .send('Invalid data')
    }

    const id = uuid();

    const bookmark = {
        id,
        title,
        url,
        rating,
        desc
    };

    bookmarks.push(bookmark);

    logger.info(`Card with id ${id} was created`)

    res
        .status(201)
        .location(`http://localhost:8000/bookmark/${id}`)
        .json(bookmark);
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);

    if (!bookmark) {
        logger.error(`Bookmark with id ${id} was not found.`)
        return res
            .status(404)
            .send('Not Found.')
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

    if (bookmarkIndex === -1) {
        logger.error(`Bookmark with id ${id} not found`);
        return res  
            .status(404)
            .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Card with id ${id} was deleted`)

    res
        .status(204)
        .end();
  });

module.exports = bookmarksRouter