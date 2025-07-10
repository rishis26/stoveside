const express = require('express');
const router = express.Router();
const { 
  getRecipes, 
  getRecipe, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe, 
  getUserRecipes 
} = require('../controllers/recipeController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getRecipes);

// Protected routes
router.post('/', auth, createRecipe);

// User recipes route (specific route before parameterized routes)
router.get('/user/my-recipes', auth, getUserRecipes);

// Parameterized routes (must come last)
router.get('/:id', getRecipe);
router.put('/:id', auth, updateRecipe);
router.delete('/:id', auth, deleteRecipe);

module.exports = router; 