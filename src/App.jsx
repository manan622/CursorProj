import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import NetflixPage from './pages/NetflixPage';
import ColorPaletteSwitcher from './components/ColorPaletteSwitcher';
import { useState, useEffect, useMemo } from 'react';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentPalette, setCurrentPalette] = useState({
    primary: 'rgba(88, 86, 214, 0.85)',
    secondary: 'rgba(255, 82, 82, 0.85)',
    background: 'rgba(255, 255, 255, 0.8)',
    text: 'rgba(0, 0, 0, 0.87)',
  });
  const [styleOptions, setStyleOptions] = useState({
    blurAmount: 10,
    borderRadius: 8,
    opacity: 0.85,
    glassEffect: true,
    netflixStyle: false,
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setSnackbarMessage(`${product.name} added to cart`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePaletteChange = (newPalette) => {
    setCurrentPalette(newPalette);
  };

  const handleStyleChange = (newOptions) => {
    setStyleOptions(prev => ({ ...prev, ...newOptions }));
  };

  // Create theme based on current palette
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: currentPalette.primary,
            light: currentPalette.primary.replace('0.85', '0.7'),
            dark: currentPalette.primary.replace('0.85', '0.9'),
          },
          secondary: {
            main: currentPalette.secondary,
            light: currentPalette.secondary.replace('0.85', '0.7'),
            dark: currentPalette.secondary.replace('0.85', '0.9'),
          },
          background: {
            default: styleOptions.netflixStyle ? '#141414' : currentPalette.background,
            paper: styleOptions.netflixStyle ? '#1F1F1F' : currentPalette.background,
          },
          text: {
            primary: styleOptions.netflixStyle ? '#FFFFFF' : currentPalette.text,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: styleOptions.netflixStyle ? '#141414' : currentPalette.background,
                color: styleOptions.netflixStyle ? '#FFFFFF' : currentPalette.text,
                transition: 'all 0.3s ease-in-out',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: styleOptions.netflixStyle ? '4px' : `${styleOptions.borderRadius}px`,
                backdropFilter: styleOptions.glassEffect ? `blur(${styleOptions.blurAmount}px)` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: styleOptions.opacity,
                ...(styleOptions.netflixStyle && {
                  backgroundColor: '#E50914',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#F40612',
                  },
                }),
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: styleOptions.netflixStyle ? '4px' : `${styleOptions.borderRadius}px`,
                backdropFilter: styleOptions.glassEffect ? `blur(${styleOptions.blurAmount}px)` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: styleOptions.opacity,
                ...(styleOptions.netflixStyle && {
                  backgroundColor: '#1F1F1F',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }),
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: styleOptions.netflixStyle ? '4px' : `${styleOptions.borderRadius}px`,
                backdropFilter: styleOptions.glassEffect ? `blur(${styleOptions.blurAmount}px)` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: styleOptions.opacity,
                ...(styleOptions.netflixStyle && {
                  backgroundColor: '#1F1F1F',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    zIndex: 1,
                  },
                }),
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                borderRadius: styleOptions.netflixStyle ? '0' : `${styleOptions.borderRadius}px`,
                backdropFilter: styleOptions.glassEffect ? `blur(${styleOptions.blurAmount}px)` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: styleOptions.opacity,
                ...(styleOptions.netflixStyle && {
                  backgroundColor: '#141414',
                  boxShadow: 'none',
                }),
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRadius: styleOptions.netflixStyle ? '0' : `${styleOptions.borderRadius}px`,
                backdropFilter: styleOptions.glassEffect ? `blur(${styleOptions.blurAmount}px)` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: styleOptions.opacity,
                ...(styleOptions.netflixStyle && {
                  backgroundColor: '#141414',
                  borderRight: 'none',
                }),
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: styleOptions.netflixStyle ? '4px' : `${styleOptions.borderRadius}px`,
                backdropFilter: styleOptions.glassEffect ? `blur(${styleOptions.blurAmount}px)` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: styleOptions.opacity,
                ...(styleOptions.netflixStyle && {
                  backgroundColor: '#1F1F1F',
                }),
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: styleOptions.netflixStyle ? '4px' : `${styleOptions.borderRadius}px`,
                  backdropFilter: styleOptions.glassEffect ? `blur(${styleOptions.blurAmount}px)` : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: styleOptions.opacity,
                  ...(styleOptions.netflixStyle && {
                    backgroundColor: '#333333',
                    '&:hover': {
                      backgroundColor: '#404040',
                    },
                  }),
                },
              },
            },
          },
        },
        shape: {
          borderRadius: styleOptions.netflixStyle ? 4 : styleOptions.borderRadius,
        },
      }),
    [currentPalette, styleOptions]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            transition: 'background-color 0.3s ease',
          }}
        >
          {!styleOptions.netflixStyle && (
            <>
              <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  width: { sm: `calc(100% - ${sidebarOpen ? '240px' : '65px'})` },
                  ml: { sm: sidebarOpen ? '240px' : '65px' },
                  transition: 'margin 0.2s ease-in-out, width 0.2s ease-in-out',
                }}
              >
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Home 
                        cart={cart} 
                        handleAddToCart={handleAddToCart} 
                        openSnackbar={openSnackbar}
                        snackbarMessage={snackbarMessage}
                        handleCloseSnackbar={handleCloseSnackbar}
                      />
                    } 
                  />
                  <Route 
                    path="/cart" 
                    element={<Cart cart={cart} setCart={setCart} />} 
                  />
                </Routes>
              </Box>
            </>
          )}
          {styleOptions.netflixStyle && (
            <Routes>
              <Route path="*" element={<NetflixPage />} />
            </Routes>
          )}
          <ColorPaletteSwitcher 
            onPaletteChange={handlePaletteChange} 
            onStyleChange={handleStyleChange}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
