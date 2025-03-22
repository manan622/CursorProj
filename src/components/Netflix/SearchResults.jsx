import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MovieCard from './MovieCard';

const SearchResults = ({
  searchResults,
  hoveredMovie,
  setHoveredMovie,
  handlePlay,
  toggleMyList,
  isInMyList,
  formatDuration,
  setSelectedMovie,
  setIsDetailsOpen
}) => {
  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  return (
    <Box sx={{ px: 2, mb: 2 }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
        Search Results
      </Typography>
      <Grid container spacing={2}>
        {searchResults.map((movie, index) => (
          <MovieCard
            key={`search-${movie.id}-${index}`}
            movie={movie}
            hoveredMovie={hoveredMovie}
            setHoveredMovie={setHoveredMovie}
            handlePlay={handlePlay}
            toggleMyList={toggleMyList}
            isInMyList={isInMyList}
            formatDuration={formatDuration}
            setSelectedMovie={setSelectedMovie}
            setIsDetailsOpen={setIsDetailsOpen}
            uniqueId={`search-${movie.id}-${index}`}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResults; 