import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import './Home.css';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import api, { mealDBAPI } from '../utils/api';

// TODO: This page now only shows user recipes from MongoDB (if logged in) or local storage (if not). Add Recipe button navigates to /add-recipe.

const Home = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [localRecipes, setLocalRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchRecipes(searchTerm, cuisineFilter);
    if (!localStorage.getItem('user')) {
      // Not logged in, load recipes from local storage
      const saved = localStorage.getItem('recipes');
      setLocalRecipes(saved ? JSON.parse(saved) : []);
    } else {
      // User is logged in, fetch their recipes
      fetchUserRecipes();
    }
  }, []);

  const fetchUserRecipes = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    try {
      setUserLoading(true);
      const res = await api.get('/recipes/user/my-recipes');
      setUserRecipes(res.data);
      setUserError(null);
    } catch (err) {
      setUserError('Failed to fetch your recipes');
      setUserRecipes([]);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await mealDBAPI.getCategories();
      // TheMealDB returns { categories: [ { strCategory: ... }, ... ] }
      const categoryNames = res.categories ? res.categories.map(cat => cat.strCategory) : [];
      setCategories(['All', ...categoryNames]);
    } catch (err) {
      setCategories(['All']);
      setError('Failed to fetch categories');
    }
  };

  const fetchRecipes = async (search = '', cuisine = '') => {
    try {
      setLoading(true);
      let data;
      if (search && search.trim() !== '') {
        data = await mealDBAPI.searchByName(search);
      } else if (cuisine && cuisine !== 'All') {
        data = await mealDBAPI.filterByCategory(cuisine);
      } else {
        data = await mealDBAPI.searchByName(''); // fetch all
      }
      setRecipes(data.meals || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecipes(searchTerm, cuisineFilter);
  };

  const handleCuisineChange = (event) => {
    const value = event.target.value;
    setCuisineFilter(value);
    fetchRecipes(searchTerm, value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCuisineFilter('All');
    fetchRecipes('', 'All');
  };

  if (userLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
        <CircularProgress size={48} thickness={5} color="primary" sx={{ mb: 3 }} />
      </div>
    );
  }

  return (
    <div className="home" style={{ background: '#181c24', minHeight: '100vh', color: 'white' }}>
      <div className="container" style={{ marginTop: 90 }}>
        {/* Premium Animated Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            minHeight: 340,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 32,
            marginBottom: 60,
            background: 'linear-gradient(120deg, #23293a 60%, #1976d2 100%)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
            position: 'relative',
            overflow: 'hidden',
            padding: '48px 24px',
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              color: 'white',
              fontWeight: 900,
              fontSize: '3.2rem',
              letterSpacing: 1.5,
              marginBottom: 18,
              textAlign: 'center',
              textShadow: '0 4px 24px rgba(25, 118, 210, 0.18)',
            }}
          >
            Stoveside
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{
              color: 'white',
              opacity: 0.97,
              fontWeight: 500,
              fontSize: '1.5rem',
              marginBottom: 32,
              textAlign: 'center',
              maxWidth: 600,
            }}
          >
            Flavor starts here
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.08, background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: '#fff' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 28,
              padding: '18px 54px',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.18)',
              cursor: 'pointer',
              marginBottom: 8,
              letterSpacing: 2,
              outline: 'none',
              position: 'relative',
              zIndex: 2,
              textTransform: 'uppercase',
            }}
            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
          >
            EXPLORE RECIPES
          </motion.button>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80) center/cover no-repeat',
              opacity: 0.18,
              zIndex: 1,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="search-form" style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <TextField
              variant="outlined"
              placeholder="Search recipes by ingredient, title, or cuisine..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{
                width: 340,
                background: '#232b3a',
                borderRadius: 2,
                boxShadow: 2,
                input: {
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 500,
                  '::placeholder': { color: '#b0c4de', opacity: 1 },
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#22304a' },
                  '&:hover fieldset': { borderColor: '#64b5f6' },
                  '&.Mui-focused fieldset': { borderColor: '#64b5f6' },
                },
              }}
              InputProps={{ sx: { color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#b0c4de' } }}
            />
            <FormControl sx={{ minWidth: 120, background: '#232b3a', borderRadius: 2, boxShadow: 2 }}>
              <InputLabel id="cuisine-select-label" sx={{ color: '#b0c4de', '&.Mui-focused': { color: '#64b5f6' } }}>Cuisine</InputLabel>
              <Select
                labelId="cuisine-select-label"
                value={cuisineFilter || 'All'}
                label="Cuisine"
                onChange={handleCuisineChange}
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#fff',
                  '.MuiSelect-icon': { color: '#b0c4de' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#22304a' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64b5f6' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#64b5f6' },
                  background: 'transparent',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: '#232b3a',
                      color: '#fff',
                    },
                  },
                }}
              >
                {categories.map(cuisine => (
                  <MenuItem key={cuisine} value={cuisine} sx={{ color: '#fff', fontWeight: 600, fontSize: 17, '&:hover': { background: '#22304a' } }}>{cuisine}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{
              fontWeight: 900,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: 20,
              background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
              color: '#fff',
              boxShadow: 3,
              textTransform: 'uppercase',
              letterSpacing: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
                color: '#fff',
              },
            }}>
              Search
            </Button>
          </form>
        </motion.div>
        {(searchTerm || cuisineFilter) && (
          <button onClick={clearFilters} className="btn btn-secondary clear-btn">Clear Filters</button>
        )}
        {error && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            message={error}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            ContentProps={{ sx: { fontWeight: 600, fontSize: 18, bgcolor: 'error.main', color: 'white', borderRadius: 2 } }}
          />
        )}
        <div className="recipes-section">
          {/* Global Recipes Section */}
          <h2 style={{
            color: '#fff',
            fontWeight: 900,
            fontSize: 32,
            letterSpacing: 1,
            textAlign: 'center',
            margin: '2.5rem 0 1.5rem 0',
            textShadow: '0 2px 12px rgba(25, 118, 210, 0.18)'
          }}>
            Global Recipes ({recipes.length})
          </h2>
          {recipes.length === 0 ? (
            <div className="no-recipes">
              <p>No recipes found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {recipes.map(recipe => (
                <Grid item xs={12} sm={6} md={4} key={recipe.idMeal} display="flex" justifyContent="center">
                  <RecipeCard recipe={{
                    _id: recipe.idMeal,
                    title: recipe.strMeal,
                    cuisine: recipe.strCategory,
                    imageURL: recipe.strMealThumb,
                    prepTime: 30,
                    cookTime: 0,
                    servings: 2,
                    difficulty: 'Easy',
                    source: 'themealdb',
                  }} />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
        {isMobile && (
          <Fab
            color="secondary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 24,
              zIndex: 1200,
              boxShadow: 6,
            }}
            onClick={() => navigate('/add-recipe')}
          >
            <AddIcon />
          </Fab>
        )}
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 4, mb: 2, fontWeight: 700, borderRadius: 2, px: 4, py: 1.5, fontSize: 18 }}
          onClick={() => navigate('/add-recipe')}
        >
          Add Recipe
        </Button>
      </div>
    </div>
  );
};

export default Home; 