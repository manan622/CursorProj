import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import AppsIcon from '@mui/icons-material/Apps';

const ContentTypeToggle = ({ contentType, handleContentTypeChange }) => {
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box
        sx={{ 
          position: 'fixed',
          bottom: isAndroid ? 16 : 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backdropFilter: 'blur(10px)',
          borderRadius: isAndroid ? '16px' : '20px',
          padding: isAndroid ? '8px' : '10px',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.6)',
          }
        }}
      >
        <ToggleButtonGroup
          value={contentType}
          exclusive
          onChange={handleContentTypeChange}
          aria-label="content toggle"
          sx={{
            '& .MuiToggleButtonGroup-grouped': {
              border: 'none',
              borderRadius: isAndroid ? '12px' : '16px !important',
              margin: isAndroid ? '0 2px' : '0 4px',
              padding: isAndroid ? '6px 12px' : '8px 16px',
              color: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
              '&.Mui-selected': {
                bgcolor: '#E50914',
                color: 'white',
                '&:hover': {
                  bgcolor: '#F40612',
                }
              }
            }
          }}
        >
          <ToggleButton 
            value="all" 
            aria-label="all content"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: isAndroid ? '0.875rem' : '1rem',
            }}
          >
            <AppsIcon sx={{ fontSize: isAndroid ? '1.1rem' : '1.25rem' }} />
            All
          </ToggleButton>
          <ToggleButton 
            value="movies" 
            aria-label="movies only"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: isAndroid ? '0.875rem' : '1rem',
            }}
          >
            <MovieIcon sx={{ fontSize: isAndroid ? '1.1rem' : '1.25rem' }} />
            Movies
          </ToggleButton>
          <ToggleButton 
            value="tv" 
            aria-label="tv shows only"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: isAndroid ? '0.875rem' : '1rem',
            }}
          >
            <TvIcon sx={{ fontSize: isAndroid ? '1.1rem' : '1.25rem' }} />
            TV Shows
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </motion.div>
  );
};

export default ContentTypeToggle; 