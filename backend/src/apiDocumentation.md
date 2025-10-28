# API Documentation - FoodDecider Backend

Base URL: `http://localhost:3000/api`

## 📋 Table des matières

1. [Authentication](#authentication)
2. [Suggestions](#suggestions)
3. [Preferences](#preferences)

---

## Authentication

### Register

Créer un nouveau compte utilisateur.

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  },
  "message": "User registered successfully"
}
```

---

### Login

Se connecter avec un compte existant.

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  },
  "message": "Login successful"
}
```

---

### Get Profile

Obtenir le profil de l'utilisateur connecté.

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "preferences": {
      "dietaryRestrictions": ["vegetarian"],
      "allergies": ["nuts"],
      "cuisinePreferences": ["italian", "asian"],
      "spiceLevel": 3
    }
  }
}
```

---

## Suggestions

### Generate Suggestions

Obtenir des suggestions de repas basées sur le questionnaire.

**Endpoint:** `POST /api/suggestions/generate`

**Headers (optional):**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "wantToCook": true,
  "timeAvailable": 30,
  "budget": "medium",
  "mealTime": "dinner",
  "dietaryRestrictions": ["vegetarian"]
}
```

**Parameters:**
- `wantToCook`: `boolean` - Veut cuisiner (true) ou commander (false)
- `timeAvailable`: `number` - Temps disponible en minutes (1-300)
- `budget`: `"low" | "medium" | "high"` - Budget
- `mealTime`: `"breakfast" | "lunch" | "dinner" | "snack"` - Moment du repas
- `dietaryRestrictions`: `string[]` - Restrictions alimentaires (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "1",
        "name": "Spaghetti Carbonara",
        "image": "https://...",
        "type": "recipe",
        "cookingTime": 25,
        "difficulty": "Easy",
        "rating": 4.5,
        "budget": "medium",
        "description": "Classic Italian pasta",
        "url": "https://..."
      }
    ],
    "filters": {
      "wantToCook": true,
      "timeAvailable": 30,
      "budget": "medium",
      "mealTime": "dinner"
    }
  },
  "message": "Suggestions generated successfully"
}
```

---

### Save to History

Sauvegarder un repas dans l'historique (nécessite authentification).

**Endpoint:** `POST /api/suggestions/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "mealType": "recipe",
  "mealId": "123",
  "mealName": "Spaghetti Carbonara",
  "mealImage": "https://...",
  "cookingTime": 25,
  "budget": "medium",
  "rating": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "mealType": "recipe",
    "mealId": "123",
    "mealName": "Spaghetti Carbonara",
    "mealImage": "https://...",
    "cookingTime": 25,
    "budget": "medium",
    "rating": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Meal saved to history"
}
```

---

### Get History

Récupérer l'historique des repas (nécessite authentification).

**Endpoint:** `GET /api/suggestions/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "mealType": "recipe",
      "mealId": "123",
      "mealName": "Spaghetti Carbonara",
      "mealImage": "https://...",
      "cookingTime": 25,
      "budget": "medium",
      "rating": 5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Preferences

Toutes les routes de préférences nécessitent l'authentification.

### Get Preferences

Obtenir les préférences de l'utilisateur.

**Endpoint:** `GET /api/preferences`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "dietaryRestrictions": ["vegetarian", "gluten-free"],
    "allergies": ["nuts", "dairy"],
    "cuisinePreferences": ["italian", "asian", "mexican"],
    "spiceLevel": 3,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Preferences

Créer ou mettre à jour les préférences.

**Endpoint:** `PUT /api/preferences`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "dietaryRestrictions": ["vegetarian"],
  "allergies": ["nuts"],
  "cuisinePreferences": ["italian", "asian"],
  "spiceLevel": 4
}
```

**Note:** Tous les champs sont optionnels. Seuls les champs fournis seront mis à jour.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "dietaryRestrictions": ["vegetarian"],
    "allergies": ["nuts"],
    "cuisinePreferences": ["italian", "asian"],
    "spiceLevel": 4,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Preferences updated successfully"
}
```

---

### Delete Preferences

Supprimer les préférences de l'utilisateur.

**Endpoint:** `DELETE /api/preferences`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences deleted successfully"
}
```

---

## Error Responses

Toutes les erreurs suivent ce format :

```json
{
  "success": false,
  "error": "Error message here",
  "details": [] // Optional, for validation errors
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid or missing token)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Error Example

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Suggestions
```bash
curl -X POST http://localhost:3000/api/suggestions/generate \
  -H "Content-Type: application/json" \
  -d '{"wantToCook":true,"timeAvailable":30,"budget":"medium","mealTime":"dinner"}'
```

### Get Profile (with auth)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```