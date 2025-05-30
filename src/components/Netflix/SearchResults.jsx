import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import MovieCard from './MovieCard';

// Critical CSS that should be inlined
const criticalStyles = {
  searchResultsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    width: '100%',
    overflowX: 'hidden'
  },
  heading: {
    color: 'white',
    fontWeight: 'bold',
  }
};

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
  // Skip rendering if no results
  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  // Optimize rendering by chunking large result sets
  const renderOptimizedResults = () => {
    // If we have a small set, render all
    if (searchResults.length <= 50) {
      return searchResults.map((movie, index) => (
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
      ));
    }

    // For larger sets, render in chunks of 50
    return searchResults.slice(0, 50).map((movie, index) => (
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
    ));
  };

  return (
    <Box 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 }, 
        pb: 6, 
        pt: 2,
        ...criticalStyles.searchResultsContainer
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: { xs: 2, md: 3 }, 
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            pl: { xs: 1, sm: 2 },
            ...criticalStyles.heading
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
          {renderOptimizedResults()}
        </Grid>
      </Container>
    </Box>
  );
};

export default React.memo(SearchResults); 