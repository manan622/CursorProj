import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '60vh', sm: '70vh', md: '80vh' },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }
      }}
    >
      {featuredMovies.map((movie, index) => (
        <Box
          key={movie.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: currentIndex === index ? 1 : 0,
            transform: `scale(${currentIndex === index ? 1 : 1.1})`,
            transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
              zIndex: 1
            }
          }}
        >
          <Box
            component="img"
            src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
            alt={movie.title || movie.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.8)',
              transform: `scale(${currentIndex === index ? 1 : 1.1})`,
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>
      ))}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2, sm: 3, md: 4 },
          zIndex: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            opacity: 0,
            transform: 'translateY(20px)',
            animation: 'fadeInUp 0.8s ease-out forwards',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          {featuredMovies[currentIndex]?.title || featuredMovies[currentIndex]?.name}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: { xs: '100%', sm: '80%', md: '60%' },
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            lineHeight: 1.5,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            opacity: 0,
            transform: 'translateY(20px)',
            animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          {featuredMovies[currentIndex]?.overview}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
            opacity: 0,
            transform: 'translateY(20px)',
            animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => handlePlay(featuredMovies[currentIndex])}
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
              px: 3,
              py: 1,
              borderRadius: '4px',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Play
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => toggleMyList(featuredMovies[currentIndex])}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
              px: 3,
              py: 1,
              borderRadius: '4px',
              textTransform: 'none',
              fontSize: '1.1rem',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease'
            }}
          >
            My List
          </Button>
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={() => {
              setSelectedMovie(featuredMovies[currentIndex]);
              setIsDetailsOpen(true);
            }}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
              px: 3,
              py: 1,
              borderRadius: '4px',
              textTransform: 'none',
              fontSize: '1.1rem',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease'
            }}
          >
            More Info
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2
        }}
      >
        {featuredMovies.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              bgcolor: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
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