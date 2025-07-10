import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(user ? [
      { to: '/add-recipe', label: 'Add Recipe' },
    ] : []),
    ...(!user ? [
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ] : [])
  ];

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      <AppBar
        position="fixed"
        color="default"
        elevation={2}
        sx={{
          background: '#181c24',
          borderRadius: '0 0 18px 18px',
          boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.18)',
          zIndex: 1201,
          borderBottom: '2px solid #22304a',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              display: { sm: 'none' },
              color: '#fff',
              fontSize: 34,
              '&:hover': { color: '#64b5f6' },
            }}
            onClick={() => setDrawerOpen(prev => !prev)}
          >
            <MenuIcon sx={{ fontSize: 34 }} />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: '#fff', fontWeight: 900, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1, fontSize: 26 }}
          >
            <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: 6, display: 'flex', alignItems: 'center', marginRight: 10 }}>
              <img src="/logo.png" alt="Stoveside logo" style={{ height: 32, display: 'block' }} />
            </div>
            Stoveside
            <span style={{ display: 'block', fontWeight: 400, fontSize: 13, color: '#b0c4de', marginLeft: 6, marginTop: 2, letterSpacing: 0.5 }}>Flavor starts here</span>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            {navLinks.map((link) => (
              <motion.div
                key={link.to}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <Button
                  component={Link}
                  to={link.to}
                  color="inherit"
                  sx={{
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: 0.7,
                    px: 2.5,
                    borderRadius: 2,
                    position: 'relative',
                    background: 'none',
                    color: '#fff',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#64b5f6', background: 'rgba(25, 118, 210, 0.10)' },
                  }}
                >
                  {link.label}
                  <motion.span
                    layoutId="nav-underline"
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 2,
                      height: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
                      opacity: 0.8,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    animate={{
                      opacity: window.location.pathname === link.to ? 1 : 0,
                      scaleX: window.location.pathname === link.to ? 1 : 0.2,
                    }}
                  />
                </Button>
              </motion.div>
            ))}
            {user && (
              <Tooltip title={user.username} arrow>
                <Avatar sx={{ bgcolor: 'secondary.main', mx: 1, fontWeight: 700, boxShadow: 3, border: '2px solid #fff', width: 44, height: 44, fontSize: 22 }}>
                  {user.username[0]?.toUpperCase()}
                </Avatar>
              </Tooltip>
            )}
            {user && (
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleLogout} color="warning" variant="contained" sx={{ fontWeight: 800, borderRadius: 3, ml: 1, px: 3, py: 1.2, fontSize: 17, boxShadow: 2, letterSpacing: 0.7 }}>
                  LOGOUT
                </Button>
              </motion.div>
            )}
          </Box>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ display: { sm: 'none' }, '& .MuiDrawer-paper': {
              background: '#181c24',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.18)',
              borderRight: '2px solid #22304a',
            }}}
          >
            <Box sx={{ width: 220 }} role="presentation">
              <List>
                {navLinks.map((link) => (
                  <ListItem key={link.to} disablePadding>
                    <ListItemButton component={Link} to={link.to} onClick={() => setDrawerOpen(false)} sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                      '&:hover': { color: '#64b5f6', background: 'rgba(25, 118, 210, 0.10)' },
                    }}>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
                {user && (
                  <ListItem disablePadding>
                    <ListItemButton sx={{ color: '#fff' }} onClick={() => setDrawerOpen(false)}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 1, fontWeight: 700 }}>
                        {user.username[0]?.toUpperCase()}
                      </Avatar>
                      <ListItemText primary={user.username} />
                    </ListItemButton>
                  </ListItem>
                )}
                {user && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { setDrawerOpen(false); handleLogout(); }} sx={{ color: '#fff', fontWeight: 700, '&:hover': { color: '#64b5f6', background: 'rgba(25, 118, 210, 0.10)' } }}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navigation; 