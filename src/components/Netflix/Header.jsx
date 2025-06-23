import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Button,
  useScrollTrigger,
  Slide,
  Container,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import StyledSearchBar from './StyledSearchBar';

// Hide header on scroll down, show on scroll up
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  handleClearSearch, 
  handleRefresh,
  handleApiPopupOpen 
}) => {
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: `
            linear-gradient(
              135deg,
              rgba(20, 20, 20, 0.98) 0%,
              rgba(30, 20, 25, 0.98) 50%,
              rgba(20, 20, 20, 0.98) 100%
            )
          `,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(229, 9, 20, 0.2)',
          transition: 'all 0.3s ease-in-out',
          backdropFilter: 'blur(20px)',
          height: isAndroid ? '70px' : '64px',
          zIndex: 1300,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.5), transparent)',
          }
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            py: isAndroid ? 1 : 0.5,
            minHeight: isAndroid ? '70px' : '64px',
            px: { xs: 2, sm: 3 }
          }}>
            {/* Left Section - Logo and Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  color: '#E50914',
                  fontWeight: 900,
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '0 0 20px rgba(229, 9, 20, 0.5)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    textShadow: '0 0 30px rgba(229, 9, 20, 0.8)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: 'linear-gradient(90deg, #E50914, #FF6B6B, #E50914)',
                    borderRadius: '2px',
                    animation: 'glow 2s ease-in-out infinite alternate',
                  },
                  '@keyframes glow': {
                    '0%': { boxShadow: '0 0 5px rgba(229, 9, 20, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(229, 9, 20, 0.8)' }
                  }
                }}
              >
                NETFLIX
              </Typography>
              
              {/* Navigation Buttons - Enhanced for desktop */}
              {!isMobile && (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Button 
                    startIcon={<HomeIcon />}
                    color="inherit" 
                    sx={{ 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.15)',
                        transform: 'translateY(-2px)',
                        color: '#E50914',
                        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                      }
                    }}
                  >
                    Home
                  </Button>
                  <Button 
                    startIcon={<TvIcon />}
                    color="inherit" 
                    sx={{ 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.15)',
                        transform: 'translateY(-2px)',
                        color: '#E50914',
                        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                      }
                    }}
                  >
                    TV Shows
                  </Button>
                  <Button 
                    startIcon={<MovieIcon />}
                    color="inherit" 
                    sx={{ 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.15)',
                        transform: 'translateY(-2px)',
                        color: '#E50914',
                        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                      }
                    }}
                  >
                    Movies
                  </Button>
                  <Button 
                    startIcon={<FavoriteIcon />}
                    color="inherit" 
                    sx={{ 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.15)',
                        transform: 'translateY(-2px)',
                        color: '#E50914',
                        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                      }
                    }}
                  >
                    My List
                  </Button>
                </Box>
              )}
            </Box>

            {/* Center Section - Enhanced Search Bar */}
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              justifyContent: 'center',
              mx: { xs: 2, sm: 3, md: 6 },
              maxWidth: '600px'
            }}>
              <StyledSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={handleClearSearch}
                isAndroid={isAndroid}
              />
            </Box>

            {/* Right Section - Enhanced Actions */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 }
            }}>
              {/* API Source Button */}
              <IconButton
                color="inherit"
                onClick={handleApiPopupOpen}
                sx={{
                  padding: { xs: '8px', sm: '10px' },
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: 'rgba(229, 9, 20, 0.15)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.3rem', sm: '1.5rem' }
                  }
                }}
              >
                <LanguageIcon />
              </IconButton>

              {/* Desktop-only buttons */}
              {!isMobile && (
                <>
                  <IconButton
                    color="inherit"
                    sx={{
                      padding: '10px',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.15)',
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                      }
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    sx={{
                      padding: '10px',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.15)',
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </IconButton>
                </>
              )}

              {/* Refresh Button */}
              <IconButton
                color="inherit"
                onClick={handleRefresh}
                sx={{
                  padding: { xs: '8px', sm: '10px' },
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: 'rgba(229, 9, 20, 0.15)',
                    transform: 'scale(1.1) rotate(180deg)',
                    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.3rem', sm: '1.5rem' }
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>

              {/* Profile Avatar with Menu */}
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  padding: 0,
                  ml: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: { xs: 32, sm: 36 }, 
                    height: { xs: 32, sm: 36 },
                    bgcolor: '#E50914',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  U
                </Avatar>
              </IconButton>

              {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(20, 20, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    mt: 1,
                    minWidth: 200,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'white', py: 1.5 }}>
                  <AccountCircleIcon sx={{ mr: 2 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'white', py: 1.5 }}>
                  <FavoriteIcon sx={{ mr: 2 }} />
                  My List
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'white', py: 1.5 }}>
                  <HistoryIcon sx={{ mr: 2 }} />
                  Watch History
                </MenuItem>
                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'white', py: 1.5 }}>
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;