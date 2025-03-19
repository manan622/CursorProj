import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  //DialogActions, 
  //Button, 
  List, 
  ListItem, 
  ListItemText, 
  Radio, 
  Typography, 
  //TextField,
  IconButton,
  //Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
//import AddIcon from '@mui/icons-material/Add';

const ApiSourcePopup = ({ open, onClose, currentApi, onApiChange, apiSources }) => {
  const [selectedApi, setSelectedApi] = useState(currentApi);
  //const [newApiName, setNewApiName] = useState('');
  //const [newApiUrl, setNewApiUrl] = useState('');
  //const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setSelectedApi(currentApi);
  }, [currentApi]);

  const handleApiSelect = (apiId) => {
    setSelectedApi(apiId);
    onApiChange(apiId);
    onClose();
  };

  /*const handleSave = () => {
    onApiChange(selectedApi);
    onClose();
  };*/

  /*const handleAddNewApi = () => {
    if (newApiName && newApiUrl) {
      const newApi = {
        id: newApiName.toLowerCase().replace(/\s+/g, '-'),
        name: newApiName,
        url: newApiUrl
      };
      
      apiSources.push(newApi); // Add new API to the sources
      setSelectedApi(newApi.id); // Automatically select the new API
      setNewApiName('');
      setNewApiUrl('');
      setShowAddForm(false);
      onApiChange(newApi.id);
    }
  };*/

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      sx={{ 
        '& .MuiDialog-paper': {
          bgcolor: '#181818', // Dark background
          borderRadius: '12px', // Rounded corners
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Shadow effect
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <Typography variant="h6">Select Streaming API Source</Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
          Choose which API to use for streaming movies and TV shows
        </Typography>
        <List>
          {apiSources.map((api) => (
            <ListItem 
              button 
              key={api.id} 
              onClick={() => handleApiSelect(api.id)} 
              sx={{ 
                bgcolor: selectedApi === api.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent', 
                borderRadius: '8px', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } 
              }}
            >
              <ListItemText 
                primary={api.name} 
                primaryTypographyProps={{ sx: { color: 'white' } }} 
              />
              <Radio checked={selectedApi === api.id} sx={{ color: 'white' }} />
            </ListItem>
          ))}
        </List>
        
        {/*{showAddForm ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Add New API Source</Typography>
            <TextField
              label="API Name"
              value={newApiName}
              onChange={(e) => setNewApiName(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
            />
            <TextField
              label="API URL"
              value={newApiUrl}
              onChange={(e) => setNewApiUrl(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              <Button 
                onClick={() => setShowAddForm(false)}
                sx={{ 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={handleAddNewApi}
                disabled={!newApiName || !newApiUrl}
                sx={{ 
                  backgroundColor: '#E50914',
                  '&:hover': { backgroundColor: '#b2070f' },
                }}
              >
                Add API
              </Button>
            </Box>
          </Box>
        ) : (
          <Button 
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm(true)}
            sx={{ 
              mt: 2,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.5)'
              }
            }}
            variant="outlined"
            fullWidth
          >
            Add New API Source
          </Button>
        )}*/}
     </DialogContent>
      {/*<DialogActions>
        <Button onClick={onClose} sx={{ color: 'white' }}>Close</Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#E50914', '&:hover': { bgcolor: '#b2070f' } }}>Save</Button>
      </DialogActions>*/}
    </Dialog>
  );
};

export default ApiSourcePopup; 