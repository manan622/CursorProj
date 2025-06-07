import React, { useState } from 'react';
import { Box, Typography, IconButton, Card, CardMedia, Paper, Tooltip, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

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
  uniqueId,
  isFullscreen
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');

  // Function to get the best image format based on browser support
  const getOptimizedImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';
    return `${TMDB_IMAGE_BASE_URL}/w500${path}`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleClick = () => {
    // Format the movie data before navigation
    const formattedMovie = {
      ...movie,
      id: movie.id,
      title: movie.title || movie.name,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      releaseDate: movie.release_date || movie.first_air_date,
      rating: Math.round((movie.vote_average || 0) * 10) / 10,
      duration: formatDuration(movie.runtime || movie.episode_run_time?.[0] || 120),
      genres: movie.genre_ids ? movie.genre_ids.map(id => ({ id, name: getGenreName(id) })) : [],
      mediaType: movie.mediaType || (movie.first_air_date ? 'tv' : 'movie'),
      totalSeasons: movie.number_of_seasons || 1,
      totalEpisodes: movie.number_of_episodes || 1
    };

    // Navigate to the movie details page with the formatted data
    navigate(`/movie/${movie.id}`, { state: { movie: formattedMovie } });
  };

  // Helper function to get genre name from ID
  const getGenreName = (genreId) => {
    const genres = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };
    return genres[genreId] || 'Unknown';
  };

  return (
    <Grid item xs={isAndroid ? 6 : 6} sm={4} md={3} lg={2.4} sx={{ 
      aspectRatio: '2/3', 
      minHeight: isAndroid ? '20px' : { xs: '180px', sm: '240px', md: '300px' },
      width: isAndroid ? '100%' : 'auto',
      maxWidth: isAndroid ? '100%' : 'none'
    }}>
      <Card
        sx={{
          margin: '10px',
          width:isAndroid ?'100%':'228px',
          height:isAndroid ?'100%' : '99%',
          bgcolor: 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            transform: 'scale(1.05)',
            zIndex: 2,
            '& .MuiCardMedia-root': {
              transform: 'scale(1.1)',
            }
          },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover::after': {
            opacity: 1,
          }
        }}
        onMouseEnter={() => setHoveredMovie(uniqueId)}
        onMouseLeave={() => setHoveredMovie(null)}
        onClick={handleClick}
      >
        <Box sx={{ position: 'relative', flexGrow: 1, borderRadius: '12px', overflow: 'hidden' }}>
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
                left: 0,
                borderRadius: '12px'
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
              visibility: imageLoaded ? 'visible' : 'hidden',
              transition: 'transform 0.3s ease-in-out',
              aspectRatio: '2/3'
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
                bgcolor: 'rgba(24, 24, 24, 0.85)',
                backdropFilter: 'blur(5px)',
                p: isAndroid ? 2 : { xs: 1, sm: 1.5, md: 2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
                  borderRadius: '12px',
                  zIndex: -1
                }
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ 
                  color: 'white', 
                  mb: 0.5, 
                  fontSize: isAndroid ? '1.4rem' : { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, 
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  {movie.title || movie.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: isAndroid ? 4 : { xs: 2, sm: 3 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: isAndroid ? '1.1rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    lineHeight: '1.4',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {movie.overview}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: isAndroid ? 2 : 1, 
                  flexWrap: 'wrap',
                  mb: 1
                }}>
                  <Typography variant="body2" sx={{ 
                    color: '#46d369', 
                    fontSize: isAndroid ? '1.1rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    {Math.round((movie.vote_average || 0) * 10)}% Match
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontSize: isAndroid ? '1.1rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    • {formatDuration(movie.runtime || movie.episode_run_time?.[0] || 120)}
                  </Typography>
                  {movie.release_date && (
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: isAndroid ? '1.1rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                    }}>
                      • {new Date(movie.release_date).getFullYear()}
                    </Typography>
                  )}
                  {movie.first_air_date && (
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: isAndroid ? '1.1rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                    }}>
                      • {new Date(movie.first_air_date).getFullYear()}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                gap: isAndroid ? 2 : 1, 
                justifyContent: 'center',
                mt: 'auto',
                position: 'relative',
                zIndex: 3
              }}>
                <Tooltip title="Play">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(movie);
                    }}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      padding: isAndroid ? '12px' : { xs: '4px', sm: '6px', md: '8px' },
                      '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '& .MuiSvgIcon-root': {
                        fontSize: isAndroid ? '1.8rem' : { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                      }
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={isInMyList(movie.id) ? "Remove from My List" : "Add to My List"}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMyList(movie);
                    }}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      padding: isAndroid ? '12px' : { xs: '4px', sm: '6px', md: '8px' },
                      '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '& .MuiSvgIcon-root': {
                        fontSize: isAndroid ? '1.8rem' : { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                      }
                    }}
                  >
                    <AddIcon />
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
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      padding: isAndroid ? '12px' : { xs: '4px', sm: '6px', md: '8px' },
                      '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '& .MuiSvgIcon-root': {
                        fontSize: isAndroid ? '1.8rem' : { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                      }
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