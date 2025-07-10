const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// Get all recipes with optional filtering
const getRecipes = async (req, res) => {
  try {
    const { ingredient, cuisine, search } = req.query;
    let query = {};

    // Filter by ingredient
    if (ingredient) {
      query.ingredients = { $regex: ingredient, $options: 'i' };
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = cuisine;
    }

    // Search in title, ingredients, or cuisine
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get single recipe by ID
const getRecipe = async (req, res) => {
  console.log(`Incoming request for recipe ID: ${req.params.id}`);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid recipe ID format' });
  }
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create new recipe
const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, cuisine, instructions, imageURL, prepTime, cookTime, servings, difficulty } = req.body;

    const recipe = new Recipe({
      title,
      ingredients,
      cuisine,
      instructions,
      imageURL,
      prepTime,
      cookTime,
      servings,
      difficulty,
      createdBy: req.user._id
    });

    await recipe.save();
    await recipe.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    res.json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get user's recipes
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getUserRecipes
}; 