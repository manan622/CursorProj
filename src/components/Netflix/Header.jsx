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
  useTheme
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
            ),
            linear-gradient(
              45deg,
              rgba(229, 9, 20, 0.03) 0%,
              transparent 20%,
              transparent 80%,
              rgba(229, 9, 20, 0.03) 100%
            ),
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 10px
            )
          `,
          backgroundSize: '100% 100%, 100% 100%, 20px 20px',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease-in-out',
          backdropFilter: 'blur(10px)',
          height: isAndroid ? '80px' : '64px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.3), transparent)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.2), transparent)',
          }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            py: isAndroid ? 2 : 1,
            minHeight: isAndroid ? '80px' : '64px'
          }}>
            {/* Left Section - Logo and Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: isAndroid ? 4 : 3 }}>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  color: '#E50914',
                  fontWeight: 'bold',
                  fontSize: isAndroid ? '1.8rem' : { xs: '1.2rem', sm: '1.5rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(229, 9, 20, 0.3)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #E50914, transparent)',
                  }
                }}
              >
                NETFLIX
              </Typography>
              
              {/* Navigation Buttons - Hidden on Android */}
              {!isAndroid && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    color="inherit" 
                    sx={{ 
                      fontSize: '1rem',
                      padding: '6px 12px',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.1)',
                        transform: 'translateY(-1px)',
                        color: '#E50914'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Home
                  </Button>
                  <Button 
                    color="inherit" 
                    sx={{ 
                      fontSize: '1rem',
                      padding: '6px 12px',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.1)',
                        transform: 'translateY(-1px)',
                        color: '#E50914'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    TV Shows
                  </Button>
                  <Button 
                    color="inherit" 
                    sx={{ 
                      fontSize: '1rem',
                      padding: '6px 12px',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.1)',
                        transform: 'translateY(-1px)',
                        color: '#E50914'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Movies
                  </Button>
                  <Button 
                    color="inherit" 
                    sx={{ 
                      fontSize: '1rem',
                      padding: '6px 12px',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.1)',
                        transform: 'translateY(-1px)',
                        color: '#E50914'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    New & Popular
                  </Button>
                </Box>
              )}
            </Box>

            {/* Center Section - Search Bar */}
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              justifyContent: 'center',
              mx: isAndroid ? { xs: 2, sm: 3, md: 5 } : { xs: 1, sm: 2, md: 4 }
            }}>
              <StyledSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={handleClearSearch}
                isAndroid={isAndroid}
              />
            </Box>

            {/* Right Section - Actions */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: isAndroid ? 2 : 1
            }}>
              {/* API Source Button - Always visible */}
              <IconButton
                color="inherit"
                onClick={handleApiPopupOpen}
                sx={{
                  padding: isAndroid ? '12px' : '8px',
                  '&:hover': { 
                    bgcolor: 'rgba(229, 9, 20, 0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out',
                  '& .MuiSvgIcon-root': {
                    fontSize: isAndroid ? '1.8rem' : { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                  }
                }}
              >
                <LanguageIcon />
              </IconButton>

              {/* Other buttons - Hidden on Android */}
              {!isAndroid && (
                <>
                  <IconButton
                    color="inherit"
                    sx={{
                      padding: '8px',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    sx={{
                      padding: '8px',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                      }
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={handleRefresh}
                    sx={{
                      padding: '8px',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header; 