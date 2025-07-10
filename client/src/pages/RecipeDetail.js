import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mealDBAPI } from '../utils/api';
import './RecipeDetail.css';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import axios from 'axios';

function getIngredients(recipe) {
  if (!recipe) return [];
  if (recipe.ingredients) return recipe.ingredients; // user/local recipes
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${ingredient}${measure ? ` - ${measure}` : ''}`);
    }
  }
  return ingredients;
}

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch from TheMealDB (global recipe)
        const res = await fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        } else {
          // Try to fetch from backend API
          try {
            const apiRes = await axios.get(`${process.env.REACT_APP_API_URL}/recipes/${id}`);
            console.log('Backend API Response:', apiRes.data);
            setRecipe(apiRes.data);
          } catch (apiErr) {
            console.error('Backend API Error:', apiErr.response?.data || apiErr.message);
            // Try to fetch from local storage (user/local recipe)
            const local = localStorage.getItem('recipes');
            if (local) {
              const arr = JSON.parse(local);
              const found = arr.find(r => r._id === id || r.id === id);
              if (found) {
                setRecipe(found);
                setLoading(false);
                return;
              }
            }
            setError(apiErr.response?.data?.message || 'Recipe not found');
          }
        }
      } catch (err) {
        setError('Recipe not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleToggle = (index) => {
    setChecked((prev) =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="container">
        <div className="error-page">
          <h2>Recipe Not Found</h2>
          <p>{error || 'The recipe you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')} variant="contained" color="primary" sx={{ mt: 2 }}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(recipe);
  // Improved step splitting for instructions
  let steps = [];
  if (/\d+\./.test(recipe.strInstructions)) {
    // Split on numbers followed by a period and space (e.g., '1. ')
    steps = recipe.strInstructions.split(/\s*\d+\.\s+/).map(s => s.trim()).filter(Boolean);
  } else if (/STEP ?\d+/i.test(recipe.strInstructions)) {
    steps = recipe.strInstructions.split(/STEP ?\d+[:\s]*/i).map(s => s.trim()).filter(Boolean);
  } else {
    // Split on period + space + capital letter (for natural sentences)
    steps = recipe.strInstructions.split(/\. (?=[A-Z])/).map(s => s.trim()).filter(Boolean);
  }

  return (
    <div style={{ background: '#181c24', minHeight: '100vh', color: '#fff', paddingTop: 90 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#232b3a', borderRadius: 24, boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.18)', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="recipe-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: '100%', maxWidth: 400, borderRadius: 24, boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.18)' }} />
          <Typography variant="h3" sx={{ fontWeight: 900, mt: 2, mb: 1, textAlign: 'center', color: '#fff' }}>{recipe.strMeal}</Typography>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="cuisine-badge" style={{ background: '#1976d2', color: '#fff', borderRadius: 8, padding: '4px 16px', fontWeight: 700 }}>{recipe.strCategory}</span>
            <span style={{ color: '#b0c4de', fontWeight: 600 }}>{recipe.strArea}</span>
          </div>
          <div className="recipe-author" style={{ marginTop: 8 }}>
            {recipe.strSource || recipe.strYoutube ? (
              <a href={recipe.strSource || recipe.strYoutube} target="_blank" rel="noopener noreferrer" style={{ color: '#ffb74d', fontWeight: 700, textDecoration: 'underline' }}>
                {recipe.strSource ? 'View Source' : 'Watch on YouTube'}
              </a>
            ) : null}
          </div>
        </div>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mt: 5, mb: 5 }}>
          <Paper elevation={2} sx={{ flex: 1, p: 3, borderRadius: 4, mb: { xs: 3, md: 0 }, background: theme.palette.mode === 'dark' ? 'rgba(40,44,60,0.85)' : 'rgba(255,255,255,0.7)', boxShadow: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, borderBottom: '2px solid', borderColor: 'primary.main', display: 'inline-block' }}>
              Ingredients
            </Typography>
            <List>
              {ingredients.map((ingredient, idx) => (
                <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                  <Checkbox
                    checked={checked.includes(idx)}
                    onChange={() => handleToggle(idx)}
                    sx={{ color: theme.palette.secondary.main }}
                  />
                  <ListItemText primary={ingredient} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper elevation={2} sx={{ flex: 2, p: 3, borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(40,44,60,0.85)' : 'rgba(255,255,255,0.7)', boxShadow: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, borderBottom: '2px solid', borderColor: 'secondary.main', display: 'inline-block' }}>
              Instructions
            </Typography>
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                style={{ marginBottom: 24 }}
              >
                <Paper elevation={1} sx={{ p: 2, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'rgba(40,44,60,0.95)' : 'rgba(255,255,255,0.95)', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main', mb: 1 }}>
                    Step {idx + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {step}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Paper>
        </Box>
        <div className="recipe-footer" style={{ textAlign: 'center', marginTop: 32 }}>
          <Button onClick={() => navigate('/')} variant="contained" color="secondary" size="large" sx={{ fontWeight: 700, borderRadius: 3 }}>
            Back to Recipes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail; 