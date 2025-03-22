import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  IconButton, 
  CardMedia, 
  Button, 
  Chip, 
  Select, 
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import LanguageIcon from '@mui/icons-material/Language';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = 'da914409e3ab4f883504dc0dbf9d9917';

const MovieDetails = ({ 
  movie, 
  isOpen, 
  onClose,
  handlePlay,
  toggleMyList,
  isInMyList,
  formatDuration,
  setSelectedMovie,
  // For TV shows
  selectedSeason,
  setSelectedSeason,
  selectedEpisode,
  setSelectedEpisode,
  showDetails,
  totalSeasons,
  seasonDetails
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!movie) return;

      try {
        setLoadingRecommendations(true);
        const mediaType = movie.mediaType || 'movie';
        const response = await fetch(
          `${TMDB_BASE_URL}/${mediaType}/${movie.id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        
        const data = await response.json();
        setRecommendations(data.results.slice(0, 6));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [movie]);

  if (!movie) return null;

  const openInTMDB = () => {
    const mediaType = movie.mediaType || 'movie';
    window.open(`https://www.themoviedb.org/${mediaType}/${movie.id}`, '_blank');
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '600px',
            bgcolor: '#181818',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {movie.title}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ position: 'relative', mb: 3 }}>
            <CardMedia
              component="img"
              image={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
              alt={movie.title}
              sx={{
                height: '300px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
                borderRadius: '0 0 8px 8px',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handlePlay(movie)}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                  }}
                >
                  Play
                </Button>
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
                <IconButton
                  sx={{
                    bgcolor: 'rgba(109, 109, 110, 0.7)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
                  }}
                >
                  <ThumbUpIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<LanguageIcon />}
                  onClick={openInTMDB}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  View on TMDB
                </Button>
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {movie.overview}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#FFD700' }} />
              <Typography>{Math.round(movie.vote_average * 10)}% Match</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon />
              <Typography>{formatDuration(movie.runtime || 120)}</Typography>
            </Box>
            {movie.release_date && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon />
                <Typography>{new Date(movie.release_date).getFullYear()}</Typography>
              </Box>
            )}
            {movie.original_language && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon />
                <Typography>{movie.original_language.toUpperCase()}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {movie.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                }}
              />
            ))}
          </Box>

          {/* Season and Episode Selection */}
          {movie.mediaType === 'tv' && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                margin: '16px', 
                backdropFilter: 'blur(15px)', 
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Season and Episode:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Select
                      value={selectedSeason}
                      onChange={(e) => {
                        setSelectedSeason(e.target.value);
                        setSelectedEpisode('1'); // Reset episode selection when season changes
                      }}
                      sx={{ 
                        width: '125px',
                        height: '40px',
                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                        borderRadius: '8px',
                        '& .MuiSelect-select': {
                          color: 'white',
                          padding: '10px',
                        },
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.3)', 
                        },
                      }}
                    >
                      {Array.from({ length: totalSeasons }, (_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          Season {index + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Select
                      value={selectedEpisode}
                      onChange={(e) => setSelectedEpisode(e.target.value)}
                      sx={{ 
                        width: '125px',
                        height: '40px',
                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                        borderRadius: '8px',
                        '& .MuiSelect-select': {
                          color: 'white',
                          padding: '10px',
                        },
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.3)', 
                        },
                      }}
                    >
                      {seasonDetails && seasonDetails[selectedSeason - 1]?.episodes.map((episode, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          Episode {index + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>

                <IconButton 
                  onClick={() => setIsDetailsPopupOpen(true)} 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: '50%', 
                    width: '40px', 
                    height: '40px', 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <InfoIcon sx={{ color: 'white' }} />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Recommendations */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              More Like This
            </Typography>
            {loadingRecommendations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading recommendations...</Typography>
              </Box>
            ) : recommendations.length > 0 ? (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                  },
                },
              }}>
                {recommendations.map((recMovie) => (
                  <Box
                    key={recMovie.id}
                    sx={{
                      flex: '0 0 150px',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        zIndex: 2,
                      },
                    }}
                    onClick={() => {
                      setSelectedMovie(recMovie);
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={`${TMDB_IMAGE_BASE_URL}/w500${recMovie.poster_path}`}
                        alt={recMovie.title || recMovie.name}
                        sx={{
                          borderRadius: '4px',
                          aspectRatio: '2/3',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 1,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          borderRadius: '0 0 4px 4px',
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {recMovie.title || recMovie.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No recommendations available
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Show Details Popup */}
      <Dialog 
        open={isDetailsPopupOpen} 
        onClose={() => setIsDetailsPopupOpen(false)} 
        sx={{ backdropFilter: 'blur(10px)' }}
      >
        <DialogTitle sx={{ bgcolor: '#181818', color: 'white' }}>Show Details</DialogTitle>
        <DialogContent sx={{ bgcolor: '#181818', color: 'white' }}>
          {showDetails && (
            <>
              <Typography variant="body1">Total Episodes: {showDetails.number_of_episodes}</Typography>
              <Typography variant="body1">Total Seasons: {showDetails.number_of_seasons}</Typography>
              <Typography variant="body1">
                Episodes in Season {selectedSeason}: {seasonDetails[selectedSeason - 1]?.episodes.length || 0}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieDetails; 