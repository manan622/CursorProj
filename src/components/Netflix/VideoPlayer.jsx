import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
      sx={{ backdropFilter: 'blur(10px)' }} 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      // Optimize Dialog component
      TransitionProps={{
        timeout: { enter: 300, exit: 200 }
      }}
      keepMounted={false}
    >
      <div>
        <DialogContent 
          sx={{ 
            position: 'relative', 
            padding: 0, 
            height: '750px',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div>
            <IconButton
              onClick={onClose}
              sx={{
                position: 'relative',
                top: 7,
                right: -15,
                left: '50%',
                transform: 'translate(-50%, 0)',
                color: 'white',
                zIndex: 2
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          {videoUrl && (
            <div style={{ 
              position: 'relative', 
              top: '10px',
              width: '100%', 
              height: '700px',
              backgroundColor: 'rgba(31, 31, 31, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              willChange: 'transform', // Hardware acceleration hint
              transform: 'translateZ(0)', // Force GPU rendering
            }}>
              <div style={{
                position: 'relative',
                top: '0%',
                left: '50%',
                width: '100%',
                height: '400px',
                transform: 'translate(-50%, 0)',
                backgroundColor: '#000',
                borderRadius: '2px',
                overflow: 'hidden',
                willChange: 'transform', // Hardware acceleration hint
              }}>
                {/* Loading indicator */}
                {isLoading && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#000',
                      zIndex: 1
                    }}
                  >
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        borderTopColor: '#E50914',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                  </div>
                )}
                
                <iframe
                  ref={iframeRef}
                  key={videoKey}
                  src={optimizedVideoUrl}
                  onLoad={handleIframeLoaded}
                  {...iframeAttrs}
                />
              </div>
              <div>
                <Button
                  onClick={onApiPopupOpen}
                  variant="contained"
                  color="primary"
                  sx={{
                    position: 'relative',
                    top: 20,
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: 1,
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                  }}
                >
                  Source
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default React.memo(VideoPlayer); 