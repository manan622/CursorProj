import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import LanguageIcon from '@mui/icons-material/Language';

const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  handleClearSearch, 
  handleRefresh,
  handleApiPopupOpen 
}) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'rgba(20, 20, 20, 0.8)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease-in-out',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: '#E50914',
            mr: 2,
            fontWeight: 'bold',
            fontSize: { xs: '1rem', sm: '1.5rem' },
            textTransform: 'uppercase',
          }}
        >
          NETFLIX
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <TextField
            size="small"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: '15px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#E50914',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#E50914',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <IconButton
          onClick={handleRefresh}
          sx={{
            color: 'white',
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton 
          onClick={handleApiPopupOpen} 
          sx={{ 
            color: 'white', 
            ml: 'auto' 
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 