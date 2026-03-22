# Blog API - Node.js + Express + SQLite

API REST complete pour gerer un blog simple, avec interface web et documentation Swagger.

---

## Installation et Demarrage

Prerequis : Node.js v18+ (https://nodejs.org)

```bash
cd blog-api
npm install
npm start
```
en local 
| URL | Description |
|-----|-------------|
| http://localhost:3000 | Interface web du blog |
| http://localhost:3000/api-docs | Documentation Swagger |
| http://localhost:3000/api | Infos JSON |

---
en ligne 

| URL | Description |
|-----|-------------|
| https://taf1-inf222.onrender.com| Interface web du blog |
| https://taf1-inf222.onrender.com/api-docs/| Documentation Swagger 
|https://taf1-inf222.onrender.com/api | Infos JSON |

---


## Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/articles | Lister tous les articles |
| GET | /api/articles?categorie=Tech | Filtrer par categorie |
| GET | /api/articles?auteur=Alice | Filtrer par auteur |
| GET | /api/articles?date=2026-03-21 | Filtrer par date |
| GET | /api/articles/:id | Un article par ID |
| POST | /api/articles | Creer un article |
| PUT | /api/articles/:id | Modifier un article |
| DELETE | /api/articles/:id | Supprimer un article |
| GET | /api/articles/search?query=node | Rechercher |

---

## Exemple - Creer un article

```bash
curl -X POST http://localhost:3000/api/articles   -H "Content-Type: application/json"   -d '{
    "titre": "Mon article",
    "contenu": "Contenu...",
    "auteur": "Alice",
    "date": "2026-03-21",
    "categorie": "Tech",
    "tags": ["node", "api"]
  }'
```

Reponse 201 :

```json
{
  "message": "Article cree avec succes",
  "article": {
    "id": "uuid-...",
    "titre": "Mon article",
    "auteur": "Alice"
  }
}
```

---

## Structure

```
blog-api/
|-- src/
|   |-- server.js
|   |-- config/
|   |   |-- database.js
|   |   |-- swagger.js
|   |-- routes/
|   |   |-- article.routes.js
|   |-- controllers/
|   |   |-- article.controller.js
|   |-- models/
|   |   |-- article.model.js
|   |-- middleware/
|       |-- validation.js
|-- public/
|   |-- index.html
|-- package.json
|-- README.md
```

---

## Codes HTTP

| Code | Signification |
|------|---------------|
| 200 OK | Requete reussie |
| 201 Created | Ressource creee |
| 400 Bad Request | Donnees invalides |
| 404 Not Found | Ressource introuvable |
| 500 Internal Server Error | Erreur serveur |

---

## Technologies

- Runtime : Node.js
- Framework : Express.js
- Base de donnees : SQLite (better-sqlite3)
- Documentation : Swagger UI
- Validation : express-validator
- Securite : helmet, cors
- Logs : morgan
