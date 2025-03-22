import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  return (
    <Box sx={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
      {featuredMovies.map((movie, index) => (
        <Box
          key={movie.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: index === currentFeaturedIndex ? 1 : 0,
            transform: `translateX(${(index - currentFeaturedIndex) * 100}%)`,
            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
          }}
        >
          <Box
            sx={{
              height: '100%',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
                zIndex: -1,
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: '20%',
                left: '5%',
                maxWidth: '50%',
                color: 'white',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
                transition: 'all 0.5s ease-in-out',
                textAlign: 'left',
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  transform: isTransitioning ? 'scale(0.9)' : 'scale(1)',
                  transition: 'transform 0.5s ease-in-out',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                }}
              >
                {movie.title}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  transform: isTransitioning ? 'scale(0.9)' : 'scale(1)',
                  transition: 'transform 0.5s ease-in-out',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                }}
              >
                {movie.overview}
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2,
                  transform: isTransitioning ? 'scale(0.9)' : 'scale(1)',
                  transition: 'transform 0.5s ease-in-out',
                }}
              >
                <Tooltip title="Play">
                  <IconButton
                    onClick={() => handlePlay(movie)}
                    sx={{
                      bgcolor: 'white',
                      color: 'black',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add to My List">
                  <IconButton
                    onClick={() => toggleMyList(movie)}
                    sx={{
                      bgcolor: isInMyList(movie.id) ? '#E50914' : 'rgba(109, 109, 110, 0.7)',
                      color: 'white',
                      '&:hover': { 
                        bgcolor: isInMyList(movie.id) ? '#F40612' : 'rgba(109, 109, 110, 0.4)',
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Like">
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(109, 109, 110, 0.7)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
                    }}
                  >
                    <ThumbUpIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More Info">
                  <IconButton
                    onClick={() => {
                      setSelectedMovie(movie);
                      setIsDetailsOpen(true);
                    }}
                    sx={{
                      bgcolor: 'rgba(109, 109, 110, 0.7)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
                    }}
                  >
                    <ExpandMoreIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {featuredMovies.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: index === currentFeaturedIndex ? '#E50914' : 'rgba(255,255,255,0.5)',
              transition: 'background-color 0.3s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: index === currentFeaturedIndex ? '#F40612' : 'rgba(255,255,255,0.7)',
              },
            }}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentFeaturedIndex(index);
                setIsTransitioning(false);
              }, 500);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedContent; 