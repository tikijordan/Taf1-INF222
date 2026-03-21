const { validationResult } = require('express-validator');
const ArticleModel = require('../models/article.model');

/**
 * GET /api/articles
 * Liste tous les articles avec filtres optionnels
 */
const getArticles = (req, res) => {
  try {
    const { categorie, auteur, date } = req.query;
    const articles = ArticleModel.getAll({ categorie, auteur, date });
    res.status(200).json({ articles, total: articles.length });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

/**
 * GET /api/articles/:id
 * Récupère un article par son ID
 */
const getArticleById = (req, res) => {
  try {
    const article = ArticleModel.getById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: `Article avec l'ID "${req.params.id}" non trouvé` });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

/**
 * POST /api/articles
 * Crée un nouvel article
 */
const createArticle = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Données invalides', details: errors.array() });
  }

  try {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;
    const article = ArticleModel.create({ titre, contenu, auteur, date, categorie, tags: tags || [] });
    res.status(201).json({ message: 'Article créé avec succès', article });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

/**
 * PUT /api/articles/:id
 * Modifie un article existant
 */
const updateArticle = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Données invalides', details: errors.array() });
  }

  try {
    const article = ArticleModel.update(req.params.id, req.body);
    if (!article) {
      return res.status(404).json({ error: `Article avec l'ID "${req.params.id}" non trouvé` });
    }
    res.status(200).json({ message: 'Article modifié avec succès', article });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

/**
 * DELETE /api/articles/:id
 * Supprime un article par son ID
 */
const deleteArticle = (req, res) => {
  try {
    const article = ArticleModel.delete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: `Article avec l'ID "${req.params.id}" non trouvé` });
    }
    res.status(200).json({ message: 'Article supprimé avec succès', article });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

/**
 * GET /api/articles/search?query=...
 * Recherche d'articles par titre ou contenu
 */
const searchArticles = (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Paramètre "query" requis' });
    }
    const articles = ArticleModel.search(query.trim());
    res.status(200).json({ articles, total: articles.length, query });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles
};
