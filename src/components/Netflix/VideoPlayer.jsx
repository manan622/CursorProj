import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, IconButton, Button, Box, CircularProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';

const VideoPlayer = ({ open, onClose, videoUrl, onApiPopupOpen }) => {
  const [videoKey, setVideoKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          bgcolor: 'black'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* API Source Button */}
        <IconButton
          onClick={onApiPopupOpen}
          sx={{
            position: 'absolute',
            top: 16,
            right: 72, // Position it 56px (button width) + 16px (spacing) from the right edge
            zIndex: 10,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <SettingsIcon />
        </IconButton>

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