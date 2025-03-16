import { Container, Typography, Box, Card, CardContent, Grid, Button, IconButton, Divider, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Cart({ cart, setCart }) {
  const handleQuantityChange = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 4,
            mt: 4
          }}
        >
          Shopping Cart
        </Typography>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button 
            variant="outlined" 
            color="primary"
            sx={{ mb: 4, mt: 4 }}
          >
            Continue Shopping
          </Button>
        </Link>
      </Box>

      {cart.length === 0 ? (
        <Paper elevation={0} sx={{ textAlign: 'center', py: 8, borderRadius: 0 }}>
          <Typography variant="h6" color="text.secondary">
            Your cart is empty
          </Typography>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
            >
              Start Shopping
            </Button>
          </Link>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Card 
                key={item.id} 
                sx={{ 
                  mb: 2,
                  borderRadius: 0,
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0',
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ 
                          width: '100%', 
                          height: 'auto',
                          objectFit: 'cover'
                        }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="h6" color="secondary.main" sx={{ mt: 1 }}>
                            {item.price}
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={() => handleRemoveItem(item.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <IconButton 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          size="small"
                          color="primary"
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                        <IconButton 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          size="small"
                          color="primary"
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 0, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal</Typography>
                    <Typography>${calculateTotal()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping</Typography>
                    <Typography>Free</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                    <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>${calculateTotal()}</Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Cart; 