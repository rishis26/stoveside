import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#ff9800' },
      background: {
        default: darkMode ? '#181c24' : '#f6f8fa',
        paper: darkMode ? '#23293a' : '#fff',
      },
      error: { main: '#e53935' },
      warning: { main: '#fbc02d' },
      info: { main: '#0288d1' },
      success: { main: '#43a047' },
    },
    typography: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      h1: { fontWeight: 900 },
      h2: { fontWeight: 900 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700, letterSpacing: 1 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background 0.5s, color 0.5s',
            background: darkMode ? '#181c24' : '#f6f8fa',
          },
        },
      },
    },
  }), [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <div className="App">
        <Navigation user={user} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/recipe/:id" element={<RecipeDetail user={user} />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
        </Routes>
      </main>
    </div>
    </ThemeProvider>
  );
}

export default App; 