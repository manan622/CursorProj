import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
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
    <Box 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 }, 
        pb: 6, 
        pt: 2,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white', 
            mb: { xs: 2, md: 3 }, 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            pl: { xs: 1, sm: 2 }
          }}
        >
          Search Results
        </Typography>
        <Grid 
          container 
          spacing={{ xs: 1, sm: 1.5, md: 2 }} 
          sx={{ 
            width: '100%',
            margin: 0
          }}
        >
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
      </Container>
    </Box>
  );
};

export default SearchResults; 