import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';

const ContentTypeToggle = ({ contentType, handleContentTypeChange }) => {
  return (
    <Box
      sx={{ 
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '10px',
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        transition: 'transform 0.3s ease',
      }}
    >
      <ToggleButtonGroup
        value={contentType}
        exclusive
        onChange={handleContentTypeChange}
        aria-label="content toggle"
      >
        <ToggleButton 
          value="all" 
          aria-label="all content"
          sx={{
            color: contentType === 'all' ? 'white' : 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.3s ease',
          }}
        >
          All
        </ToggleButton>
        <ToggleButton 
          value="movies" 
          aria-label="movies only"
          sx={{
            color: contentType === 'movies' ? 'white' : 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.3s ease',
          }}
        >
          Movies
        </ToggleButton>
        <ToggleButton 
          value="tv" 
          aria-label="tv shows only"
          sx={{
            color: contentType === 'tv' ? 'white' : 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.3s ease',
          }}
        >
          TV Shows
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ContentTypeToggle; 