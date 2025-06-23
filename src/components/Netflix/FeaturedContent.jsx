import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, useMediaQuery, useTheme, Chip, Rating } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const video = document.getElementById('featured-video');
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const currentMovie = featuredMovies[currentFeaturedIndex];

  if (!currentMovie) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '70vh', sm: '75vh', md: '80vh', lg: '85vh' },
        overflow: 'hidden',
        borderRadius: { xs: '0px', sm: '16px' },
        margin: { xs: 0, sm: '0 16px' },
        background: `linear-gradient(
          rgba(0,0,0,0.4) 0%, 
          rgba(0,0,0,0.2) 40%, 
          rgba(0,0,0,0.8) 100%
        ), url(${TMDB_IMAGE_BASE_URL}/original${currentMovie.backdrop_path}) center/cover no-repeat`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(20,20,20,0.9) 100%)',
          zIndex: 1
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Video */}
      <video
        id="featured-video"
        src={currentMovie.videoUrl}
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
          left: 0,
          opacity: 0.7
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {/* Movie Info Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Chip
            label={currentMovie.mediaType === 'tv' ? 'TV Series' : 'Movie'}
            sx={{
              bgcolor: 'rgba(229, 9, 20, 0.9)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }}
          />
          {currentMovie.vote_average && (
            <Chip
              icon={<Rating value={1} max={1} size="small" sx={{ color: '#FFD700' }} />}
              label={`${Math.round(currentMovie.vote_average * 10)}% Match`}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            />
          )}
          {currentMovie.release_date && (
            <Chip
              label={new Date(currentMovie.release_date).getFullYear()}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            />
          )}
        </Box>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
              lineHeight: 1.1,
              mb: 2,
              maxWidth: { xs: '100%', md: '70%' },
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {currentMovie.title || currentMovie.name}
          </Typography>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              lineHeight: 1.6,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              maxWidth: { xs: '100%', sm: '80%', md: '60%', lg: '50%' },
              display: '-webkit-box',
              WebkitLineClamp: { xs: 3, sm: 4 },
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 3
            }}
          >
            {currentMovie.overview}
          </Typography>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 2, sm: 3 }, 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => handlePlay(currentMovie)}
              sx={{
                bgcolor: 'white',
                color: 'black',
                padding: { xs: '12px 24px', sm: '16px 32px' },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4)'
                },
                minWidth: { xs: '140px', sm: '160px' }
              }}
            >
              Play
            </Button>

            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={() => {
                setSelectedMovie(currentMovie);
                setIsDetailsOpen(true);
              }}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.7)',
                color: 'white',
                padding: { xs: '12px 24px', sm: '16px 32px' },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'none',
                borderWidth: '2px',
                backdropFilter: 'blur(10px)',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)'
                },
                minWidth: { xs: '140px', sm: '160px' }
              }}
            >
              More Info
            </Button>

            {/* Additional Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => toggleMyList(currentMovie)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: isInMyList(currentMovie.id) ? '#E50914' : 'white',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'scale(1.1)',
                    border: '2px solid rgba(255, 255, 255, 0.6)'
                  }
                }}
              >
                <AddIcon sx={{ 
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  transform: isInMyList(currentMovie.id) ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.3s ease'
                }} />
              </IconButton>

              <IconButton
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'scale(1.1)',
                    border: '2px solid rgba(255, 255, 255, 0.6)'
                  }
                }}
              >
                <ThumbUpIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Volume Control */}
      <AnimatePresence>
        {(isHovered || isAndroid) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <IconButton
              onClick={handleVolumeToggle}
              sx={{
                position: 'absolute',
                top: { xs: 16, sm: 24 },
                right: { xs: 16, sm: 24 },
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                  transform: 'scale(1.1)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                },
                zIndex: 3
              }}
            >
              {isMuted ? 
                <VolumeOffIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : 
                <VolumeUpIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              }
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          display: 'flex',
          gap: 1,
          zIndex: 3
        }}
      >
        {featuredMovies.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentFeaturedIndex(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: index === currentFeaturedIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.2)'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedContent;