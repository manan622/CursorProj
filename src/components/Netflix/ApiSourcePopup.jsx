import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemText, 
  Radio, 
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ApiSourcePopup = ({ open, onClose, currentApi, onApiChange, apiSources }) => {
  const handleApiSelect = (apiId) => {
    onApiChange(apiId);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          bgcolor: '#181818',
          color: 'white',
          maxWidth: '400px',
          width: '100%',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#181818', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Select Video Source</Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose} 
            aria-label="close"
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#181818', color: 'white', p: 0 }}>
        <List sx={{ py: 0 }}>
          {apiSources.map((api) => (
            <ListItem 
              key={api.id} 
              button 
              onClick={() => handleApiSelect(api.id)}
              sx={{ 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                bgcolor: currentApi === api.id ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
              }}
            >
              <Radio 
                checked={currentApi === api.id} 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-checked': {
                    color: '#E50914',
                  }
                }}
              />
              <ListItemText 
                primary={api.name} 
                secondary={api.url} 
                primaryTypographyProps={{ 
                  sx: { 
                    color: 'white',
                    fontWeight: currentApi === api.id ? 'bold' : 'normal',
                  },
                }}
                secondaryTypographyProps={{ 
                  sx: { 
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.8rem', 
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Different sources may have different video availability. Try another source if a video isn't playing correctly.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ApiSourcePopup; 