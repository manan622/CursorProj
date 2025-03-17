import { Box, Typography, Grid, Card, CardMedia, CardContent, IconButton, Paper, AppBar, Toolbar, TextField, InputAdornment, Tooltip, Drawer, Button, Chip, ToggleButton, ToggleButtonGroup, Select, MenuItem, useMediaQuery } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import { useState, useEffect } from 'react';
import ApiSourcePopup from '../components/Netflix/ApiSourcePopup';

const TMDB_API_KEY = 'da914409e3ab4f883504dc0dbf9d9917';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const movieCategories = [
  { title: 'Trending Now', endpoint: '/trending/movie/week' },
  { title: 'Popular on Netflix', endpoint: '/movie/popular' },
  { title: 'New Releases', endpoint: '/movie/now_playing' },
  { title: 'Top Rated', endpoint: '/movie/top_rated' },
];

const tvShowCategories = [
  { title: 'Popular TV Shows', endpoint: '/tv/popular' },
  { title: 'Top Rated TV Shows', endpoint: '/tv/top_rated' },
  { title: 'TV Shows Airing Today', endpoint: '/tv/airing_today' },
  { title: 'Currently On Air', endpoint: '/tv/on_the_air' },
];

function NetflixPage() {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tvCategories, setTvCategories] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({});
  const [myList, setMyList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [contentType, setContentType] = useState('all'); // 'all', 'movies', 'tv'
  const [isMovies, setIsMovies] = useState(true); // State to toggle between movies and TV shows
  const [selectedSeason, setSelectedSeason] = useState(1); // State for selected season
  const [selectedEpisode, setSelectedEpisode] = useState(1); // State for selected episode
  const [watchedHistory, setWatchedHistory] = useState([]); // State for watched history
  const [isMobileMode, setIsMobileMode] = useState(false); // State for mobile mode toggle
  const [view, setView] = useState('movies'); // State to track view type
  const [isApiPopupOpen, setIsApiPopupOpen] = useState(false);
  const [apiSource, setApiSource] = useState('tmdb'); // Default API source

  // Use media query to determine if the screen is small
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const apiSources = [
    { id: 'tmdb', name: 'TMDB (Default)', url: 'https://moviesapi.club' },
    { id: 'netflix', name: 'Netflix API', url: 'https://player.autoembed.cc/embed' },
    { id: 'hulu', name: 'Hulu API', url: 'https://hulu-api.example.com' },
    { id: 'prime', name: 'Prime Video API', url: 'https://primevideo-api.example.com' },
  ];

  const handleContentTypeChange = (event, newContentType) => {
    if (newContentType !== null) {
      setContentType(newContentType);
    }
  };

  const toggleContent = () => {
    setIsMovies(!isMovies); // Toggle the state
  };

  const clearHistory = () => {
    setWatchedHistory([]); // Clear the watched history
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured content (combining movies and TV shows)
      const [featuredMoviesResponse, featuredTvResponse] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
        fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
      ]);
      
      if (!featuredMoviesResponse.ok || !featuredTvResponse.ok) {
        throw new Error('Featured content fetch failed');
      }
      
      const [featuredMoviesData, featuredTvData] = await Promise.all([
        featuredMoviesResponse.json(),
        featuredTvResponse.json()
      ]);

      // Combine and shuffle movies and TV shows for featured content
      const combinedFeatured = [
        ...featuredMoviesData.results.slice(0, 3).map(item => ({ ...item, mediaType: 'movie' })),
        ...featuredTvData.results.slice(0, 2).map(item => ({ 
          ...item, 
          mediaType: 'tv',
          title: item.name,
          release_date: item.first_air_date
        }))
      ].sort(() => Math.random() - 0.5);

      // Fetch additional details for featured content
      const featuredWithDetails = await Promise.all(
        combinedFeatured.map(async (item) => {
          const detailsResponse = await fetch(
            `${TMDB_BASE_URL}/${item.mediaType}/${item.id}?api_key=${TMDB_API_KEY}&language=en-US`
          );
          if (!detailsResponse.ok) {
            throw new Error(`Content details fetch failed: ${detailsResponse.status}`);
          }
          const details = await detailsResponse.json();
          return {
            ...item,
            ...details,
            title: item.mediaType === 'tv' ? details.name : details.title,
            runtime: item.mediaType === 'tv' ? (details.episode_run_time[0] || 45) : details.runtime
          };
        })
      );
      setFeaturedMovies(featuredWithDetails);

      // Fetch movie categories
      const movieCategoriesData = await Promise.all(
        movieCategories.map(async (category) => {
          const response = await fetch(
            `${TMDB_BASE_URL}${category.endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          );
          
          if (!response.ok) {
            throw new Error(`Category ${category.title} fetch failed: ${response.status}`);
          }
          
          const data = await response.json();
          const firstMovieDetails = await fetch(
            `${TMDB_BASE_URL}/movie/${data.results[0].id}?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const firstMovieData = await firstMovieDetails.json();
          
          return {
            ...category,
            movies: data.results.slice(0, 6).map(movie => ({ ...movie, mediaType: 'movie' })),
            backdrop_path: firstMovieData.backdrop_path,
          };
        })
      );
      setCategories(movieCategoriesData);

      // Fetch TV show categories
      const tvCategoriesData = await Promise.all(
        tvShowCategories.map(async (category) => {
          const response = await fetch(
            `${TMDB_BASE_URL}${category.endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          );
          
          if (!response.ok) {
            throw new Error(`Category ${category.title} fetch failed: ${response.status}`);
          }
          
          const data = await response.json();
          const firstTvDetails = await fetch(
            `${TMDB_BASE_URL}/tv/${data.results[0].id}?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const firstTvData = await firstTvDetails.json();
          
          return {
            ...category,
            movies: data.results.slice(0, 6).map(show => ({ 
              ...show, 
              mediaType: 'tv',
              title: show.name,
              release_date: show.first_air_date
            })),
            backdrop_path: firstTvData.backdrop_path,
          };
        })
      );
      setTvCategories(tvCategoriesData);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const [movieResults, tvResults] = await Promise.all([
        fetch(
          `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        ),
        fetch(
          `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        )
      ]);

      if (!movieResults.ok || !tvResults.ok) {
        throw new Error('Search failed');
      }

      const [movieData, tvData] = await Promise.all([
        movieResults.json(),
        tvResults.json()
      ]);

      const combinedResults = [
        ...movieData.results.map(movie => ({ ...movie, mediaType: 'movie' })),
        ...tvData.results.map(show => ({
          ...show,
          mediaType: 'tv',
          title: show.name,
          release_date: show.first_air_date
        }))
      ].sort((a, b) => b.popularity - a.popularity);

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Error searching content:', error);
      setError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleScroll = (categoryIndex, direction) => {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleMyList = (movie) => {
    setMyList(prevList => {
      const isInList = prevList.some(m => m.id === movie.id);
      if (isInList) {
        return prevList.filter(m => m.id !== movie.id);
      } else {
        return [...prevList, movie];
      }
    });
  };

  const isInMyList = (movieId) => {
    return myList.some(movie => movie.id === movieId);
  };

  useEffect(() => {
    fetchMovies();
  }, [apiSource]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getUniqueMovieId = (movie, categoryIndex, movieIndex) => {
    return `${movie.id}-${categoryIndex}-${movieIndex}`;
  };

  const toggleMobileMode = () => {
    setIsMobileMode(prev => !prev); // Toggle mobile mode
  };

  const toggleView = () => {
    setView((prevView) => (prevView === 'movies' ? 'tvShows' : 'movies'));
  };

  const handlePlay = (movie) => {
    const selectedApi = apiSources.find(api => api.id === apiSource);
    let url;
    if (movie.mediaType === 'tv') {
      url = `${selectedApi.url}/tv/${movie.id}-${selectedSeason}-${selectedEpisode}`;
    } else {
      url = `${selectedApi.url}/movie/${movie.id}`;
    }
    window.open(url, '_blank');
    // Add to watched history
    setWatchedHistory(prev => [...prev, { id: movie.id, title: movie.title, mediaType: movie.mediaType }]);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#141414',
        color: 'white'
      }}>
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#141414',
        color: 'white',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h4">Error Loading Movies</Typography>
        <Typography variant="body1">{error}</Typography>
        <IconButton
          onClick={fetchMovies}
          sx={{
            bgcolor: '#E50914',
            color: 'white',
            '&:hover': { bgcolor: '#F40612' },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
    );
  }

  const currentFeaturedMovie = featuredMovies[currentFeaturedIndex];

  const MovieDetailsTab = ({ movie, onClose }) => {
    if (!movie) return null;

    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);

    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          setLoadingRecommendations(true);
          const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movie.id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
          }
          
          const data = await response.json();
          setRecommendations(data.results.slice(0, 6));
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        } finally {
          setLoadingRecommendations(false);
        }
      };

      fetchRecommendations();
    }, [movie.id]);

    const openInTMDB = () => {
      window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank');
    };

    return (
      <Drawer
        anchor="right"
        open={isDetailsOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '600px',
            bgcolor: '#181818',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {movie.title}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ position: 'relative', mb: 3 }}>
            <CardMedia
              component="img"
              image={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
              alt={movie.title}
              sx={{
                height: '300px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
                borderRadius: '0 0 8px 8px',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handlePlay(movie)}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                  }}
                >
                  Play
                </Button>
                <IconButton
                  onClick={() => toggleMyList(movie)}
                  sx={{
                    bgcolor: isInMyList(movie.id) ? '#E50914' : 'rgba(109, 109, 110, 0.7)',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: isInMyList(movie.id) ? '#F40612' : 'rgba(109, 109, 110, 0.4)',
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(109, 109, 110, 0.7)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
                  }}
                >
                  <ThumbUpIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<LanguageIcon />}
                  onClick={openInTMDB}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  View on TMDB
                </Button>
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {movie.overview}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#FFD700' }} />
              <Typography>{Math.round(movie.vote_average * 10)}% Match</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon />
              <Typography>{formatDuration(movie.runtime || 120)}</Typography>
            </Box>
            {movie.release_date && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon />
                <Typography>{new Date(movie.release_date).getFullYear()}</Typography>
              </Box>
            )}
            {movie.original_language && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon />
                <Typography>{movie.original_language.toUpperCase()}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {movie.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                }}
              />
            ))}
          </Box>

          <Box sx={{ mb: 3 }}>
            {movie.mediaType === 'tv' && (
              <>
                <Select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px', mr: 2 }}
                >
                  {[1, 2, 3, 4, 5].map(season => (
                    <MenuItem key={season} value={season}>
                      Season {season}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(e.target.value)}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}
                >
                  {[1, 2, 3, 4, 5].map(episode => (
                    <MenuItem key={episode} value={episode}>
                      Episode {episode}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </Box>

          {/* Recommendations Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              More Like This
            </Typography>
            {loadingRecommendations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading recommendations...</Typography>
              </Box>
            ) : recommendations.length > 0 ? (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                  },
                },
              }}>
                {recommendations.map((recMovie) => (
                  <Card
                    key={recMovie.id}
                    sx={{
                      flex: '0 0 150px',
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        zIndex: 2,
                      },
                    }}
                    onClick={() => {
                      setSelectedMovie(recMovie);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={`${TMDB_IMAGE_BASE_URL}/w500${recMovie.poster_path}`}
                        alt={recMovie.title}
                        sx={{
                          borderRadius: '4px',
                          aspectRatio: '2/3',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 1,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          borderRadius: '0 0 4px 4px',
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {recMovie.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No recommendations available
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>
    );
  };

  const MovieHoverContent = ({ movie }) => (
    <Paper
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#181818',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          {movie.title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white', 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {movie.overview}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: '#46d369' }}>
            {Math.round(movie.vote_average * 10)}% Match
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            • {formatDuration(movie.runtime || 120)}
          </Typography>
          {movie.release_date && (
            <Typography variant="body2" sx={{ color: 'white' }}>
              • {new Date(movie.release_date).getFullYear()}
            </Typography>
          )}
          {movie.original_language && (
            <Typography variant="body2" sx={{ color: 'white' }}>
              • {movie.original_language.toUpperCase()}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
        <Tooltip title="Play">
          <IconButton
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add to My List">
          <IconButton
            onClick={() => toggleMyList(movie)}
            sx={{
              bgcolor: isInMyList(movie.id) ? '#E50914' : 'rgba(109, 109, 110, 0.7)',
              color: 'white',
              '&:hover': { 
                bgcolor: isInMyList(movie.id) ? '#F40612' : 'rgba(109, 109, 110, 0.4)',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Like">
          <IconButton
            sx={{
              bgcolor: 'rgba(109, 109, 110, 0.7)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
            }}
          >
            <ThumbUpIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="More Info">
          <IconButton
            onClick={() => {
              setSelectedMovie(movie);
              setIsDetailsOpen(true);
            }}
            sx={{
              bgcolor: 'rgba(109, 109, 110, 0.7)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        bgcolor: '#141414',
        minHeight: '100vh',
        position: 'relative',
        padding: { xs: '5px', sm: '10px' },
        animation: 'fadeIn 0.8s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    >
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
            onClick={fetchMovies}
            sx={{
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={() => setIsApiPopupOpen(true)} sx={{ color: 'white', ml: 'auto' }}>
            <LanguageIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8, pb: 2 }}>
        <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
          {isSearching ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'white' }}>
                <Typography variant="h4">Searching...</Typography>
              </Box>
            </Grid>
          ) : searchResults.length > 0 ? (
            <Grid item xs={12}>
              <Box sx={{ px: 2, mb: 2 }}>
                <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                  Search Results
                </Typography>
                <Grid container spacing={1}>
                  {searchResults.map((movie, index) => (
                    <Grid item xs={6} sm={4} md={2} key={movie.id}>
                      <Card
                        sx={{
                          bgcolor: 'transparent',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            zIndex: 2,
                          },
                        }}
                        onMouseEnter={() => setHoveredMovie(`search-${movie.id}-${index}`)}
                        onMouseLeave={() => setHoveredMovie(null)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
                            alt={movie.title}
                            sx={{
                              borderRadius: '4px',
                              aspectRatio: '2/3',
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                          />
                          {hoveredMovie === `search-${movie.id}-${index}` && <MovieHoverContent movie={movie} />}
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          ) : (
            <>
              {contentType !== 'tv' && featuredMovies.some(movie => movie.mediaType === 'movie') && (
                <Grid item xs={12}>
                  <Box sx={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
                    {featuredMovies.map((movie, index) => (
                      <Grid item xs={12} key={movie.id}>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: index === currentFeaturedIndex ? 1 : 0,
                            transform: `translateX(${(index - currentFeaturedIndex) * 100}%)`,
                            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `url(${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                zIndex: -1,
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
                                zIndex: -1,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: '20%',
                                left: '5%',
                                maxWidth: '50%',
                                color: 'white',
                                opacity: isTransitioning ? 0 : 1,
                                transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
                                transition: 'all 0.5s ease-in-out',
                                textAlign: 'left',
                              }}
                            >
                              <Typography 
                                variant="h2" 
                                sx={{ 
                                  mb: 2, 
                                  fontWeight: 'bold',
                                  transform: isTransitioning ? 'scale(0.9)' : 'scale(1)',
                                  transition: 'transform 0.5s ease-in-out',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {movie.title}
                              </Typography>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  mb: 3,
                                  transform: isTransitioning ? 'scale(0.9)' : 'scale(1)',
                                  transition: 'transform 0.5s ease-in-out',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {movie.overview}
                              </Typography>
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  gap: 2,
                                  transform: isTransitioning ? 'scale(0.9)' : 'scale(1)',
                                  transition: 'transform 0.5s ease-in-out',
                                }}
                              >
                                <Tooltip title="Play">
                                  <IconButton
                                    sx={{
                                      bgcolor: 'white',
                                      color: 'black',
                                      '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                                    }}
                                  >
                                    <PlayArrowIcon sx={{ fontSize: 30 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Add to My List">
                                  <IconButton
                                    onClick={() => toggleMyList(movie)}
                                    sx={{
                                      bgcolor: isInMyList(movie.id) ? '#E50914' : 'rgba(109, 109, 110, 0.7)',
                                      color: 'white',
                                      '&:hover': { 
                                        bgcolor: isInMyList(movie.id) ? '#F40612' : 'rgba(109, 109, 110, 0.4)',
                                      },
                                    }}
                                  >
                                    <AddIcon sx={{ fontSize: 30 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Like">
                                  <IconButton
                                    sx={{
                                      bgcolor: 'rgba(109, 109, 110, 0.7)',
                                      color: 'white',
                                      '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
                                    }}
                                  >
                                    <ThumbUpIcon sx={{ fontSize: 30 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="More Info">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedMovie(movie);
                                      setIsDetailsOpen(true);
                                    }}
                                    sx={{
                                      bgcolor: 'rgba(109, 109, 110, 0.7)',
                                      color: 'white',
                                      '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' },
                                    }}
                                  >
                                    <ExpandMoreIcon sx={{ fontSize: 30 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                    
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1,
                        zIndex: 2,
                      }}
                    >
                      {featuredMovies.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: index === currentFeaturedIndex ? '#E50914' : 'rgba(255,255,255,0.5)',
                            transition: 'background-color 0.3s ease-in-out',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: index === currentFeaturedIndex ? '#F40612' : 'rgba(255,255,255,0.7)',
                            },
                          }}
                          onClick={() => {
                            setIsTransitioning(true);
                            setTimeout(() => {
                              setCurrentFeaturedIndex(index);
                              setIsTransitioning(false);
                            }, 500);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              )}

              {myList.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ px: 2, mb: 4 }}>
                    <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                      My List {contentType === 'movies' ? '(Movies)' : contentType === 'tv' ? '(TV Shows)' : ''}
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                      <IconButton
                        onClick={() => handleScroll('myList', 'left')}
                        sx={{
                          position: 'absolute',
                          left: -20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <Box
                        id="category-myList"
                        sx={{
                          display: 'flex',
                          overflowX: 'auto',
                          gap: 1,
                          scrollBehavior: 'smooth',
                          '&::-webkit-scrollbar': {
                            display: 'none',
                          },
                          msOverflowStyle: 'none',
                          scrollbarWidth: 'none',
                        }}
                      >
                        {myList
                          .filter(item => 
                            contentType === 'all' || 
                            (contentType === 'movies' && item.mediaType === 'movie') ||
                            (contentType === 'tv' && item.mediaType === 'tv')
                          )
                          .map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                              <Card
                                sx={{
                                  flex: '0 0 auto',
                                  width: { xs: '120px', sm: '150px', md: '200px' },
                                  bgcolor: 'transparent',
                                  cursor: 'pointer',
                                  transition: 'transform 0.3s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    zIndex: 2,
                                  },
                                }}
                                onMouseEnter={() => setHoveredMovie(`myList-${item.id}-${index}`)}
                                onMouseLeave={() => setHoveredMovie(null)}
                              >
                                <Box sx={{ position: 'relative' }}>
                                  <CardMedia
                                    component="img"
                                    image={`${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`}
                                    alt={item.title}
                                    sx={{
                                      borderRadius: '4px',
                                      aspectRatio: '2/3',
                                    }}
                                  />
                                  {hoveredMovie === `myList-${item.id}-${index}` && <MovieHoverContent movie={item} />}
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                      </Box>
                      <IconButton
                        onClick={() => handleScroll('myList', 'right')}
                        sx={{
                          position: 'absolute',
                          right: -20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              )}

              {(contentType === 'all' || contentType === 'movies') && categories.map((category, categoryIndex) => (
                <Grid item xs={12} key={categoryIndex}>
                  <Box 
                    sx={{ 
                      px: 2, 
                      mb: 4,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: category.backdrop_path ? 
                          `linear-gradient(to bottom, rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0.7)), url(${TMDB_IMAGE_BASE_URL}/original${category.backdrop_path})` : 
                          'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: -1,
                        opacity: 0.3,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'white',
                        mb: 2,
                        fontWeight: 'bold',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {category.title}
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                      <IconButton
                        onClick={() => handleScroll(categoryIndex, 'left')}
                        sx={{
                          position: 'absolute',
                          left: -20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <Box
                        id={`category-${categoryIndex}`}
                        sx={{
                          display: 'flex',
                          overflowX: 'auto',
                          gap: 1,
                          scrollBehavior: 'smooth',
                          '&::-webkit-scrollbar': {
                            display: 'none',
                          },
                          msOverflowStyle: 'none',
                          scrollbarWidth: 'none',
                        }}
                      >
                        {category.movies.map((movie, movieIndex) => (
                          <Grid item xs={12} sm={6} md={4} key={movie.id}>
                            <Card
                              sx={{
                                flex: '0 0 auto',
                                width: { xs: '120px', sm: '150px', md: '200px' },
                                bgcolor: 'transparent',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  zIndex: 2,
                                },
                              }}
                              onMouseEnter={() => setHoveredMovie(`category-${categoryIndex}-${movie.id}-${movieIndex}`)}
                              onMouseLeave={() => setHoveredMovie(null)}
                              onDoubleClick={() => {
                                setSelectedMovie(movie);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                  component="img"
                                  image={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
                                  alt={movie.title}
                                  sx={{
                                    borderRadius: '4px',
                                    aspectRatio: '2/3',
                                  }}
                                />
                                {hoveredMovie === `category-${categoryIndex}-${movie.id}-${movieIndex}` && <MovieHoverContent movie={movie} />}
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Box>
                      <IconButton
                        onClick={() => handleScroll(categoryIndex, 'right')}
                        sx={{
                          position: 'absolute',
                          right: -20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}

              {(contentType === 'all' || contentType === 'tv') && tvCategories.map((category, categoryIndex) => (
                <Grid item xs={12} key={`tv-${categoryIndex}`}>
                  <Box 
                    sx={{ 
                      px: 2, 
                      mb: 4,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: category.backdrop_path ? 
                          `linear-gradient(to bottom, rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0.7)), url(${TMDB_IMAGE_BASE_URL}/original${category.backdrop_path})` : 
                          'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: -1,
                        opacity: 0.3,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'white',
                        mb: 2,
                        fontWeight: 'bold',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {category.title}
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                      <IconButton
                        onClick={() => handleScroll(`tv-${categoryIndex}`, 'left')}
                        sx={{
                          position: 'absolute',
                          left: -20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <Box
                        id={`category-tv-${categoryIndex}`}
                        sx={{
                          display: 'flex',
                          overflowX: 'auto',
                          gap: 1,
                          scrollBehavior: 'smooth',
                          '&::-webkit-scrollbar': {
                            display: 'none',
                          },
                          msOverflowStyle: 'none',
                          scrollbarWidth: 'none',
                        }}
                      >
                        {category.movies.map((show, showIndex) => (
                          <Grid item xs={12} sm={6} md={4} key={show.id}>
                            <Card
                              sx={{
                                flex: '0 0 auto',
                                width: { xs: '120px', sm: '150px', md: '200px' },
                                bgcolor: 'transparent',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  zIndex: 2,
                                },
                              }}
                              onMouseEnter={() => setHoveredMovie(`tv-${categoryIndex}-${show.id}-${showIndex}`)}
                              onMouseLeave={() => setHoveredMovie(null)}
                              onDoubleClick={() => {
                                setSelectedMovie(show);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                  component="img"
                                  image={`${TMDB_IMAGE_BASE_URL}/w500${show.poster_path}`}
                                  alt={show.title}
                                  sx={{
                                    borderRadius: '4px',
                                    aspectRatio: '2/3',
                                  }}
                                />
                                {hoveredMovie === `tv-${categoryIndex}-${show.id}-${showIndex}` && <MovieHoverContent movie={show} />}
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Box>
                      <IconButton
                        onClick={() => handleScroll(`tv-${categoryIndex}`, 'right')}
                        sx={{
                          position: 'absolute',
                          right: -20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Box>
      
      {selectedMovie && (
        <MovieDetailsTab
          movie={selectedMovie}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedMovie(null);
          }}
        />
      )}

      <Box
        sx={{ 
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '10px',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'transform 0.3s ease',
        }}
      >
        <ToggleButtonGroup
          value={contentType}
          exclusive
          onChange={handleContentTypeChange}
          aria-label="content toggle"
        >
          <ToggleButton 
            value="all" 
            aria-label="all content"
            sx={{
              color: contentType === 'all' ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transition: 'color 0.3s ease',
            }}
          >
            All
          </ToggleButton>
          <ToggleButton 
            value="movies" 
            aria-label="movies only"
            sx={{
              color: contentType === 'movies' ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transition: 'color 0.3s ease',
            }}
          >
            Movies
          </ToggleButton>
          <ToggleButton 
            value="tv" 
            aria-label="tv shows only"
            sx={{
              color: contentType === 'tv' ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transition: 'color 0.3s ease',
            }}
          >
            TV Shows
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Black Faded Texture at Bottom */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25px', // Set height to 25px
          bgcolor: 'rgba(0, 0, 0, 0.5)', // Reduced opacity
          zIndex: 999, // Ensure it's above other content
          backdropFilter: 'blur(10px)', // Add blur effect
        }}
      />

      {/* API Source Popup */}
      <ApiSourcePopup
        open={isApiPopupOpen}
        onClose={() => setIsApiPopupOpen(false)}
        currentApi={apiSource}
        onApiChange={(newApi) => {
          setApiSource(newApi);
        }}
        apiSources={apiSources}
      />
    </Box>
  );
}

export default NetflixPage; 