import React, { useState } from 'react';
import { Box, Typography, IconButton, Grid, useMediaQuery, useTheme, Button, Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MovieCard from './MovieCard';
import { motion, AnimatePresence } from 'framer-motion';

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
  contentFilter = () => true,
  onLoadMore
}) => {
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const filteredMovies = movies.filter(contentFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (onLoadMore) {
      onLoadMore(nextPage);
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Show different number of items based on screen size and expansion state
  const getVisibleMovies = () => {
    if (isExpanded) return filteredMovies;
    if (isMobile) return filteredMovies.slice(0, 6);
    return filteredMovies.slice(0, 12);
  };

  const visibleMovies = getVisibleMovies();
  const hasMoreMovies = filteredMovies.length > visibleMovies.length;

  return (
    <Box sx={{ 
      mb: { xs: 4, sm: 5, md: 6 },
      px: { xs: 2, sm: 3 }
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: { xs: 2, sm: 3 },
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #E50914, transparent)',
                  borderRadius: '2px'
                }
              }}
            >
              {title}
            </Typography>
            
            {/* Movie count chip */}
            <Chip
              label={`${filteredMovies.length} items`}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.75rem',
                height: '24px'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasMoreMovies && (
              <Button
                onClick={handleToggleExpanded}
                endIcon={
                  <ExpandMoreIcon 
                    sx={{ 
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                }
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {isExpanded ? 'Show Less' : 'Show All'}
              </Button>
            )}

            <Button
              onClick={handleLoadMore}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Load More
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Movies Container */}
      <Box sx={{ position: 'relative' }}>
        {/* Navigation Arrows - Desktop only */}
        {!isMobile && !isExpanded && (
          <>
            <IconButton
              onClick={() => handleScroll('left')}
              sx={{
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                zIndex: 2,
                width: 48,
                height: 48,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(229, 9, 20, 0.9)',
                  transform: 'translateY(-50%) scale(1.1)',
                  boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)'
                }
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 28 }} />
            </IconButton>

            <IconButton
              onClick={() => handleScroll('right')}
              sx={{
                position: 'absolute',
                right: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                zIndex: 2,
                width: 48,
                height: 48,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(229, 9, 20, 0.9)',
                  transform: 'translateY(-50%) scale(1.1)',
                  boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)'
                }
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </>
        )}

        {/* Movies Grid/Scroll Container */}
        <Box
          id={categoryId}
          sx={{
            ...(isExpanded ? {
              // Grid layout when expanded
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(150px, 1fr))',
                sm: 'repeat(auto-fill, minmax(180px, 1fr))',
                md: 'repeat(auto-fill, minmax(200px, 1fr))',
                lg: 'repeat(auto-fill, minmax(220px, 1fr))'
              },
              gap: { xs: 2, sm: 3 },
              py: 2
            } : {
              // Horizontal scroll layout when not expanded
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              gap: { xs: 2, sm: 3 },
              py: 2,
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            })
          }}
        >
          <AnimatePresence>
            {visibleMovies.map((movie, index) => (
              <motion.div
                key={`${categoryId}-${movie.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.3, 
                  delay: isExpanded ? index * 0.05 : 0 
                }}
                style={{
                  ...(isExpanded ? {} : {
                    flex: '0 0 auto',
                    width: isMobile ? '150px' : '220px'
                  })
                }}
              >
                <MovieCard
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
                  isFirstCard={index === 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        {/* Gradient fade effect for horizontal scroll */}
        {!isExpanded && (
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '100px',
              background: 'linear-gradient(to right, transparent, rgba(20, 20, 20, 0.95))',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MovieList;