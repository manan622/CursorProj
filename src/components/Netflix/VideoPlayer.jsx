import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, IconButton, Button, Box, CircularProgress, Typography, TextField, Tooltip, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { alpha } from '@mui/material/styles';

const VideoPlayer = ({ open, onClose, videoUrl, onApiPopupOpen, onNextEpisode, showNextButton = false, onPlayEpisode, currentSeason, currentEpisode, seasonDetails = [], totalSeasons = 0, totalEpisodes = 0 }) => {
  const [videoKey, setVideoKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [episodeInput, setEpisodeInput] = useState('');
  const [seasonInput, setSeasonInput] = useState('');
  const [useAbsoluteNumbering, setUseAbsoluteNumbering] = useState(false);
  const [displayAbsoluteNumber, setDisplayAbsoluteNumber] = useState('#');
  const iframeRef = useRef(null);
  
  // Memoize iframe attributes to prevent unnecessary re-renders
  const iframeAttrs = useMemo(() => ({
    title: "Embedded Video",
    frameBorder: "0",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true,
    loading: "lazy",
    referrerPolicy: "no-referrer",
    // Hardware acceleration attributes for better performance
    webkitallowfullscreen: true,
    mozallowfullscreen: true,
    style: {
      position: 'relative',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none',
    }
  }), []);

  // Handle iframe loading state
  const handleIframeLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Reset loading state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setIsLoading(true);
    }
  }, [open]);
  
  // Update the videoKey only when videoUrl changes AND the dialog is open
  useEffect(() => {
    if (open && videoUrl) {
      console.log("Video URL changed and dialog is open:", videoUrl);
      
      // Extract just the base info to detect if it's a different show/episode
      let urlInfo = '';
      
      try {
        // Check if we're changing episode number format (absolute vs regular)
        if (videoUrl.includes('/tv/')) {
          // For TV shows, extract just the show ID and episode info
          const tvMatch = videoUrl.match(/\/tv\/(\d+).*$/);
          if (tvMatch) {
            urlInfo = tvMatch[0];
          }
        } else if (videoUrl.includes('/movie/')) {
          // For movies, extract just the movie ID
          const movieMatch = videoUrl.match(/\/movie\/(\d+).*$/);
          if (movieMatch) {
            urlInfo = movieMatch[0];
          }
        }
      } catch (error) {
        console.error("Error parsing URL for key:", error);
      }
      
      // Append a timestamp to force iframe reload, including URL info to detect format changes
      setVideoKey(`${urlInfo}-${Date.now()}`);
      
      // Always reset loading state when URL changes
      setIsLoading(true);
    }
  }, [videoUrl, open]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = '';
      }
    };
  }, []);

  // Parse and optimize the video URL for different formats
  const optimizedVideoUrl = useMemo(() => {
    if (!videoUrl) return '';
    
    try {
      // Check if it's using absolute numbering (indicated by "-abs-" in the URL)
      if (videoUrl.includes('-abs-')) {
        console.log("Using absolute episode numbering");
      }
      
      const url = new URL(videoUrl, window.location.origin);
      
      // Only add parameters if it's a known video platform
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // YouTube optimizations
        url.searchParams.set('rel', '0'); // No related videos
        url.searchParams.set('modestbranding', '1'); // Less branding
        url.searchParams.set('playsinline', '1'); // Better mobile experience
        url.searchParams.set('enablejsapi', '1'); // Enable JS API
        url.searchParams.set('origin', window.location.origin); // Security
      } else if (videoUrl.includes('vimeo.com')) {
        // Vimeo optimizations
        url.searchParams.set('dnt', '1'); // Do not track
        url.searchParams.set('app_id', 'netflix_clone'); // App identification
      }
      
      return url.toString();
    } catch (error) {
      console.error("Error parsing video URL:", error);
      return '';
    }
  }, [videoUrl]);

  // Calculate absolute episode number based on current season and episode
  const absoluteEpisodeNumber = useMemo(() => {
    if (!currentSeason || !currentEpisode || !seasonDetails.length) return '#';
    
    let absoluteNumber = 0;
    for (let s = 0; s < currentSeason - 1; s++) {
      absoluteNumber += seasonDetails[s]?.episodes?.length || 0;
    }
    return absoluteNumber + parseInt(currentEpisode);
  }, [currentSeason, currentEpisode, seasonDetails]);

  // Update display absolute number when inputs change
  useEffect(() => {
    if (useAbsoluteNumbering && episodeInput) {
      setDisplayAbsoluteNumber(episodeInput);
    } else if (!useAbsoluteNumbering && seasonInput && episodeInput) {
      let absoluteNumber = 0;
      for (let s = 0; s < parseInt(seasonInput) - 1; s++) {
        absoluteNumber += seasonDetails[s]?.episodes?.length || 0;
      }
      absoluteNumber += parseInt(episodeInput);
      setDisplayAbsoluteNumber(absoluteNumber.toString());
    } else {
      setDisplayAbsoluteNumber(absoluteEpisodeNumber);
    }
  }, [useAbsoluteNumbering, seasonInput, episodeInput, absoluteEpisodeNumber, seasonDetails]);

  // Store absolute numbering mode in localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem('useAbsoluteNumbering');
    if (storedMode !== null) {
      setUseAbsoluteNumbering(storedMode === 'true');
    }
  }, []);

  // Save absolute numbering mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('useAbsoluteNumbering', useAbsoluteNumbering.toString());
  }, [useAbsoluteNumbering]);

  // Load absolute numbering mode and refresh URL when dialog opens
  useEffect(() => {
    if (open) {
      const storedMode = localStorage.getItem('useAbsoluteNumbering');
      const isAbsoluteMode = storedMode === 'true';
      setUseAbsoluteNumbering(isAbsoluteMode);
      
      // If we have current episode info and the mode is absolute, refresh URL
      if (currentSeason && currentEpisode && isAbsoluteMode) {
        let absoluteNumber = 0;
        for (let s = 0; s < currentSeason - 1; s++) {
          absoluteNumber += seasonDetails[s]?.episodes?.length || 0;
        }
        absoluteNumber += parseInt(currentEpisode);
        
        // Call onPlayEpisode to refresh URL with absolute numbering
        onPlayEpisode(absoluteNumber, undefined, true);
      }
    }
  }, [open, currentSeason, currentEpisode, seasonDetails, onPlayEpisode]);

  // Handle episode play
  const handlePlayEpisode = () => {
    if (!onPlayEpisode || !episodeInput) return;
    
    if (useAbsoluteNumbering) {
      const absoluteNumber = parseInt(episodeInput);
      if (absoluteNumber > 0 && absoluteNumber <= totalEpisodes) {
        onPlayEpisode(absoluteNumber, undefined, true);
        setDisplayAbsoluteNumber(absoluteNumber.toString());
      }
    } else if (seasonInput && episodeInput) {
      const season = parseInt(seasonInput);
      const episode = parseInt(episodeInput);
      
      // Validate season and episode numbers
      if (season > 0 && season <= totalSeasons) {
        const seasonEpisodeCount = seasonDetails[season - 1]?.episodes?.length || 0;
        if (episode > 0 && episode <= seasonEpisodeCount) {
          onPlayEpisode(episode, season, false);
          // Calculate and display absolute number
          let absoluteNumber = 0;
          for (let s = 0; s < season - 1; s++) {
            absoluteNumber += seasonDetails[s]?.episodes?.length || 0;
          }
          setDisplayAbsoluteNumber((absoluteNumber + episode).toString());
        }
      }
    }
    
    // Reset input fields after playing
    setEpisodeInput('');
    setSeasonInput('');
  };

  // Update absolute episode number display when inputs change
  useEffect(() => {
    if (useAbsoluteNumbering && episodeInput) {
      setDisplayAbsoluteNumber(episodeInput);
    } else if (!useAbsoluteNumbering && seasonInput && episodeInput) {
      let absoluteNumber = 0;
      const season = parseInt(seasonInput);
      const episode = parseInt(episodeInput);
      
      if (season > 0 && season <= totalSeasons) {
        // Calculate absolute number based on previous seasons
        for (let s = 0; s < season - 1; s++) {
          absoluteNumber += seasonDetails[s]?.episodes?.length || 0;
        }
        // Add current episode number
        absoluteNumber += episode;
        setDisplayAbsoluteNumber(absoluteNumber.toString());
      }
    }
  }, [useAbsoluteNumbering, seasonInput, episodeInput, seasonDetails, totalSeasons]);

  // Handle input validation and constraints
  const handleEpisodeInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (useAbsoluteNumbering) {
      // In absolute mode, validate against total episodes
      if (!value || (parseInt(value) > 0 && parseInt(value) <= totalEpisodes)) {
        setEpisodeInput(value);
      }
    } else {
      // In regular mode, validate against current season's episodes
      const currentSeasonEpisodes = seasonDetails[parseInt(seasonInput) - 1]?.episodes?.length || 0;
      if (!value || (parseInt(value) > 0 && parseInt(value) <= currentSeasonEpisodes)) {
        setEpisodeInput(value);
      }
    }
  };

  const handleSeasonInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (!value || (parseInt(value) > 0 && parseInt(value) <= totalSeasons)) {
      setSeasonInput(value);
      // Reset episode input when season changes
      setEpisodeInput('');
    }
  };

  const handleAbsoluteNumberingToggle = (e) => {
    const newMode = e.target.checked;
    setUseAbsoluteNumbering(newMode);
    
    // Calculate absolute number for current episode
    let absoluteNumber = null;
    if (newMode) {
      let count = 0;
      for (let s = 0; s < currentSeason - 1; s++) {
        count += seasonDetails[s]?.episodes?.length || 0;
      }
      absoluteNumber = count + parseInt(currentEpisode);
    }
    
    // Call parent handler with current episode info and new mode
    onPlayEpisode(
      newMode ? absoluteNumber : parseInt(currentEpisode),
      newMode ? undefined : parseInt(currentSeason),
      newMode
    );
  };

  const handleNextEpisode = () => {
    if (!onNextEpisode) return;
    
    // Calculate absolute number for next episode if in absolute mode
    if (useAbsoluteNumbering) {
      let currentAbsoluteNumber = 0;
      for (let s = 0; s < currentSeason - 1; s++) {
        currentAbsoluteNumber += seasonDetails[s]?.episodes?.length || 0;
      }
      currentAbsoluteNumber += parseInt(currentEpisode);
      
      // Increment absolute number
      const nextAbsoluteNumber = currentAbsoluteNumber + 1;
      
      // If we've reached the end of all episodes, wrap back to episode 1
      if (nextAbsoluteNumber > totalEpisodes) {
        onPlayEpisode(1, undefined, true);
      } else {
        onPlayEpisode(nextAbsoluteNumber, undefined, true);
      }
    } else {
      onNextEpisode();
    }
  };

  // Handle dialog close
  const handleClose = () => {
    // Reset input fields only
    setEpisodeInput('');
    setSeasonInput('');
    // Call the original onClose handler
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: 'black',
          boxShadow: 'none',
          borderRadius: 0,
          '& .MuiDialog-paper': {
            bgcolor: 'black'
          }
        }
      }}
    >
      <Box
        sx={{ 
          position: 'relative', 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'black',
          '@media (max-width: 600px)': {
            // Adjust height to account for controls on mobile
            '& iframe': {
              height: 'calc(100% - 0px) !important'
            }
          }
        }}
      >
        {/* Video Container */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'black',
            '@media (max-width: 600px)': {
              marginBottom: '180px' // Space for controls
            },
            '& iframe': {
              width: '100%',
              height: '100%',
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0
            }
          }}
        >
          {videoUrl ? (
            <iframe
              src={videoUrl}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                gap: 2
              }}
            >
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                No video source available
              </Typography>
              <Button
                variant="contained"
                onClick={onApiPopupOpen}
                sx={{
                  bgcolor: '#E50914',
                  '&:hover': {
                    bgcolor: '#F40612'
                  }
                }}
              >
                Change API Source
              </Button>
            </Box>
          )}
        </Box>

        {/* Control Icons Container */}
        <Box sx={{
          position: 'absolute',
          '@media (max-width: 600px)': {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            padding: '20px 16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.9) 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            height: '180px',
            justifyContent: 'space-between'
          },
          '@media (min-width: 601px)': {
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
            zIndex: 10,
            padding: '8px',
            borderRadius: '16px',
            backgroundColor: 'rgba(64, 64, 64, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }
        }}>
          {/* Episode Controls Container */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '@media (max-width: 600px)': {
              width: '100%',
              justifyContent: 'center',
              marginBottom: '4px'
            }
          }}>
            {/* Episode Indicator */}
            {showNextButton && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '@media (max-width: 600px)': {
                  justifyContent: 'center'
                }
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(229, 9, 20, 0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: '1px solid rgba(229, 9, 20, 0.3)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    userSelect: 'none',
                    boxShadow: '0 4px 16px rgba(229, 9, 20, 0.2)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      padding: '4px',
                      fontSize: '1rem',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    {currentSeason ? `S${currentSeason}` : ''}<br />
                    {currentEpisode ? `E${currentEpisode}` : ''}
                  </Typography>
                </Box>

                {/* Absolute Episode Number Indicator */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(229, 9, 20, 0.1)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: '1px solid rgba(229, 9, 20, 0.2)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    userSelect: 'none',
                    boxShadow: '0 4px 16px rgba(229, 9, 20, 0.1)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      padding: '4px',
                      fontSize: '1rem',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    ABS<br />
                    {displayAbsoluteNumber}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Navigation Controls Container */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '@media (max-width: 600px)': {
              width: '100%',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2
            }
          }}>
            {/* Next Episode Button */}
            {showNextButton && onNextEpisode && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(64, 64, 64, 0.3)',
                borderRadius: '12px',
                padding: '8px 12px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                '@media (max-width: 600px)': {
                  width: '100%',
                  maxWidth: '400px',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(32, 32, 32, 0.8)',
                },
                '&:hover': {
                  bgcolor: 'rgba(64, 64, 64, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.3)',
                }
              }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={useAbsoluteNumbering}
                      onChange={handleAbsoluteNumberingToggle}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#E50914',
                          '& + .MuiSwitch-track': {
                            bgcolor: '#E50914'
                          }
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                      Absolute
                    </Typography>
                  }
                  sx={{ mr: 1 }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  '@media (max-width: 600px)': {
                    flex: 1,
                    justifyContent: 'flex-end'
                  }
                }}>
                  <TextField
                    size="small"
                    value={useAbsoluteNumbering ? episodeInput : seasonInput}
                    onChange={useAbsoluteNumbering ? handleEpisodeInputChange : handleSeasonInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePlayEpisode();
                      }
                    }}
                    placeholder={useAbsoluteNumbering ? `1-${totalEpisodes}` : `1-${totalSeasons}`}
                    sx={{
                      width: '60px',
                      '& .MuiInputBase-input': {
                        color: 'white',
                        padding: '8px',
                        fontSize: '1rem',
                        height: '24px',
                        textAlign: 'center',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.5)',
                          opacity: 1
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(32, 32, 32, 0.4)',
                        backdropFilter: 'blur(20px)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.25)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E50914'
                        }
                      }
                    }}
                  />
                  {!useAbsoluteNumbering && (
                    <TextField
                      size="small"
                      value={episodeInput}
                      onChange={handleEpisodeInputChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handlePlayEpisode();
                        }
                      }}
                      placeholder={seasonInput ? `1-${seasonDetails[parseInt(seasonInput) - 1]?.episodes?.length || '?'}` : "E #"}
                      sx={{
                        width: '60px',
                        '& .MuiInputBase-input': {
                          color: 'white',
                          padding: '8px',
                          fontSize: '1rem',
                          height: '24px',
                          textAlign: 'center',
                          '&::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)',
                            opacity: 1
                          }
                        },
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(32, 32, 32, 0.4)',
                          backdropFilter: 'blur(20px)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px'
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.25)'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#E50914'
                          }
                        }
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Play episode" placement="bottom">
                      <IconButton
                        onClick={handlePlayEpisode}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          width: '40px',
                          height: '40px',
                          '& svg': {
                            fontSize: '24px'
                          },
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.1)'
                          },
                          '&:active': {
                            transform: 'scale(0.95)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Next episode" placement="bottom">
                      <IconButton
                        onClick={handleNextEpisode}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          width: '40px',
                          height: '40px',
                          '& svg': {
                            fontSize: '24px'
                          },
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.1)'
                          },
                          '&:active': {
                            transform: 'scale(0.95)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <SkipNextIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Utility Buttons Container */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '@media (max-width: 600px)': {
              position: 'absolute',
              top: 16,
              right: 16
            }
          }}>
            {/* API Source Button */}
            <Tooltip title="Change video source" placement="left">
              <IconButton
                onClick={onApiPopupOpen}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  },
                  transition: 'all 0.2s ease',
                  width: 40,
                  height: 40,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <SettingsIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* Close Button */}
            <Tooltip title="Close player" placement="left">
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  },
                  transition: 'all 0.2s ease',
                  width: 40,
                  height: 40,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <CloseIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Loading Overlay */}
        {!videoUrl && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 5
            }}
          >
            <CircularProgress sx={{ color: '#E50914' }} />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default React.memo(VideoPlayer); 