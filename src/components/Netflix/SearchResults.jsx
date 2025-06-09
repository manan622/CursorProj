import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid, Container, Chip, Stack, CircularProgress, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import MovieCard from './MovieCard';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SortIcon from '@mui/icons-material/Sort';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');

  const filteredAndSortedResults = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return [];

    let filtered = searchResults;
    
    // Apply media type filter
    if (filter !== 'all') {
      filtered = searchResults.filter(item => item.mediaType === filter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 'date':
          return new Date(b.release_date || b.first_air_date || 0) - 
                 new Date(a.release_date || a.first_air_date || 0);
        case 'popularity':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });
  }, [searchResults, filter, sortBy]);

  if (!searchResults || searchResults.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh',
          color: 'white',
          textAlign: 'center',
          px: { xs: 2, sm: 3 }
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>No results found</Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.7)">
          Try adjusting your search or filters to find what you're looking for
        </Typography>
      </Box>
    );
  }

  const movieCount = searchResults.filter(item => item.mediaType === 'movie').length;
  const tvCount = searchResults.filter(item => item.mediaType === 'tv').length;

  return (
    <Box 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 }, 
        pb: 6, 
        pt: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              pl: { xs: 1, sm: 2 },
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Search Results ({filteredAndSortedResults.length})
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ 
              mb: 3,
              px: { xs: 1, sm: 2 }
            }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                icon={<MovieIcon />}
                label={`Movies (${movieCount})`}
                onClick={() => setFilter(filter === 'movie' ? 'all' : 'movie')}
                sx={{
                  bgcolor: filter === 'movie' ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': { bgcolor: filter === 'movie' ? 'primary.dark' : 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <Chip
                icon={<TvIcon />}
                label={`TV Shows (${tvCount})`}
                onClick={() => setFilter(filter === 'tv' ? 'all' : 'tv')}
                sx={{
                  bgcolor: filter === 'tv' ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': { bgcolor: filter === 'tv' ? 'primary.dark' : 'rgba(255, 255, 255, 0.2)' }
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Tooltip title="Sort by Popularity">
                <Chip
                  icon={<TrendingUpIcon />}
                  label="Trending"
                  onClick={() => setSortBy('popularity')}
                  sx={{
                    bgcolor: sortBy === 'popularity' ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': { bgcolor: sortBy === 'popularity' ? 'primary.dark' : 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Tooltip>
              <Tooltip title="Sort by Rating">
                <Chip
                  icon={<StarIcon />}
                  label="Top Rated"
                  onClick={() => setSortBy('rating')}
                  sx={{
                    bgcolor: sortBy === 'rating' ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': { bgcolor: sortBy === 'rating' ? 'primary.dark' : 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Tooltip>
              <Tooltip title="Sort by Release Date">
                <Chip
                  icon={<CalendarTodayIcon />}
                  label="Newest"
                  onClick={() => setSortBy('date')}
                  sx={{
                    bgcolor: sortBy === 'date' ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': { bgcolor: sortBy === 'date' ? 'primary.dark' : 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        <Grid 
          container 
          spacing={0}
          sx={{ 
            width: '100%',
            margin: 0,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(140px, 1fr))',
              sm: 'repeat(auto-fill, minmax(180px, 1fr))',
              md: 'repeat(auto-fill, minmax(200px, 1fr))',
              lg: 'repeat(auto-fill, minmax(240px, 1fr))'
            },
            gap: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 1, sm: 2 }
          }}
        >
          {filteredAndSortedResults.map((movie, index) => (
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
              isSearchPage={true}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default React.memo(SearchResults); 