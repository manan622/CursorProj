import React from 'react';
import { Box, Typography, IconButton, Card, CardMedia, Paper, Tooltip, Grid } from '@mui/material';
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
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          flex: '0 0 auto',
          width: { xs: '120px', sm: '150px', md: '200px' },
          bgcolor: 'transparent',
          cursor: 'pointer',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            zIndex: 2,
          },
        }}
        onMouseEnter={() => setHoveredMovie(uniqueId)}
        onMouseLeave={() => setHoveredMovie(null)}
        onDoubleClick={() => {
          setSelectedMovie(movie);
          setIsDetailsOpen(true);
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
            alt={movie.title}
            sx={{
              borderRadius: '4px',
              aspectRatio: '2/3',
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
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  {movie.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {movie.overview}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ color: '#46d369' }}>
                    {Math.round(movie.vote_average * 10)}% Match
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    • {formatDuration(movie.runtime || 120)}
                  </Typography>
                  {movie.release_date && (
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      • {new Date(movie.release_date).getFullYear()}
                    </Typography>
                  )}
                  {movie.original_language && (
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      • {movie.original_language.toUpperCase()}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                <Tooltip title="Play">
                  <IconButton
                    sx={{
                      bgcolor: 'white',
                      color: 'black',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                    }}
                    onClick={() => handlePlay(movie)}
                  >
                    <PlayArrowIcon />
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
                    <AddIcon />
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
                    <ThumbUpIcon />
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
                    <ExpandMoreIcon />
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