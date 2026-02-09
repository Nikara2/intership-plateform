🎓 Internship & Student Placement – Backend API

API backend complète pour la gestion des stages étudiants, des candidatures, des évaluations et du suivi administratif, développée avec NestJS, TypeORM, PostgreSQL et JWT.

📌 Sommaire

Présentation

Stack & Architecture

Installation

Configuration

Lancement

Documentation API

Authentification & Sécurité

Rôles & Permissions

Modèles de données

Tests

Dépannage

🎯 Présentation

Cette API couvre tout le cycle de gestion des stages :

Authentification et gestion des utilisateurs

Gestion des profils étudiants, entreprises et superviseurs

Publication et consultation des offres de stage

Candidatures étudiantes

Évaluations de stage

Historique et traçabilité des candidatures

🏗️ Stack & Architecture
Technologies utilisées

Framework : NestJS (TypeScript)

Base de données : PostgreSQL

ORM : TypeORM

Authentification : JWT (Passport)

Validation : class-validator

Documentation : Swagger / OpenAPI

Structure du projet
src/
├── auth/              # Authentification & JWT
├── users/             # Utilisateurs
├── students/          # Profils étudiants
├── companies/         # Profils entreprises
├── supervisors/       # Superviseurs
├── offers/            # Offres de stage
├── applications/      # Candidatures
├── evaluations/       # Évaluations
├── histories/         # Historique des candidatures
├── common/            # Guards, decorators, enums
├── config/            # Configuration globale
└── main.ts            # Point d’entrée

📦 Installation
Prérequis

Node.js 18+

npm ou yarn

PostgreSQL 12+

Installation
git clone <repository-url>
cd internship-backend
npm install

⚙️ Configuration
Variables d’environnement

Créer un fichier .env :

APP_PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=internship_db

JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=3600


Les tables sont créées automatiquement via TypeORM (synchronize: true).

Initialisation d’un administrateur (optionnel)
npm run seed


Identifiants par défaut :

Email : admin@school.com

Mot de passe : Admin123!

🚀 Lancement
npm run start:dev     # Développement
npm run build
npm run start:prod    # Production


Serveur accessible sur :

http://localhost:3000

Swagger
http://localhost:3000/api/docs

📚 Documentation API
Authentification
Inscription
POST /auth/register

{
  "email": "student@example.com",
  "password": "Password123",
  "role": "STUDENT"
}

Connexion
POST /auth/login

{
  "access_token": "jwt_token"
}

Students – Profils étudiants

POST /students → créer un profil

GET /students/me → mon profil

PATCH /students/me → mise à jour

POST /students/{id}/upload-cv → upload CV

Admin uniquement :

GET /students

GET /students/{id}

PATCH /students/{id}

DELETE /students/{id}

Companies – Profils entreprises

POST /companies

GET /companies/me

PATCH /companies/me

Admin / Company :

GET /companies

GET /companies/{id}

Supervisors – Superviseurs

POST /supervisors

GET /supervisors

GET /supervisors/{id}

PATCH /supervisors/{id}

DELETE /supervisors/{id}

Offers – Offres de stage

POST /offers (Company)

GET /offers

GET /offers/{id}

PATCH /offers/{id}

DELETE /offers/{id}

Applications – Candidatures

POST /applications (Student)

GET /applications/me

PATCH /applications/{id}/status (Supervisor)

Statuts possibles :
PENDING, ACCEPTED, REJECTED, COMPLETED

Evaluations

POST /evaluations (Supervisor)

GET /evaluations/me (Student)

GET /evaluations

PATCH /evaluations/{id}

DELETE /evaluations/{id}

Histories – Historique
GET /histories


Filtrage automatique selon le rôle :

STUDENT → ses candidatures

COMPANY → candidatures de l’entreprise

SUPERVISOR → suivis assignés

ADMIN → tout

🔐 Authentification & Sécurité
Header requis
Authorization: Bearer {access_token}

Contenu du JWT
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "STUDENT",
  "iat": 1234567890,
  "exp": 1234571490
}

👥 Rôles & Permissions
Rôle	Accès
STUDENT	Offres, candidatures, évaluations
COMPANY	Offres, superviseurs
SUPERVISOR	Validation et évaluation
SCHOOL_ADMIN	Accès total

Guards utilisés :

JwtAuthGuard

RolesGuard

🗄️ Modèles de données (simplifié)

User

Student

Company

Offer

Application

Evaluation

StudentApplicationHistory

Relations gérées via TypeORM.

✅ Tests
npm run test        # unitaires
npm run test:e2e    # e2e
npm run test:cov    # couverture

🐛 Dépannage
UUID invalide

➡️ Placer /me avant /:id

PostgreSQL non accessible

➡️ Vérifier que le service est démarré

Unauthorized

➡️ Token manquant, expiré ou invalide

Forbidden

➡️ Rôle non autorisé

📜 Scripts npm
npm run start:dev
npm run build
npm run start:prod
npm run lint
npm run test
npm run seed

🌐 Swagger / OpenAPI

Docs : http://localhost:3000/api/docs

JSON : http://localhost:3000/api-json

📬 Postman

Collection fournie :

./Internship_Backend.postman_collection.json

📄 Licence

UNLICENSED