import React from 'react';
import { Dialog, DialogContent, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EmbeddedPlayer = ({ open, onClose, videoUrl, onApiPopupOpen }) => {
  return (
    <Dialog 
      sx={{ backdropFilter: 'blur(10px)' }} 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
    <div>
      <DialogContent sx={{ position: 'relative', padding: 0 ,height:'750px'}}>
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
            //padding:'5px',
            backgroundColor: 'rgba(31, 31, 31, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
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
            }}>
              <iframe
                src={videoUrl}
                title="Embedded Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
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

export default EmbeddedPlayer; 