const { body } = require('express-validator');

const createArticleValidation = [
  body('titre')
    .notEmpty().withMessage('Le titre est obligatoire')
    .isLength({ max: 255 }).withMessage('Le titre ne doit pas dépasser 255 caractères'),
  body('contenu')
    .notEmpty().withMessage('Le contenu est obligatoire'),
  body('auteur')
    .notEmpty().withMessage('L\'auteur est obligatoire')
    .isLength({ max: 100 }).withMessage('L\'auteur ne doit pas dépasser 100 caractères'),
  body('date')
    .notEmpty().withMessage('La date est obligatoire')
    .isISO8601().withMessage('La date doit être au format YYYY-MM-DD'),
  body('categorie')
    .notEmpty().withMessage('La catégorie est obligatoire'),
  body('tags')
    .optional()
    .isArray().withMessage('Les tags doivent être un tableau')
];

const updateArticleValidation = [
  body('titre')
    .optional()
    .isLength({ max: 255 }).withMessage('Le titre ne doit pas dépasser 255 caractères'),
  body('auteur')
    .optional()
    .isLength({ max: 100 }).withMessage('L\'auteur ne doit pas dépasser 100 caractères'),
  body('date')
    .optional()
    .isISO8601().withMessage('La date doit être au format YYYY-MM-DD'),
  body('tags')
    .optional()
    .isArray().withMessage('Les tags doivent être un tableau')
];

module.exports = { createArticleValidation, updateArticleValidation };
