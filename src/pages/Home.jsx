import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, Snackbar, Alert, Badge, Paper, Chip, Rating, CircularProgress, Divider, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';

const featuredProducts = [
  {
    id: 1,
    name: 'Product 1',
    price: '$99.99',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    name: 'Product 2',
    price: '$149.99',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 3,
    name: 'Product 3',
    price: '$199.99',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 4,
    name: 'Product 4',
    price: '$79.99',
    image: 'https://via.placeholder.com/300',
  },
];

function Home({ cart, setCart, openSnackbar, snackbarMessage, handleCloseSnackbar }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setProducts(json);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(json.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      // Update quantity if product already exists
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Add this missing function
  const handleToggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Define filteredProducts variable
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Box>
      {/* Hero Section - Enhanced with search bar */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8, // Increased padding
          mb: 6, // Increased margin
          borderRadius: '12px', // Increased border radius
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'fadeIn 0.8s ease-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(10px)',
            zIndex: -1,
            background: 'linear-gradient(135deg, rgba(88, 86, 214, 0.9), rgba(130, 128, 255, 0.8))',
          }
        }}
      >
        <Container maxWidth="xl">
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              animation: 'fadeIn 0.8s ease-out',
            }}
          >
            <Typography 
              variant="h2" // Larger heading
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800, // Bolder font
                mb: 0,
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                animation: 'fadeIn 0.8s ease-out',
              }}
            >
              Welcome to E-Shop
            </Typography>
            <Link to="/cart" style={{ textDecoration: 'none' }}>
              <Badge badgeContent={cartItemCount} color="secondary">
                <Button 
                  variant="contained" 
                  color="secondary"
                  startIcon={<ShoppingCartIcon />}
                  sx={{ 
                    backdropFilter: 'blur(5px)',
                    background: 'rgba(255, 82, 82, 0.7)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      background: 'rgba(198, 40, 40, 0.8)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(255, 82, 82, 0.3)',
                    }
                  }}
                >
                  Cart
                </Button>
              </Badge>
            </Link>
          </Box>
          <Typography 
            variant="h5" // Larger subtitle
            gutterBottom 
            sx={{ 
              opacity: 0.9,
              animation: 'fadeIn 0.8s ease-out 0.2s both',
              mb: 3, // More margin
            }}
          >
            Discover amazing products at unbeatable prices
          </Typography>
          
          {/* Search Bar - Centered */}
                <Box 
                sx={{ 
                display: 'flex', 
                maxWidth: '600px',
                mb: 4,
                animation: 'fadeIn 0.8s ease-out 0.3s both',
                position: 'relative',
                mx: 'auto', // Add margin auto to center
                }}
                >
                <input
                type="text"
                placeholder="Search for products..."
                style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '1rem',
                borderRadius: '30px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                outline: 'none',
                }}
                />
                <IconButton
                sx={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'primary.main',
                }}
                >
                <SearchIcon />
                </IconButton>
                </Box>
                
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            sx={{ 
              mt: 2,
              backdropFilter: 'blur(5px)',
              background: 'rgba(255, 82, 82, 0.7)',
              animation: 'fadeIn 0.8s ease-out 0.4s both',
              padding: '12px 30px', // Larger padding
              fontSize: '1.1rem', // Larger font
              borderRadius: '30px', // Rounded corners
              '&:hover': {
                background: 'rgba(198, 40, 40, 0.8)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(255, 82, 82, 0.3)',
              }
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Paper>

      {/* Trust Badges Section */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            py: 3,
            px: 2,
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            animation: 'fadeIn 0.8s ease-out 0.5s both',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
            <LocalShippingIcon sx={{ fontSize: '2rem', color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Free Shipping</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
            <PaymentIcon sx={{ fontSize: '2rem', color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Secure Payment</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
            <SecurityIcon sx={{ fontSize: '2rem', color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Money-Back Guarantee</Typography>
          </Box>
        </Box>
      </Container>

      {/* Category Filter */}
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 1,
            mb: 4,
            animation: 'fadeIn 0.8s ease-out 0.6s both',
          }}
        >
          <Chip 
            label="All Products" 
            color={selectedCategory === 'all' ? 'primary' : 'default'}
            onClick={() => setSelectedCategory('all')}
            sx={{ 
              fontWeight: selectedCategory === 'all' ? 700 : 400,
              '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
            }}
          />
          {categories.map(category => (
            <Chip 
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              color={selectedCategory === category ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(category)}
              sx={{ 
                fontWeight: selectedCategory === category ? 700 : 400,
                '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
              }}
            />
          ))}
        </Box>

        {/* Featured Products */}
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            mb: 4,
            letterSpacing: '-0.01em',
            animation: 'fadeIn 0.8s ease-out 0.6s both',
          }}
        >
          {selectedCategory === 'all' ? 'Featured Products' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid 
            container 
            spacing={3} // Increased spacing
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.id} sx={{ animation: `fadeIn 0.8s ease-out ${0.2 + index * 0.1}s both` }}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '12px', // Increased border radius
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'white',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                      background: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', flexGrow: 1 }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={product.image}
                      alt={product.title}
                      sx={{ 
                        objectFit: 'contain',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        backgroundColor: 'transparent',
                        p: 2, // Added padding
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    />
                    <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleToggleWishlist(product.id)}
                        sx={{
                          bgcolor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <FavoriteIcon color={wishlist.includes(product.id) ? 'error' : 'action'} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          '&:hover': { transform: 'scale(1.1)', bgcolor: 'primary.dark' }
                        }}
                      >
                        <ShoppingCartIcon />
                      </IconButton>
                    </Box>
                    
                    {/* Category Badge */}
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        bgcolor: 'rgba(88, 86, 214, 0.1)',
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 0, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="div"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '1rem',
                        mb: 0.5,
                        letterSpacing: '0.01em',
                        minHeight: '2.4em', // Changed from fixed height to minHeight
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // Limit to 2 lines
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating?.rate || 4.5} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.rating?.count || 120})
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      color="secondary.main"
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1.1rem',
                        letterSpacing: '0.01em'
                      }}
                    >
                      ${product.price}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(product)}
                      sx={{
                        mt: 1,
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Newsletter Section */}
      <Container maxWidth="xl" sx={{ my: 8 }}>
        <Box
          sx={{
            bgcolor: 'primary.light',
            borderRadius: '12px',
            p: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            animation: 'fadeIn 0.8s ease-out',
          }}
        >
          <Box sx={{ mb: { xs: 3, md: 0 }, maxWidth: { md: '60%' } }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body1">
              Get the latest updates, deals and exclusive offers directly to your inbox.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', width: { xs: '100%', md: 'auto' } }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                padding: '12px 20px',
                borderRadius: '30px 0 0 30px',
                border: 'none',
                width: '100%',
                minWidth: '250px',
                outline: 'none',
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: '0 30px 30px 0',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(255, 82, 82, 0.3)',
                }
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            backdropFilter: 'blur(10px)',
            background: 'rgba(76, 175, 80, 0.8)',
            animation: 'slideUp 0.3s ease-out',
            '@keyframes slideUp': {
              '0%': { transform: 'translateY(100%)' },
              '100%': { transform: 'translateY(0)' }
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;