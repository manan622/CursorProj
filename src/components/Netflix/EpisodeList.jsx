import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fetchEpisodeNames } from '../../services/tmdbService';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const EpisodeList = ({ 
  showId, 
  onEpisodeSelect,
  handlePlay,
  formatDuration,
  movie,
  useAbsoluteNumbering = false,
  absoluteEpisodeMap = {},
  reverseEpisodeMap = {}
}) => {
  const [episodeData, setEpisodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  
  // Helper function to get absolute episode number
  const getAbsoluteEpisodeNumber = (seasonNum, episodeNum) => {
    if (!useAbsoluteNumbering || !absoluteEpisodeMap[seasonNum]) {
      return episodeNum;
    }
    return absoluteEpisodeMap[seasonNum][episodeNum] || episodeNum;
  };

  useEffect(() => {
    const loadEpisodes = async () => {
      if (!showId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchEpisodeNames(showId);
        setEpisodeData(data);
      } catch (err) {
        console.error('Error loading episodes:', err);
        setError('Failed to load episode data');
      } finally {
        setLoading(false);
      }
    };
    
    loadEpisodes();
  }, [showId]);

  const handleSeasonChange = (event, newValue) => {
    setSelectedSeason(newValue);
  };

  const handleEpisodeClick = (seasonNumber, episodeNumber) => {
    // Only notify the parent component about the selection change
    // Don't play the video automatically
    if (onEpisodeSelect) {
      onEpisodeSelect(seasonNumber, episodeNumber);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#E50914' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2, color: 'white', borderColor: 'white' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!episodeData || Object.keys(episodeData.seasons).length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">No episode data available</Typography>
      </Box>
    );
  }

  // Get available seasons
  const availableSeasons = Object.keys(episodeData.seasons).map(Number);

  return (
    <Box sx={{ width: '100%', bgcolor: '#181818', color: 'white', mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        {useAbsoluteNumbering ? (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              All Episodes (1-{Object.keys(reverseEpisodeMap).length})
            </Typography>
          </Box>
        ) : (
          <Tabs 
            value={selectedSeason} 
            onChange={handleSeasonChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ 
              '& .MuiTabs-indicator': { 
                backgroundColor: '#E50914',
              },
              '& .MuiTab-root': { 
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
            }}
          >
            {availableSeasons.map(season => {
              let label = `Season ${season}`;
              
              return (
                <Tab 
                  key={season} 
                  label={label}
                  value={season} 
                  sx={{ 
                    fontWeight: selectedSeason === season ? 'bold' : 'normal',
                  }}
                />
              );
            })}
          </Tabs>
        )}
      </Box>

      <Box sx={{ p: 2, overflowY: 'auto', maxHeight: '700px' }}>
        {!useAbsoluteNumbering && (
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            {episodeData.seasons[selectedSeason]?.seasonName || `Season ${selectedSeason}`}
          </Typography>
        )}
        
        <List sx={{ width: '100%' }}>
          {useAbsoluteNumbering 
            ? (
              // When using absolute numbering, display episodes from all seasons
              Object.keys(reverseEpisodeMap)
                .map(Number)  // Convert strings to numbers
                .sort((a, b) => a - b)  // Sort numerically
                .map(num => {
                const { season, episode } = reverseEpisodeMap[num];
                const episodeInfo = episodeData?.seasons[season]?.episodes[episode - 1];
                
                if (!episodeInfo) return null;
                
                return (
                  <Card 
                    key={`absolute-${num}`}
                    sx={{ 
                      mb: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      transition: 'transform 0.2s, background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'scale(1.01)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '180px' } }}>
                        <CardMedia
                          component="img"
                          image={episodeInfo.stillPath 
                            ? `${TMDB_IMAGE_BASE_URL}/w300${episodeInfo.stillPath}` 
                            : 'https://via.placeholder.com/300x169?text=No+Image'
                          }
                          alt={episodeInfo.name}
                          sx={{ 
                            height: '100px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleEpisodeClick(season, episode)}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            '&:hover': {
                              opacity: 1,
                              bgcolor: 'rgba(0,0,0,0.5)',
                            },
                          }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<PlayArrowIcon />}
                            onClick={(e) => {
                              // Prevent event propagation to avoid triggering the parent's onClick
                              e.stopPropagation();
                              
                              // First select the episode (without playing)
                              handleEpisodeClick(season, episode);
                              
                              // Then trigger playback if handlePlay is provided
                              if (handlePlay && movie) {
                                if (useAbsoluteNumbering) {
                                  handlePlay({
                                    ...movie,
                                    absoluteEpisodeNumber: num
                                  });
                                } else {
                                  handlePlay({
                                    ...movie,
                                    currentEpisode: episode,
                                    currentSeason: season,
                                    absoluteEpisodeNumber: null
                                  });
                                }
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
                        </Box>
                      </Box>
                      
                      <CardContent 
                        sx={{ 
                          flex: '1 1 auto', 
                          p: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                          }
                        }}
                        onClick={() => handleEpisodeClick(season, episode)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="h3">
                            {`${num}. ${episodeInfo.name} (S${season}E${episode})`}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="body2">
                              {formatDuration ? formatDuration(episodeInfo.runtime) : `${episodeInfo.runtime} min`}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            color: 'rgba(255,255,255,0.7)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1
                          }}
                        >
                          {episodeInfo.overview || "No description available."}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={`Season ${season}`} 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(229, 9, 20, 0.2)', 
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: '0.7rem'
                            }}
                          />
                          
                          {episodeInfo.airDate && (
                            <Chip 
                              label={new Date(episodeInfo.airDate).toLocaleDateString()} 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.1)', 
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Box>
                  </Card>
                );
              })
            ) 
            : (
              // Regular season-based episode display (current behavior)
              episodeData.seasons[selectedSeason]?.episodes.map((episode) => (
                <Card 
                  key={episode.id}
                  sx={{ 
                    mb: 2,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    transition: 'transform 0.2s, background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'scale(1.01)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ position: 'relative', width: { xs: '100%', sm: '180px' } }}>
                      <CardMedia
                        component="img"
                        image={episode.stillPath 
                          ? `${TMDB_IMAGE_BASE_URL}/w300${episode.stillPath}` 
                          : 'https://via.placeholder.com/300x169?text=No+Image'
                        }
                        alt={episode.name}
                        sx={{ 
                          height: '100px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleEpisodeClick(selectedSeason, episode.episodeNumber)}
                      />
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '&:hover': {
                            opacity: 1,
                            bgcolor: 'rgba(0,0,0,0.5)',
                          },
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          onClick={(e) => {
                            // Prevent event propagation to avoid triggering the parent's onClick
                            e.stopPropagation();
                            
                            // First select the episode (without playing)
                            handleEpisodeClick(selectedSeason, episode.episodeNumber);
                            
                            // Then trigger playback if handlePlay is provided
                            if (handlePlay && movie) {
                              if (useAbsoluteNumbering) {
                                handlePlay({
                                  ...movie,
                                  absoluteEpisodeNumber: getAbsoluteEpisodeNumber(selectedSeason, episode.episodeNumber)
                                });
                              } else {
                                handlePlay({
                                  ...movie,
                                  currentEpisode: episode.episodeNumber,
                                  currentSeason: selectedSeason,
                                  absoluteEpisodeNumber: null
                                });
                              }
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
                      </Box>
                    </Box>
                    
                    <CardContent 
                      sx={{ 
                        flex: '1 1 auto', 
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        }
                      }}
                      onClick={() => handleEpisodeClick(selectedSeason, episode.episodeNumber)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {episode.episodeNumber}. {episode.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">
                            {formatDuration ? formatDuration(episode.runtime) : `${episode.runtime} min`}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1
                        }}
                      >
                        {episode.overview || "No description available."}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {useAbsoluteNumbering && getAbsoluteEpisodeNumber(selectedSeason, episode.episodeNumber) && (
                          <Chip 
                            label={`Absolute #${getAbsoluteEpisodeNumber(selectedSeason, episode.episodeNumber)}`} 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(229, 9, 20, 0.2)', 
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                        
                        {episode.airDate && (
                          <Chip 
                            label={new Date(episode.airDate).toLocaleDateString()} 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.1)', 
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              ))
            )
          }
        </List>
      </Box>
    </Box>
  );
};

export default EpisodeList; 