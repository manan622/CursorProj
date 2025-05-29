import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { motion, AnimatePresence } from 'framer-motion';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const FeaturedContent = ({
  featuredMovies,
  currentFeaturedIndex,
  setCurrentFeaturedIndex,
  handlePlay,
  toggleMyList,
  isInMyList,
  setSelectedMovie,
  setIsDetailsOpen
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');

  useEffect(() => {
    const video = document.getElementById('featured-video');
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isAndroid ? '60vh' : '70vh',
        overflow: 'hidden',
        background: `url(${TMDB_IMAGE_BASE_URL}/original${featuredMovies[currentFeaturedIndex]?.backdrop_path}) center/cover no-repeat`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        id="featured-video"
        src={featuredMovies[currentFeaturedIndex]?.videoUrl}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: isAndroid ? '1.5rem' : '4rem',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: isAndroid ? 1.5 : 3
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: isAndroid ? '1.5rem' : { xs: '2rem', sm: '3rem', md: '4rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            lineHeight: 1.2
          }}
        >
          {featuredMovies[currentFeaturedIndex]?.title || featuredMovies[currentFeaturedIndex]?.name}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: isAndroid ? '1.1rem' : { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            lineHeight: '1.5',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            maxWidth: {
              xs: '100%',
              sm: '100%',
              md: '50%'
            },
            transition: 'max-width 0.3s ease-in-out'
          }}
        >
          {featuredMovies[currentFeaturedIndex]?.overview}
        </Typography>

        <Box sx={{ display: 'flex', gap: isAndroid ? 1.5 : 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => handlePlay(featuredMovies[currentFeaturedIndex])}
            sx={{
              bgcolor: '#E50914',
              color: 'white',
              padding: isAndroid ? '8px 16px' : '8px 24px',
              fontSize: isAndroid ? '0.9rem' : '1rem',
              '&:hover': {
                bgcolor: '#f40612',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out',
              minWidth: isAndroid ? '120px' : '120px',
              height: isAndroid ? '36px' : '40px'
            }}
          >
            Play
          </Button>

          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={() => {
              setSelectedMovie(featuredMovies[currentFeaturedIndex]);
              setIsDetailsOpen(true);
            }}
            sx={{
              borderColor: 'white',
              color: 'white',
              padding: isAndroid ? '8px 16px' : '8px 24px',
              fontSize: isAndroid ? '0.9rem' : '1rem',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out',
              minWidth: isAndroid ? '120px' : '120px',
              height: isAndroid ? '36px' : '40px'
            }}
          >
            More Info
          </Button>
        </Box>
      </Box>

      <AnimatePresence>
        {(isHovered || isAndroid) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconButton
              onClick={handleVolumeToggle}
              sx={{
                position: 'absolute',
                top: isAndroid ? '0.75rem' : '2rem',
                right: isAndroid ? '0.75rem' : '2rem',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: isAndroid ? '8px' : '8px',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                },
                zIndex: 2,
                '& .MuiSvgIcon-root': {
                  fontSize: isAndroid ? '20px' : '24px'
                }
              }}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default FeaturedContent; 