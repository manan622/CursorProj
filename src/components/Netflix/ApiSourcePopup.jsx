import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Speed as SpeedIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ApiSourcePopup = ({ open, onClose, currentApi, onApiChange, apiSources }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [recentlyUsed, setRecentlyUsed] = useState([]);
  const [apiStatus, setApiStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiLatency, setApiLatency] = useState({});
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedApi, setSelectedApi] = useState(null);
  const theme = useTheme();
  const isAndroid = useMediaQuery('(max-width:600px) and (hover:none) and (pointer:coarse)');

  // Load favorites and recently used from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteApis');
    const savedRecent = localStorage.getItem('recentApis');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecentlyUsed(JSON.parse(savedRecent));
  }, []);

  // Check API status and latency
  const checkApiStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    const status = {};
    const latency = {};

    try {
      await Promise.all(apiSources.map(async (api) => {
        const startTime = performance.now();
        try {
          const response = await fetch(api.url, { 
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          });
          const endTime = performance.now();
          status[api.id] = response.ok;
          latency[api.id] = Math.round(endTime - startTime);
        } catch {
          status[api.id] = false;
          latency[api.id] = null;
        }
      }));

      setApiStatus(status);
      setApiLatency(latency);
    } catch (err) {
      setError('Failed to check API status');
    } finally {
      setLoading(false);
    }
  }, [apiSources]);

  useEffect(() => {
    if (open) {
      checkApiStatus();
    }
  }, [open, checkApiStatus]);

  const handleApiSelect = (api) => {
    onApiChange(api.id);
    const newRecent = [api.id, ...recentlyUsed.filter(id => id !== api.id)].slice(0, 3);
    setRecentlyUsed(newRecent);
    localStorage.setItem('recentApis', JSON.stringify(newRecent));
    onClose();
  };

  const toggleFavorite = (apiId, event) => {
    event.stopPropagation();
    const newFavorites = favorites.includes(apiId)
      ? favorites.filter(id => id !== apiId)
      : [...favorites, apiId];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteApis', JSON.stringify(newFavorites));
  };

  const handleRefresh = (event) => {
    event.stopPropagation();
    checkApiStatus();
  };

  const handleMenuOpen = (event, api) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedApi(api);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedApi(null);
  };

  const filteredApis = apiSources.filter(api =>
    api.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedApis = [...filteredApis].sort((a, b) => {
    // First sort by favorites
    if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
    if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;
    // Then by recently used
    if (recentlyUsed.includes(a.id) && !recentlyUsed.includes(b.id)) return -1;
    if (!recentlyUsed.includes(a.id) && recentlyUsed.includes(b.id)) return 1;
    // Then by status (online first)
    if (apiStatus[a.id] && !apiStatus[b.id]) return -1;
    if (!apiStatus[a.id] && apiStatus[b.id]) return 1;
    // Finally by name
    return a.name.localeCompare(b.name);
  });

  const getLatencyColor = (latency) => {
    if (!latency) return 'error.main';
    if (latency < 500) return 'success.main';
    if (latency < 1000) return 'warning.main';
    return 'error.main';
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(10px)',
            borderRadius: isAndroid ? '16px' : '8px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            maxHeight: isAndroid ? '80vh' : '70vh',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white',
          pb: 1,
          pt: isAndroid ? 2 : 1,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
        }}>
          <Typography variant="h6" sx={{ fontSize: isAndroid ? '1.1rem' : '1.25rem' }}>
            Select API Source
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Status">
              <IconButton
                onClick={handleRefresh}
                size={isAndroid ? "small" : "medium"}
                sx={{ 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
            <IconButton 
              onClick={onClose} 
              size={isAndroid ? "small" : "medium"}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: isAndroid ? 1 : 2, bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size={isAndroid ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                },
              }}
            />
          </Box>

          {recentlyUsed.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <HistoryIcon sx={{ color: 'white', fontSize: '1rem' }} />
                <Typography variant="subtitle2" sx={{ color: 'white' }}>
                  Recently Used
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                {recentlyUsed.map(apiId => {
                  const api = apiSources.find(a => a.id === apiId);
                  return (
                    <Chip
                      key={apiId}
                      label={api.name}
                      onClick={() => handleApiSelect(api)}
                      size={isAndroid ? "small" : "medium"}
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {sortedApis.map((api) => (
                <motion.div
                  key={api.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    button
                    onClick={() => handleApiSelect(api)}
                    selected={currentApi === api.id}
                    sx={{
                      borderRadius: '8px',
                      mb: 0.5,
                      bgcolor: currentApi === api.id ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      },
                      p: isAndroid ? 1 : 1.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {currentApi === api.id ? (
                        <CheckIcon sx={{ color: 'white' }} />
                      ) : (
                        <SpeedIcon sx={{ color: 'white', opacity: 0.7 }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'white',
                              fontSize: isAndroid ? '0.9rem' : '1rem',
                            }}
                          >
                            {api.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {apiStatus[api.id] !== undefined && (
                              <Chip
                                size="small"
                                label={apiStatus[api.id] ? "Online" : "Offline"}
                                icon={apiStatus[api.id] ? <CheckIcon /> : <ErrorIcon />}
                                sx={{
                                  bgcolor: apiStatus[api.id] ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                  color: apiStatus[api.id] ? '#4caf50' : '#f44336',
                                  height: '20px',
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                            {apiLatency[api.id] && (
                              <Chip
                                size="small"
                                label={`${apiLatency[api.id]}ms`}
                                sx={{
                                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                                  color: getLatencyColor(apiLatency[api.id]),
                                  height: '20px',
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: isAndroid ? '0.7rem' : '0.75rem',
                          }}
                        >
                          {api.url}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={favorites.includes(api.id) ? "Remove from favorites" : "Add to favorites"}>
                        <IconButton
                          size={isAndroid ? "small" : "medium"}
                          onClick={(e) => toggleFavorite(api.id, e)}
                          sx={{
                            color: favorites.includes(api.id) ? '#ffd700' : 'rgba(255, 255, 255, 0.5)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                          }}
                        >
                          {favorites.includes(api.id) ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More options">
                        <IconButton
                          size={isAndroid ? "small" : "medium"}
                          onClick={(e) => handleMenuOpen(e, api)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </DialogContent>
      </Dialog>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <InfoIcon sx={{ mr: 1, color: 'white' }} />
          <Typography sx={{ color: 'white' }}>View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <RefreshIcon sx={{ mr: 1, color: 'white' }} />
          <Typography sx={{ color: 'white' }}>Check Status</Typography>
        </MenuItem>
      </Menu>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%', bgcolor: 'rgba(20, 20, 20, 0.95)' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApiSourcePopup; 