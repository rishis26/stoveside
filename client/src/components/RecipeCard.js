import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';

const fallbackImage = "https://via.placeholder.com/300x180?text=No+Image";

const RecipeCard = ({ recipe }) => {
  const { _id, title, cuisine, imageURL, prepTime, cookTime, servings, difficulty } = recipe;
  const [imgSrc, setImgSrc] = useState(imageURL || fallbackImage);
  const [shareTooltip, setShareTooltip] = useState(false);

  const handleShare = async () => {
    // Always share the same link as the 'View Source' link
    const sourceUrl = recipe.strSource || recipe.strYoutube;
    const url = sourceUrl || `${window.location.origin}/recipe/${recipe._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, url });
      } catch (e) {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareTooltip(sourceUrl ? 'Source link copied!' : 'Link copied!');
      setTimeout(() => setShareTooltip(false), 1200);
    } else {
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.22)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: 'spring' }}
      style={{ borderRadius: 24 }}
    >
      <Card
        sx={{
          maxWidth: 390,
          m: 2,
          borderRadius: 5,
          background: '#fff',
          boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
          fontFamily: 'Montserrat, Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
        elevation={0}
      >
        <Box sx={{ height: 210, position: 'relative', overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <motion.img
            src={imgSrc}
            alt={title}
            height={210}
            width="100%"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            onError={() => setImgSrc(fallbackImage)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {/* Gradient overlay */}
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(25,118,210,0.04) 60%,rgba(100,181,246,0.10) 100%)', zIndex: 1 }} />
          {/* Animated badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{ position: 'absolute', top: 18, left: 18, zIndex: 2 }}
          >
            <Box sx={{ bgcolor: '#1976d2', color: 'white', px: 2.2, py: 0.7, borderRadius: 3, fontWeight: 800, fontSize: 15, letterSpacing: 0.7, boxShadow: 2, textTransform: 'uppercase' }}>
              {cuisine}
            </Box>
          </motion.div>
        </Box>
        <CardContent sx={{ pb: 1 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 900, textAlign: 'center', fontSize: 23, mb: 1, letterSpacing: 0.5, color: '#1976d2', textShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              ⏱️ {prepTime + cookTime} min
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              👥 {servings} servings
            </Typography>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ display: 'inline-block' }}
            >
              <Box sx={{ bgcolor: difficulty === 'Easy' ? '#d4edda' : difficulty === 'Medium' ? '#fff3cd' : '#f8d7da', color: difficulty === 'Easy' ? '#155724' : difficulty === 'Medium' ? '#856404' : '#721c24', px: 1.7, py: 0.6, borderRadius: 2, fontWeight: 800, fontSize: 14, ml: 1, letterSpacing: 0.5, boxShadow: 1, textTransform: 'uppercase' }}>
                {difficulty}
              </Box>
            </motion.div>
          </Box>
        </CardContent>
        <CardActions sx={{ flexDirection: 'column', alignItems: 'center', px: 2, pb: 2, pt: 0 }}>
          <motion.div
            whileHover={{ scale: 1.04, boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.18)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{ width: '100%' }}
          >
            <Button
              component={Link}
              to={`/recipe/${_id}`}
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                borderRadius: 3,
                fontWeight: 900,
                fontSize: 22,
                px: 4,
                py: 2.2,
                boxShadow: 3,
                mb: 1.5,
                letterSpacing: 1,
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
                color: 'white',
                transition: 'background 0.2s, box-shadow 0.2s',
                '&:hover': { background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)' },
              }}
            >
              VIEW RECIPE
            </Button>
          </motion.div>
          {/* Floating share button */}
          {recipe.strSource || recipe.strYoutube && (
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 400 }}
              style={{ position: 'absolute', top: 12, right: 16, zIndex: 3 }}
            >
              <Tooltip title={shareTooltip || 'Share'} arrow open={!!shareTooltip} onClose={() => setShareTooltip(false)}>
                <IconButton aria-label="share" onClick={handleShare} sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'primary.light' } }}>
                  <ShareIcon color="primary" />
                </IconButton>
              </Tooltip>
            </motion.div>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default RecipeCard; 