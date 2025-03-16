import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, IconButton, Badge, Divider, Tooltip, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 65;

function Sidebar({ cart = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if current route matches the menu item
  const isActive = (path) => location.pathname === path;

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <Box
      sx={{
        width: isOpen ? drawerWidth : collapsedWidth,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        backgroundColor: 'primary.dark',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        zIndex: 1200,
      }}
    >
      <IconButton 
        onClick={handleToggleSidebar} 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: -30,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          }
        }}
      >
        {isOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
      </IconButton>

      <Drawer
        variant="permanent"
        sx={{
          width: isOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? drawerWidth : collapsedWidth,
            boxSizing: 'border-box',
            backgroundColor: 'primary.dark',
            color: 'white',
            transition: 'width 0.3s ease',
            borderRight: 'none',
            boxShadow: 'none',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isOpen ? 'space-between' : 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          minHeight: '64px',
        }}>
          {isOpen ? (
            <Typography variant="h6" component="div" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              E-Shop
            </Typography>
          ) : (
            <Avatar sx={{ 
              width: 35, 
              height: 35,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            }}>
              E
            </Avatar>
          )}
        </Box>

        <List sx={{ pt: 1 }}>
          {/* Home */}
          <Tooltip title={isOpen ? "" : "Home"} placement="right">
            <ListItem 
              button 
              component={Link} 
              to="/" 
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/') ? -0.5 : 0 }}>
                <HomeIcon color={isActive('/') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Home" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>

          {/* Products */}
          <Tooltip title={isOpen ? "" : "Products"} placement="right">
            <ListItem 
              button 
              component={Link}
              to="/products"
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/products') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/products') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/products') ? -0.5 : 0 }}>
                <ShoppingBagIcon color={isActive('/products') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Products" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/products') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>

          {/* Categories */}
          <Tooltip title={isOpen ? "" : "Categories"} placement="right">
            <ListItem 
              button 
              component={Link}
              to="/categories"
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/categories') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/categories') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/categories') ? -0.5 : 0 }}>
                <CategoryIcon color={isActive('/categories') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Categories" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/categories') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>

          {/* Deals */}
          <Tooltip title={isOpen ? "" : "Deals"} placement="right">
            <ListItem 
              button 
              component={Link}
              to="/deals"
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/deals') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/deals') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/deals') ? -0.5 : 0 }}>
                <LocalOfferIcon color={isActive('/deals') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Deals" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/deals') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>

          {/* Wishlist - New Item */}
          <Tooltip title={isOpen ? "" : "Wishlist"} placement="right">
            <ListItem 
              button 
              component={Link}
              to="/wishlist"
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/wishlist') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/wishlist') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/wishlist') ? -0.5 : 0 }}>
                <FavoriteIcon color={isActive('/wishlist') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Wishlist" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/wishlist') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>

          <Divider sx={{ my: 1.5, backgroundColor: 'rgba(255,255,255,0.1)' }} />

          {/* Search */}
          <Tooltip title={isOpen ? "" : "Search"} placement="right">
            <ListItem 
              button 
              component={Link}
              to="/search"
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/search') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/search') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/search') ? -0.5 : 0 }}>
                <SearchIcon color={isActive('/search') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Search" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/search') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>

          {/* Cart with Badge */}
          <Tooltip title={isOpen ? "" : "Cart"} placement="right">
            <ListItem 
              button 
              component={Link} 
              to="/cart" 
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/cart') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/cart') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/cart') ? -0.5 : 0 }}>
                <Badge badgeContent={cartItemCount} color="secondary">
                  <ShoppingCartIcon color={isActive('/cart') ? "secondary" : "inherit"} />
                </Badge>
              </ListItemIcon>
              {isOpen && <ListItemText primary="Cart" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/cart') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Bottom section with profile and settings */}
        <List>
          <Divider sx={{ mb: 1.5, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          
          {/* Profile */}
          <Tooltip title={isOpen ? "" : "Profile"} placement="right">
            <ListItem 
              button 
              component={Link}
              to="/profile"
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/profile') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/profile') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/profile') ? -0.5 : 0 }}>
                <PersonIcon color={isActive('/profile') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Profile" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/profile') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>
          
          {/* Settings */}
          <Tooltip title={isOpen ? "" : "Settings"} placement="right">
            <ListItem 
              button 
              component={Link}
              to="/settings"
              sx={{ 
                py: 1.5,
                backgroundColor: isActive('/settings') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActive('/settings') ? '4px solid #FF8E53' : '4px solid transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderLeft: '4px solid #FF8E53',
                } 
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40, ml: isActive('/settings') ? -0.5 : 0 }}>
                <SettingsIcon color={isActive('/settings') ? "secondary" : "inherit"} />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Settings" sx={{ '& .MuiListItemText-primary': { fontWeight: isActive('/settings') ? 700 : 500 } }} />}
            </ListItem>
          </Tooltip>
        </List>

        {/* Version info at bottom */}
        {isOpen && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', mt: 2 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              E-Shop v1.0.0
            </Typography>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default Sidebar;