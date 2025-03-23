import React, { useState } from 'react';
import { Box, Typography, IconButton, Card, CardMedia, Paper, Tooltip, Grid, Skeleton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const MovieCard = ({
  movie,
  hoveredMovie,
  setHoveredMovie,
  handlePlay,
  toggleMyList,
  isInMyList,
  formatDuration,
  setSelectedMovie,
  setIsDetailsOpen,
  uniqueId
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Function to get the best image format based on browser support
  const getOptimizedImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';
    
    // TMDB doesn't provide WebP/AVIF directly, we'd need a proxy service for conversion
    // For now, we'll use their optimized w500 size which is a good balance
    return `${TMDB_IMAGE_BASE_URL}/w500${path}`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Grid item xs={6} sm={4} md={3} lg={2.4} sx={{ aspectRatio: '2/3', minHeight: { xs: '180px', sm: '240px', md: '300px' } }}>
      <Card
        sx={{
          width: '100%',
          height: '96%',
          bgcolor: 'transparent',
          cursor: 'pointer',
          transition: 'transform 0.3s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            transform: 'scale(1.05)',
            zIndex: 2,
          },
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={() => setHoveredMovie(uniqueId)}
        onMouseLeave={() => setHoveredMovie(null)}
        onClick={() => {
          setSelectedMovie(movie);
          setIsDetailsOpen(true);
        }}
      >
        <Box sx={{ position: 'relative', flexGrow: 1, borderRadius: '8px', overflow: 'hidden' }}>
          {!imageLoaded && (
            <Skeleton 
              variant="rectangular" 
              animation="wave"
              sx={{ 
                width: '100%', 
                height: '100%', 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                position: 'absolute',
                top: 0,
                left: 0
              }} 
            />
          )}
          <CardMedia
            component="img"
            image={getOptimizedImageUrl(movie.poster_path)}
            alt={movie.title || movie.name}
            loading="lazy"
            onLoad={handleImageLoad}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              visibility: imageLoaded ? 'visible' : 'hidden'
            }}
          />
          {hoveredMovie === uniqueId && (
            <Paper
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: '#181818',
                p: { xs: 1, sm: 1.5, md: 2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '8px',
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ color: 'white', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, fontWeight: 'bold' }}>
                  {movie.title || movie.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 2, sm: 3 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    lineHeight: '1.2',
                  }}
                >
                  {movie.overview}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ color: '#46d369', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                    {Math.round((movie.vote_average || 0) * 10)}% Match
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                    • {formatDuration(movie.runtime || 120)}
                  </Typography>
                  {movie.release_date && (
                    <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                      • {new Date(movie.release_date).getFullYear()}
                    </Typography>
                  )}
                  {movie.first_air_date && (
                    <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                      • {new Date(movie.first_air_date).getFullYear()}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 1 }}>
                <Tooltip title="Play">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'white',
                      color: 'black',
                      padding: { xs: '4px', sm: '6px', md: '8px' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(movie);
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add to My List">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMyList(movie);
                    }}
                    sx={{
                      bgcolor: isInMyList(movie.id) ? '#E50914' : 'rgba(109, 109, 110, 0.7)',
                      color: 'white',
                      padding: { xs: '4px', sm: '6px', md: '8px' },
                      '&:hover': { 
                        bgcolor: isInMyList(movie.id) ? '#F40612' : 'rgba(109, 109, 110, 0.4)',
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More Info">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMovie(movie);
                      setIsDetailsOpen(true);
                    }}
                    sx={{
                      bgcolor: 'rgba(109, 109, 110, 0.7)',
                      color: 'white',
                      padding: { xs: '4px', sm: '6px', md: '8px' },
                      '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
                    }}
                  >
                    <ExpandMoreIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          )}
        </Box>
      </Card>
    </Grid>
  );
};

export default MovieCard; 