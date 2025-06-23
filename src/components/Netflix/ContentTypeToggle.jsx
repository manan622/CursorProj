import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, useMediaQuery, useTheme, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import AppsIcon from '@mui/icons-material/Apps';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ContentTypeToggle = ({ contentType, handleContentTypeChange }) => {
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.5 
        }}
      >
        <Box
          sx={{ 
            position: 'fixed',
            bottom: isAndroid ? 20 : 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '8px',
              bgcolor: 'rgba(0, 0, 0, 0.85)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7)',
                transform: 'translateY(-2px)'
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
                  borderRadius: '18px !important',
                  margin: '0 4px',
                  padding: isAndroid ? '10px 16px' : '12px 20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: isAndroid ? '80px' : '100px',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(255, 107, 107, 0.1))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(229, 9, 20, 0.2)',
                    '&::before': {
                      opacity: 1
                    }
                  },
                  '&.Mui-selected': {
                    bgcolor: '#E50914',
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(229, 9, 20, 0.4)',
                    transform: 'translateY(-1px)',
                    '&:hover': {
                      bgcolor: '#F40612',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 25px rgba(229, 9, 20, 0.5)'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent)',
                      pointerEvents: 'none'
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
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                  gap: isMobile ? 0.5 : 1,
                  fontSize: isAndroid ? '0.75rem' : '0.875rem',
                  textTransform: 'none'
                }}
              >
                <AppsIcon sx={{ fontSize: isAndroid ? '1rem' : '1.2rem' }} />
                {!isMobile && 'All'}
                {isMobile && (
                  <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>All</span>
                )}
              </ToggleButton>
              
              <ToggleButton 
                value="movies" 
                aria-label="movies only"
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                  gap: isMobile ? 0.5 : 1,
                  fontSize: isAndroid ? '0.75rem' : '0.875rem',
                  textTransform: 'none'
                }}
              >
                <MovieIcon sx={{ fontSize: isAndroid ? '1rem' : '1.2rem' }} />
                {!isMobile && 'Movies'}
                {isMobile && (
                  <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>Movies</span>
                )}
              </ToggleButton>
              
              <ToggleButton 
                value="tv" 
                aria-label="tv shows only"
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                  gap: isMobile ? 0.5 : 1,
                  fontSize: isAndroid ? '0.75rem' : '0.875rem',
                  textTransform: 'none'
                }}
              >
                <TvIcon sx={{ fontSize: isAndroid ? '1rem' : '1.2rem' }} />
                {!isMobile && 'TV Shows'}
                {isMobile && (
                  <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>TV</span>
                )}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Trending indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
          >
            <Chip
              icon={<TrendingUpIcon />}
              label="Trending"
              size="small"
              sx={{
                ml: 2,
                bgcolor: 'rgba(255, 193, 7, 0.9)',
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '28px',
                '& .MuiChip-icon': {
                  fontSize: '1rem'
                },
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            />
          </motion.div>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContentTypeToggle;