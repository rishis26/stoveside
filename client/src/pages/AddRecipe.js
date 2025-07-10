import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !cuisine || !instructions || !ingredients) {
      setError('Please fill in all required fields.');
      return;
    }
    const recipe = {
      title,
      cuisine,
      imageURL,
      prepTime: Number(prepTime) || 0,
      cookTime: Number(cookTime) || 0,
      servings: Number(servings) || 1,
      difficulty,
      instructions,
      ingredients: ingredients.split('\n').map(i => i.trim()).filter(Boolean),
    };
    const user = localStorage.getItem('user');
    try {
      if (user) {
        await api.post('/recipes', recipe);
      } else {
        // Save to local storage
        const saved = localStorage.getItem('recipes');
        const arr = saved ? JSON.parse(saved) : [];
        arr.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(arr));
      }
      navigate('/');
    } catch (err) {
      setError('Failed to add recipe.');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>Add Recipe</Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Cuisine" value={cuisine} onChange={e => setCuisine(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Image URL" value={imageURL} onChange={e => setImageURL(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Prep Time (min)" value={prepTime} onChange={e => setPrepTime(e.target.value)} type="number" fullWidth sx={{ mb: 2 }} />
          <TextField label="Cook Time (min)" value={cookTime} onChange={e => setCookTime(e.target.value)} type="number" fullWidth sx={{ mb: 2 }} />
          <TextField label="Servings" value={servings} onChange={e => setServings(e.target.value)} type="number" fullWidth sx={{ mb: 2 }} />
          <TextField label="Difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Ingredients (one per line)" value={ingredients} onChange={e => setIngredients(e.target.value)} fullWidth required multiline minRows={3} sx={{ mb: 2 }} />
          <TextField label="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} fullWidth required multiline minRows={4} sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, fontWeight: 700, borderRadius: 2, px: 4, py: 1.5, fontSize: 18 }}>
            Add Recipe
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddRecipe; 