import React from 'react';
import { Box, Typography, IconButton, Grid, Card, CardMedia, useMediaQuery, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const MovieList = ({
  title,
  movies,
  categoryId,
  backdropPath,
  hoveredMovie,
  setHoveredMovie,
  handlePlay,
  toggleMyList,
  isInMyList,
  formatDuration,
  setSelectedMovie,
  setIsDetailsOpen,
  contentFilter = () => true
}) => {
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');
  const filteredMovies = movies.filter(contentFilter);

  if (filteredMovies.length === 0) {
    return null;
  }

  const handleScroll = (direction) => {
    const container = document.getElementById(categoryId);
    if (container) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ mb: 0 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 600,
            mb: 0,
            px: { xs: 2, sm: 3 },
            fontSize: isAndroid ? '1.2rem' : '1.5rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {title}
        </Typography>
      </motion.div>

      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => handleScroll('left')}
          sx={{
            position: 'absolute',
            left: isAndroid ? 4 : 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            zIndex: 2,
            width: isAndroid ? 32 : 40,
            height: isAndroid ? 32 : 40,
            '&:hover': {
              bgcolor: 'rgba(229, 9, 20, 0.9)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease-in-out',
            display: { xs: 'none', sm: 'flex' },
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: isAndroid ? 20 : 24 }} />
        </IconButton>

        <Box
          id={categoryId}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 2, sm: 3 },
            py: 1,
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '150px',
              background: 'linear-gradient(to right, transparent, rgba(20, 20, 20, 0.95))',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
            },
            '&:hover::after': {
              opacity: 1,
            }
          }}
        >
          <Grid 
            container 
            spacing={{ xs: 1, sm: 1.5, md: 1.5 }} 
            sx={{ 
              flexWrap: 'nowrap', 
              width: 'auto',
              '& > *': {
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  zIndex: 1
                }
              }
            }}
          >
            {filteredMovies.map((movie, index) => (
              <MovieCard
                key={`${categoryId}-${movie.id}-${index}`}
                movie={movie}
                hoveredMovie={hoveredMovie}
                setHoveredMovie={setHoveredMovie}
                handlePlay={handlePlay}
                toggleMyList={toggleMyList}
                isInMyList={isInMyList}
                formatDuration={formatDuration}
                setSelectedMovie={setSelectedMovie}
                setIsDetailsOpen={setIsDetailsOpen}
                uniqueId={`${categoryId}-${movie.id}-${index}`}
              />
            ))}
          </Grid>
        </Box>

        <IconButton
          onClick={() => handleScroll('right')}
          sx={{
            position: 'absolute',
            right: isAndroid ? 4 : 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            zIndex: 2,
            width: isAndroid ? 32 : 40,
            height: isAndroid ? 32 : 40,
            '&:hover': {
              bgcolor: 'rgba(229, 9, 20, 0.9)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease-in-out',
            display: { xs: 'none', sm: 'flex' },
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <ChevronRightIcon sx={{ fontSize: isAndroid ? 20 : 24 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieList; 