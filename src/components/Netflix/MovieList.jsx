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
    <Box 
      sx={{ 
        px: 2, 
        mb: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: backdropPath ? 
            `linear-gradient(to bottom, rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0.7)), url(${TMDB_IMAGE_BASE_URL}/original${backdropPath})` : 
            'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          opacity: 0.3,
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: 'white',
          mb: 2,
          fontWeight: 'bold',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => handleScroll('left')}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.8)',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Box
          id={categoryId}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 1,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {filteredMovies.map((movie, movieIndex) => (
            <MovieCard
              key={`${movie.id}-${movieIndex}`}
              movie={movie}
              hoveredMovie={hoveredMovie}
              setHoveredMovie={setHoveredMovie}
              handlePlay={handlePlay}
              toggleMyList={toggleMyList}
              isInMyList={isInMyList}
              formatDuration={formatDuration}
              setSelectedMovie={setSelectedMovie}
              setIsDetailsOpen={setIsDetailsOpen}
              uniqueId={`${categoryId}-${movie.id}-${movieIndex}`}
            />
          ))}
        </Box>
        <IconButton
          onClick={() => handleScroll('right')}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.8)',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieList; 