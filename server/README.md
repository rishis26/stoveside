# StoveStory Backend

A Node.js/Express backend for the StoveStory recipe app, featuring MongoDB integration, JWT authentication, and robust recipe management APIs.

---

## Features
- 🔒 **User Authentication:** Register/login with JWT
- 🥘 **Recipe Management:** CRUD operations for recipes
- 🔍 **Search & Filter:** Find recipes by ingredient, cuisine, or text
- 👤 **User Authorization:** Only manage your own recipes
- 🗄️ **MongoDB Integration:** Store recipes and users securely
- ⚡ **API for Client:** Powers the StoveStory React frontend

---

## Tech Stack
- Node.js, Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

---

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` or `config.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stovestory
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```
3. Make sure MongoDB is running locally or update the URI for Atlas
4. (Optional) Seed the database with sample data:
   ```bash
   node seedData.js
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Recipes
- `GET /api/recipes` - Get all recipes (with optional query params)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe (protected)
- `PUT /api/recipes/:id` - Update recipe (protected)
- `DELETE /api/recipes/:id` - Delete recipe (protected)
- `GET /api/recipes/user/my-recipes` - Get user's recipes (protected)

#### Query Parameters
- `?ingredient=chicken` - Search by ingredient
- `?cuisine=Italian` - Filter by cuisine
- `?search=pasta` - Search in title, ingredients, or cuisine

---

## Sample Data
- The seed script creates a test user and 5 sample recipes from different cuisines.

---

## Integration
- Designed to work seamlessly with the StoveStory React client
- Supports offline/local storage for user recipes when not logged in

---

## License
MIT 