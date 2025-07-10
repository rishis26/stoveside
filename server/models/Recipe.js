const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  ingredients: [{
    type: String,
    required: [true, 'At least one ingredient is required'],
    trim: true
  }],
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true,
    enum: ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'French', 'Japanese', 'Thai', 'Mediterranean', 'Other']
  },
  instructions: {
    type: String,
    required: [true, 'Cooking instructions are required'],
    trim: true
  },
  imageURL: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Recipe+Image'
  },
  prepTime: {
    type: Number,
    min: [1, 'Prep time must be at least 1 minute'],
    default: 30
  },
  cookTime: {
    type: Number,
    min: [1, 'Cook time must be at least 1 minute'],
    default: 45
  },
  servings: {
    type: Number,
    min: [1, 'Servings must be at least 1'],
    default: 4
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
recipeSchema.index({ title: 'text', ingredients: 'text', cuisine: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema); 