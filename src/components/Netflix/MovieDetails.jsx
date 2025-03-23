import React, { useState, useEffect, useMemo } from 'react';
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
  DialogContent,
  Switch,
  FormControlLabel,
  Tooltip
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
import EpisodeList from './EpisodeList';

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
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [useAbsoluteNumbering, setUseAbsoluteNumbering] = useState(false);

  // Calculate absolute episode number mapping
  const absoluteEpisodeMap = useMemo(() => {
    if (!seasonDetails) return {};
    
    const map = {};
    let absoluteCounter = 1;
    
    // Generate a mapping from [season, episode] to absolute number
    for (let s = 0; s < seasonDetails.length; s++) {
      const season = seasonDetails[s];
      if (!season || !season.episodes) continue;
      
      map[s + 1] = {};
      for (let e = 0; e < season.episodes.length; e++) {
        map[s + 1][e + 1] = absoluteCounter;
        absoluteCounter++;
      }
    }
    
    return map;
  }, [seasonDetails]);
  
  // Reverse mapping: from absolute to [season, episode]
  const reverseEpisodeMap = useMemo(() => {
    if (!seasonDetails) return {};
    
    const map = {};
    let absoluteCounter = 1;
    
    // Generate a mapping from absolute number to [season, episode]
    for (let s = 0; s < seasonDetails.length; s++) {
      const season = seasonDetails[s];
      if (!season || !season.episodes) continue;
      
      for (let e = 0; e < season.episodes.length; e++) {
        map[absoluteCounter] = {
          season: s + 1,
          episode: e + 1
        };
        absoluteCounter++;
      }
    }
    
    return map;
  }, [seasonDetails]);

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

  const handleAbsoluteEpisodeChange = (absoluteNumber) => {
    // Only update the season and episode selection without playing
    const { season, episode } = reverseEpisodeMap[absoluteNumber];
    setSelectedSeason(season);
    setSelectedEpisode(episode);
    
    // Don't call handlePlay here, as that would open the player
    console.log(`Selected episode changed to S${season}E${episode} (Absolute #${absoluteNumber})`);
  };
  
  const handleEpisodeSelect = (seasonNumber, episodeNumber) => {
    // Only update the season and episode selection without playing
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(episodeNumber);
    
    // Don't call handlePlay here, as that would open the player
    const absoluteNumber = useAbsoluteNumbering && absoluteEpisodeMap[seasonNumber]?.[episodeNumber];
    if (absoluteNumber) {
      console.log(`Selected episode changed to S${seasonNumber}E${episodeNumber} (Absolute #${absoluteNumber})`);
    } else {
      console.log(`Selected episode changed to S${seasonNumber}E${episodeNumber}`);
    }
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
                  onClick={() => {
                    if (movie.mediaType === 'tv') {
                      if (useAbsoluteNumbering && absoluteEpisodeMap[selectedSeason]?.[selectedEpisode]) {
                        // Using absolute numbering mode
                        handlePlay({
                          ...movie,
                          absoluteEpisodeNumber: absoluteEpisodeMap[selectedSeason][selectedEpisode],
                          // Keep track of these for when we switch back
                          currentSeason: selectedSeason,
                          currentEpisode: selectedEpisode
                        });
                      } else {
                        // Using regular season/episode numbering
                        handlePlay({
                          ...movie,
                          currentSeason: selectedSeason,
                          currentEpisode: selectedEpisode,
                          // Explicitly setting absoluteEpisodeNumber to null to ensure it's not used
                          absoluteEpisodeNumber: null
                        });
                      }
                    } else {
                      // For movies, just pass the movie object
                      handlePlay(movie);
                    }
                  }}
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
                
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, width: '100%' }}>
                  <Tooltip 
                    title="When enabled, episodes will be numbered absolutely across all seasons. This affects how episodes are displayed and will be used for playback when you click Play."
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useAbsoluteNumbering}
                          onChange={(e) => {
                            const newAbsoluteNumberingState = e.target.checked;
                            setUseAbsoluteNumbering(newAbsoluteNumberingState);
                            
                            // Update the current episode/season selection if needed
                            if (movie.mediaType === 'tv') {
                              // We don't want to call handlePlay here, as that would open the player
                              // Just update any internal state needed for when play is clicked later
                              if (newAbsoluteNumberingState) {
                                console.log("Switched to absolute numbering mode");
                              } else {
                                console.log("Switched to season-episode numbering mode");
                              }
                            }
                          }}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#E50914',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#E50914',
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem' }}>
                            Absolute Numbering
                          </Typography>
                          <InfoIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                        </Box>
                      }
                    />
                  </Tooltip>
                  <Chip 
                    label={useAbsoluteNumbering ? "Using Absolute Episode Numbering" : "Using Season-Episode Numbering"} 
                    size="small"
                    color={useAbsoluteNumbering ? "error" : "default"}
                    sx={{ ml: 2, fontSize: '0.7rem' }}
                  />
                </Box>
                
                {useAbsoluteNumbering ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontSize: '0.8rem' }}>
                      Showing episodes 1-{Object.keys(reverseEpisodeMap).length} across all seasons
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(229,9,20,0.8)', mb: 1, fontSize: '0.75rem', fontStyle: 'italic' }}>
                      Videos will use absolute episode numbers when you click Play
                    </Typography>
                    <Select
                      value={absoluteEpisodeMap[selectedSeason]?.[selectedEpisode] || 1}
                      onChange={(e) => handleAbsoluteEpisodeChange(e.target.value)}
                      sx={{ 
                        width: '280px',
                        height: '40px',
                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                        borderRadius: '8px',
                        '& .MuiSelect-select': {
                          color: 'white',
                          padding: '10px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.3)', 
                        },
                      }}
                    >
                      {Object.keys(reverseEpisodeMap).map((absoluteNum) => {
                        const num = parseInt(absoluteNum);
                        const { season, episode } = reverseEpisodeMap[num];
                        const episodeName = seasonDetails[season-1]?.episodes[episode-1]?.name || `Episode ${episode}`;
                        return (
                          <MenuItem 
                            key={num} 
                            value={num}
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '350px'
                            }}
                          >
                            {num}. S{season}E{episode}: {episodeName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        backgroundColor: useAbsoluteNumbering ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                        padding: useAbsoluteNumbering ? 1 : 0,
                        borderRadius: 1
                      }}>
                        <Select
                          value={selectedSeason}
                          onChange={(e) => setSelectedSeason(e.target.value)}
                          sx={{
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                            '.MuiSvgIcon-root': { color: 'white' },
                            mr: 1,
                            width: '120px',
                          }}
                        >
                          {Array.from({ length: totalSeasons }, (_, i) => (
                            <MenuItem key={i} value={String(i + 1)}>
                              Season {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                        <Select
                          value={selectedEpisode}
                          onChange={(e) => setSelectedEpisode(e.target.value)}
                          sx={{
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                            '.MuiSvgIcon-root': { color: 'white' },
                            width: '150px',
                          }}
                        >
                          {seasonDetails[selectedSeason - 1]?.episodes && Array.from({ length: seasonDetails[selectedSeason - 1].episodes.length }, (_, i) => (
                            <MenuItem key={i} value={String(i + 1)}>
                              Episode {i + 1} 
                              {useAbsoluteNumbering && absoluteEpisodeMap[selectedSeason]?.[i + 1] && 
                                ` (Abs #${absoluteEpisodeMap[selectedSeason][i + 1]})`
                              }
                            </MenuItem>
                          ))}
                        </Select>
                        {useAbsoluteNumbering && (
                          <Chip 
                            label="Using Absolute Numbering" 
                            size="small"
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowEpisodeList(!showEpisodeList)}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {showEpisodeList ? 'Hide Episodes' : 'Browse Episodes'}
                  </Button>
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

              {/* Episode List */}
              {showEpisodeList && (
                <Box sx={{ mt: 3 }}>
                  <EpisodeList 
                    showId={movie.id}
                    onEpisodeSelect={handleEpisodeSelect}
                    handlePlay={handlePlay}
                    formatDuration={formatDuration}
                    movie={movie}
                    useAbsoluteNumbering={useAbsoluteNumbering}
                    absoluteEpisodeMap={absoluteEpisodeMap}
                    reverseEpisodeMap={reverseEpisodeMap}
                  />
                </Box>
              )}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          sx={{ 
            bgcolor: '#181818', 
            color: 'white',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          Show Details
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#181818', color: 'white', pt: 2 }}>
          {showDetails && (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>Total Episodes: {showDetails.number_of_episodes}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>Total Seasons: {showDetails.number_of_seasons}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Episodes in Season {selectedSeason}: {seasonDetails[selectedSeason - 1]?.episodes.length || 0}
              </Typography>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Currently Selected:
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Season {selectedSeason}
                </Typography>
                <Typography variant="body1" sx={{ color: '#E50914', fontWeight: 'bold' }}>
                  Episode {selectedEpisode}: {
                    seasonDetails && 
                    seasonDetails[selectedSeason - 1]?.episodes[selectedEpisode - 1]?.name || 
                    `Episode ${selectedEpisode}`
                  }
                </Typography>
                {useAbsoluteNumbering && (
                  <Typography variant="body1" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                    Absolute Episode Number: {absoluteEpisodeMap[selectedSeason]?.[selectedEpisode] || '?'}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieDetails; 