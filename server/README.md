# Community Pickup Market Backend

## Installation

1. Installer les dépendances :
```bash
cd server
npm install
```

2. Configuration de l'environnement :
- Copier le fichier `.env.example` en `.env`
- Modifier les variables d'environnement selon votre configuration

3. Configuration de la base de données :
- Créer une base de données PostgreSQL nommée `community_pickup_market`
- Les tables seront créées automatiquement au démarrage (en mode développement)

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "customer" // or "producer"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

## Structure du projet

```
server/
├── src/
│   ├── controllers/    # Contrôleurs de l'API
│   ├── models/        # Modèles de données
│   ├── routes/        # Routes de l'API
│   ├── middleware/    # Middleware (auth, validation, etc.)
│   ├── config/        # Configuration
│   ├── utils/         # Utilitaires
│   └── index.ts       # Point d'entrée
├── package.json
└── tsconfig.json
``` 