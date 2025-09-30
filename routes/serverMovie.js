const express = require('express');
const router = express.Router();

const moviesData = require('../src/components/mock/kinopoisk.json');
const movies = moviesData.docs || [];

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12345
 *         name:
 *           type: string
 *           example: "Inception"
 *         year:
 *           type: integer
 *           example: 2010
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Sci-Fi", "Action"]
 *         type:
 *           type: string
 *           example: "movie"
 *         description:
 *           type: string
 *           example: "A thief who steals corporate secrets through dream-sharing technology..."
 *         rating:
 *           type: number
 *           format: float
 *           example: 8.8
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Получить список фильмов (с фильтрацией)
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: false
 *         description: Фильтрация по жанру (например, Comedy, Drama)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Фильтрация по типу (movie, cartoon, tv-series)
 *     responses:
 *       200:
 *         description: Список фильмов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/', (req, res) => {
    const { genre, type } = req.query;

    let filtered = movies;

    if (genre) {
        filtered = filtered.filter(m =>
            m.genres.map(g => g.toLowerCase()).includes(genre.toLowerCase())
        );
    }

    if (type) {
        filtered = filtered.filter(m => m.type === type);
    }

    res.json(filtered);
});

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Получить фильм по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID фильма
 *     responses:
 *       200:
 *         description: Фильм найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Фильм не найден
 */
router.get('/:id', (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const movie = movies.find(m => m.id === movieId);

    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ error: 'Фильм не найден' });
    }
});

module.exports = router;
