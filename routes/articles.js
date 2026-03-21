const express = require('express');
const router = express.Router();
const {
  createArticle,
  getArticles,
  searchArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         titre:
 *           type: string
 *           example: "Introduction au Web"
 *         contenu:
 *           type: string
 *           example: "Le développement web est..."
 *         auteur:
 *           type: string
 *           example: "Charles"
 *         date:
 *           type: string
 *           example: "2026-03-21"
 *         categorie:
 *           type: string
 *           example: "Technologie"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["web", "html", "css"]
 *     ArticleInput:
 *       type: object
 *       required:
 *         - titre
 *         - contenu
 *         - auteur
 *         - categorie
 *       properties:
 *         titre:
 *           type: string
 *         contenu:
 *           type: string
 *         auteur:
 *           type: string
 *         categorie:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createArticle);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles (avec filtres optionnels)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Filtrer par date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des articles
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getArticles);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles par texte
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre et le contenu
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *       400:
 *         description: Paramètre query manquant
 */
router.get('/search', searchArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', getArticleById);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article existant
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article non trouvé
 */
router.put('/:id', updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:id', deleteArticle);

module.exports = router;
