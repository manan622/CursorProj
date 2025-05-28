import React from 'react';
import { Box, Typography, IconButton, Grid, Card, CardMedia } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieCard from './MovieCard';

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
    <Box sx={{ position: 'relative', mb: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        mb: 1.5,
        px: { xs: 1, sm: 2 },
        position: 'relative'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              width: '40px',
              height: '3px',
              background: '#E50914',
              borderRadius: '2px'
            }
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => handleScroll('left')}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            zIndex: 2,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease-in-out',
            display: { xs: 'none', sm: 'flex' },
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          id={categoryId}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 1, sm: 2 },
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
              width: '100px',
              background: 'linear-gradient(to right, transparent, rgba(20, 20, 20, 0.8))',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
            },
            '&:hover::after': {
              opacity: 1,
            }
          }}
        >
          <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ flexWrap: 'nowrap', width: 'auto' }}>
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
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            zIndex: 2,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease-in-out',
            display: { xs: 'none', sm: 'flex' },
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieList; 