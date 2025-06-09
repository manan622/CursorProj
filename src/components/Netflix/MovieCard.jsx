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
  isSearchPage
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
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
    const currentTime = new Date().getTime();
    
    if (isAndroid) {
      if (currentTime - lastClickTime < 300) {
        // Double click detected, navigate to movie page
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
        navigate(`/movie/${movie.id}`, { state: { movie: formattedMovie } });
      } else {
        // Single click, toggle details
        setIsPressed(!isPressed);
      }
      setLastClickTime(currentTime);
      return;
    }

    // Non-Android behavior remains the same
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
    <Grid item 
      {...(!isSearchPage ? {
        xs: isAndroid ? 6 : 6,
        sm: 4,
        md: 3,
        lg: 2.4
      } : {})}
      sx={{ 
        aspectRatio: '2/3',
        ...(isSearchPage ? {
          width: '100%',
          height: '100%'
        } : {
          width: { 
            xs: isAndroid ? '160px' : '140px', 
            sm: '180px', 
            md: '200px', 
            lg: '240px' 
          },
          maxWidth: { 
            xs: isAndroid ? '160px' : '140px', 
            sm: '180px', 
            md: '200px', 
            lg: '240px' 
          },
          minWidth: { 
            xs: isAndroid ? '160px' : '140px', 
            sm: '180px', 
            md: '200px', 
            lg: '240px' 
          }
        })
      }}
    >
      <Card
        sx={{
          margin: isSearchPage ? 0 : { xs: isAndroid ? '3px' : '2px', sm: '4px', md: '6px' },
          width: '100%',
          height: '100%',
          bgcolor: 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            transform: isAndroid ? 'none' : 'scale(1.05)',
            zIndex: 2,
            '& .MuiCardMedia-root': {
              transform: isAndroid ? 'none' : 'scale(1.1)',
            }
          },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: '8px', sm: '10px', md: '12px' },
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
            borderRadius: 'inherit',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover::after': {
            opacity: isAndroid ? 0 : 1,
          }
        }}
        onMouseEnter={() => !isAndroid && setHoveredMovie(uniqueId)}
        onMouseLeave={() => !isAndroid && setHoveredMovie(null)}
        onClick={handleClick}
      >
        <Box sx={{ position: 'relative', flexGrow: 1, borderRadius: 'inherit', overflow: 'hidden' }}>
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
                borderRadius: 'inherit'
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
          {(hoveredMovie === uniqueId || (isAndroid && isPressed)) && (
            <Paper
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(24, 24, 24, 0.85)',
                backdropFilter: 'blur(5px)',
                p: { xs: 1, sm: 1.5, md: 2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 'inherit',
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
                  borderRadius: 'inherit',
                  zIndex: -1
                }
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ 
                  color: 'white', 
                  mb: 0.5, 
                  fontSize: { 
                    xs: '0.7rem',
                    sm: '0.8rem',
                    md: '0.9rem',
                    lg: '1rem'
                  }, 
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {movie.title || movie.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 2, sm: 3, md: 4 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: { 
                      xs: '0.6rem',
                      sm: '0.65rem',
                      md: '0.7rem',
                      lg: '0.75rem'
                    },
                    lineHeight: '1.4',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {movie.overview}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 0.5, sm: 1 }, 
                  flexWrap: 'wrap',
                  mb: 1
                }}>
                  <Typography variant="body2" sx={{ 
                    fontSize: { 
                      xs: '0.6rem',
                      sm: '0.65rem',
                      md: '0.7rem',
                      lg: '0.75rem'
                    },
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    {Math.round((movie.vote_average || 0) * 10)}% Match
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontSize: { 
                      xs: '0.6rem',
                      sm: '0.65rem',
                      md: '0.7rem',
                      lg: '0.75rem'
                    },
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    • {formatDuration(movie.runtime || movie.episode_run_time?.[0] || 120)}
                  </Typography>
                  {(movie.release_date || movie.first_air_date) && (
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: { 
                        xs: '0.6rem',
                        sm: '0.65rem',
                        md: '0.7rem',
                        lg: '0.75rem'
                      },
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                    }}>
                      • {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 0.5, sm: 1 }, 
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
                      padding: { 
                        xs: isAndroid ? '8px' : '4px', 
                        sm: '6px', 
                        md: '8px' 
                      },
                      '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '& .MuiSvgIcon-root': {
                        fontSize: { 
                          xs: isAndroid ? '1.2rem' : '0.8rem',
                          sm: '0.9rem',
                          md: '1rem',
                          lg: '1.25rem'
                        }
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
                      bgcolor: 'transparent',
                      color: isInMyList(movie.id) ? '#E50914' : 'white',
                      padding: { 
                        xs: isAndroid ? '8px' : '4px', 
                        sm: '6px', 
                        md: '8px' 
                      },
                      border: isInMyList(movie.id) 
                        ? '1px solid rgba(229, 9, 20, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': { 
                        bgcolor: isInMyList(movie.id) ? 'rgba(229, 9, 20, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.1)',
                        border: isInMyList(movie.id)
                          ? '1px solid rgba(229, 9, 20, 0.8)'
                          : '1px solid rgba(255, 255, 255, 0.4)'
                      },
                      '&:active': {
                        transform: 'scale(0.95)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '& .MuiSvgIcon-root': {
                        fontSize: { 
                          xs: isAndroid ? '1.2rem' : '0.8rem',
                          sm: '0.9rem',
                          md: '1rem',
                          lg: '1.25rem'
                        },
                        transform: isInMyList(movie.id) ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s ease-in-out'
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
                      padding: { 
                        xs: isAndroid ? '8px' : '4px', 
                        sm: '6px', 
                        md: '8px' 
                      },
                      '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '& .MuiSvgIcon-root': {
                        fontSize: { 
                          xs: isAndroid ? '1.2rem' : '0.8rem',
                          sm: '0.9rem',
                          md: '1rem',
                          lg: '1.25rem'
                        }
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