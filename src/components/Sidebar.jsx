import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 65;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open state
  };

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
      }}
    >
      <IconButton onClick={handleToggleSidebar} sx={{ position: 'absolute', top: 16, right: -30 }}>
        {isOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />} {/* Change icon based on state */}
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
            transition: 'width 0.2s ease-in-out',
            borderRight: 'none',
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          {isOpen && <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>E-Shop</Typography>}
        </Box>
        <List>
          <ListItem 
            button 
            component={Link} 
            to="/" 
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <HomeIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Home" sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }} />}
          </ListItem>
          <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <ShoppingBagIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Products" sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }} />}
          </ListItem>
          <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <CategoryIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Categories" sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }} />}
          </ListItem>
          <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <LocalOfferIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Deals" sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }} />}
          </ListItem>
          <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <SearchIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Search" sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }} />}
          </ListItem>
          <ListItem 
            button 
            component={Link} 
            to="/cart" 
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <ShoppingCartIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Cart" sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }} />}
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

export default Sidebar; 