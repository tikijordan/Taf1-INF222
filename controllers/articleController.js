const ArticleModel = require('../models/Article');

// POST /api/articles
const createArticle = (req, res) => {
  const { titre, contenu, auteur, categorie, tags } = req.body;

  if (!titre || !contenu || !auteur || !categorie) {
    return res.status(400).json({
      success: false,
      message: 'Champs obligatoires manquants: titre, contenu, auteur, categorie',
    });
  }

  try {
    const article = ArticleModel.create({ titre, contenu, auteur, categorie, tags });
    return res.status(201).json({
      success: true,
      message: 'Article créé avec succès',
      data: article,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/articles
const getArticles = (req, res) => {
  const { categorie, auteur, date, page, limit } = req.query;
  try {
    const articles = ArticleModel.findAll({ categorie, auteur, date, page, limit });
    return res.status(200).json({ success: true, data: articles, count: articles.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/articles/search?query=texte
const searchArticles = (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Paramètre query requis' });
  }
  try {
    const articles = ArticleModel.search(query);
    return res.status(200).json({ success: true, data: articles, count: articles.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/articles/:id
const getArticleById = (req, res) => {
  const { id } = req.params;
  try {
    const article = ArticleModel.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    return res.status(200).json({ success: true, data: article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// PUT /api/articles/:id
const updateArticle = (req, res) => {
  const { id } = req.params;
  const { titre, contenu, auteur, categorie, tags } = req.body;

  if (!titre && !contenu && !auteur && !categorie && !tags) {
    return res.status(400).json({ success: false, message: 'Au moins un champ à modifier est requis' });
  }

  try {
    const article = ArticleModel.update(id, { titre, contenu, auteur, categorie, tags });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    return res.status(200).json({ success: true, message: 'Article mis à jour', data: article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// DELETE /api/articles/:id
const deleteArticle = (req, res) => {
  const { id } = req.params;
  try {
    const deleted = ArticleModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    return res.status(200).json({ success: true, message: 'Article supprimé avec succès' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { createArticle, getArticles, searchArticles, getArticleById, updateArticle, deleteArticle };
