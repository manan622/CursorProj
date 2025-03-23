import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, IconButton, Paper, AppBar, Toolbar, TextField, InputAdornment, Tooltip, Drawer, Button, Chip, ToggleButton, ToggleButtonGroup, Select, MenuItem, useMediaQuery, Dialog, DialogTitle, DialogContent } from '@mui/material';
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
import InfoIcon from '@mui/icons-material/Info';

// Components
import Header from '../components/Netflix/Header';
import FeaturedContent from '../components/Netflix/FeaturedContent';
import MovieList from '../components/Netflix/MovieList';
import MovieDetails from '../components/Netflix/MovieDetails';
import ContentTypeToggle from '../components/Netflix/ContentTypeToggle';
import VideoPlayer from '../components/Netflix/VideoPlayer';
import SearchResults from '../components/Netflix/SearchResults';
import ApiSourcePopup from '../components/Netflix/ApiSourcePopup';

// Services and Utils
import { fetchFeaturedContent, fetchCategoriesData, fetchShowDetails } from '../services/tmdbService';
import { 
  formatDuration, 
  searchContent, 
  movieTypeFilter,
  tvTypeFilter,
  allTypeFilter
} from '../utils/netflixUtils';

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

const apiSources = [
  { id: 'tmdb', name: 'TMDB (Default)', url: 'https://moviesapi.club' },
  { id: 'netflix', name: 'Netflix API', url: 'https://player.autoembed.cc/embed' },
  { id: 'hulu', name: 'Hulu API', url: 'https://vidsrc.cc/v2/embed' },
  { id: 'prime', name: 'Prime Video API', url: 'https://vidlink.pro' },
  { id: 'Hotstar', name: 'Hotstar API', url: 'https://embed.su/embed' },
];

function NetflixPage() {
  // State for content display
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tvCategories, setTvCategories] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [contentType, setContentType] = useState('all'); // 'all', 'movies', 'tv'
  
  // UI state
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // User personalization
  const [myList, setMyList] = useState([]);
  
  // Details and player
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [apiSource, setApiSource] = useState('tmdb'); // Default API source
  const [isApiPopupOpen, setIsApiPopupOpen] = useState(false);
  
  // TV Show specifics
  const [selectedSeason, setSelectedSeason] = useState('1');
  const [selectedEpisode, setSelectedEpisode] = useState('1');
  const [showDetails, setShowDetails] = useState(null);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [totalSeasons, setTotalSeasons] = useState(0);
  const [seasonDetails, setSeasonDetails] = useState([]);

  // Responsive design
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Handlers
  const handleContentTypeChange = (event, newContentType) => {
    if (newContentType !== null) {
      setContentType(newContentType);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleMyList = useCallback((movie) => {
    setMyList(prevList => {
      const isInList = prevList.some(m => m.id === movie.id);
      if (isInList) {
        return prevList.filter(m => m.id !== movie.id);
      } else {
        return [...prevList, movie];
      }
    });
  }, []);

  const isInMyList = useCallback((movieId) => {
    return myList.some(movie => movie.id === movieId);
  }, [myList]);

  // Generate video URL based on movie/show and numbering mode
  const getVideoUrl = useCallback((movie, apiSourceId) => {
    const selectedApi = apiSources.find(api => api.id === apiSourceId);
    let url;
    
    if (movie.mediaType === 'tv') {
      // Check if we have a valid absolute episode number to use
      if (movie.absoluteEpisodeNumber && movie.absoluteEpisodeNumber !== null) {
        // Using absolute numbering mode - pass only the absolute number for all API sources
        if (apiSourceId === 'hulu' || apiSourceId === 'prime' || apiSourceId === 'Hotstar') {
          url = `${selectedApi.url}/tv/${movie.id}/${selectedSeason}/${movie.absoluteEpisodeNumber}`;
        } else {
          url = `${selectedApi.url}/tv/${movie.id}-${selectedSeason}-${movie.absoluteEpisodeNumber}`;
        }
      } else {
        // Using regular season/episode numbering
        const season = movie.currentSeason || selectedSeason;
        const episode = movie.currentEpisode || selectedEpisode;
        
        if (apiSourceId === 'hulu' || apiSourceId === 'prime' || apiSourceId === 'Hotstar') {
          url = `${selectedApi.url}/tv/${movie.id}/${season}/${episode}`;
        } else {
          url = `${selectedApi.url}/tv/${movie.id}-${season}-${episode}`;
        }
      }
    } else {
      // For movies, just use the movie ID
      url = `${selectedApi.url}/movie/${movie.id}`;
    }
    
    return url;
  }, [selectedSeason, selectedEpisode]);

  const handlePlay = useCallback((movie) => {
    // Debug: Log whether we're using absolute numbering or not
    if (movie.mediaType === 'tv') {
      console.log("Playing TV episode with:", {
        absoluteNumbering: movie.absoluteEpisodeNumber ? "yes" : "no",
        absoluteEpisodeNumber: movie.absoluteEpisodeNumber,
        season: movie.currentSeason,
        episode: movie.currentEpisode
      });
    }
    
    const url = getVideoUrl(movie, apiSource);
    console.log("Generated video URL:", url);
    
    setCurrentVideoUrl(url);
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
  }, [apiSource, getVideoUrl]);

  // Effect to update the video URL when the API source changes
  useEffect(() => {
    if (isPlayerOpen && selectedMovie) {
      // Only update the URL if the player is already open
      const url = getVideoUrl(selectedMovie, apiSource);
      setCurrentVideoUrl(url);
      
      // Don't set isPlayerOpen here, as we don't want to open the player
      // when only the API source changes
    }
  }, [apiSource, selectedMovie, isPlayerOpen, getVideoUrl]);

  const handleApiPopupOpen = () => {
    setIsApiPopupOpen(true);
  };

  const handleApiPopupClose = () => {
    setIsApiPopupOpen(false);
  };

  // Data fetching
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured content
      const featuredContent = await fetchFeaturedContent();
      setFeaturedMovies(featuredContent);

      // Fetch movie categories
      const movieCategoriesData = await fetchCategoriesData(movieCategories, 'movie');
      setCategories(movieCategoriesData);

      // Fetch TV show categories
      const tvCategoriesData = await fetchCategoriesData(tvShowCategories, 'tv');
      setTvCategories(tvCategoriesData);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchContent(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching content:', error);
      setError(error.message);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Fetch data when component mounts or API source changes
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  // Fetch TV show details when selected movie changes
  useEffect(() => {
    if (selectedMovie && selectedMovie.mediaType === 'tv') {
      const fetchTvShowDetails = async () => {
        try {
          const details = await fetchShowDetails(selectedMovie.id);
          setShowDetails(details.showDetails);
          setTotalEpisodes(details.totalEpisodes);
          setTotalSeasons(details.totalSeasons);
          setSeasonDetails(details.seasonDetails);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

      fetchTvShowDetails();
    }
  }, [selectedMovie]);

  // Loading and error states
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
      </Box>
    );
  }

  // Render appropriate filter based on content type
  const getContentFilter = (mediaType) => {
    switch (contentType) {
      case 'movies': return movieTypeFilter;
      case 'tv': return tvTypeFilter;
      default: return allTypeFilter;
    }
  };

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
        scrollBehavior: 'smooth',
        overflowY: 'auto',
        height: '100vh',
      }}
    >
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        handleRefresh={fetchMovies}
        handleApiPopupOpen={handleApiPopupOpen}
      />

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
              {/* Search Results */}
              <SearchResults
                searchResults={searchResults}
                hoveredMovie={hoveredMovie}
                setHoveredMovie={setHoveredMovie}
                handlePlay={handlePlay}
                toggleMyList={toggleMyList}
                isInMyList={isInMyList}
                formatDuration={formatDuration}
                setSelectedMovie={setSelectedMovie}
                setIsDetailsOpen={setIsDetailsOpen}
              />
            </Grid>
          ) : (
            <>
              {/* Featured Content */}
              {contentType !== 'tv' && featuredMovies.some(movie => movie.mediaType === 'movie') && (
                <Grid item xs={12}>
                  <FeaturedContent
                    featuredMovies={featuredMovies}
                    currentFeaturedIndex={currentFeaturedIndex}
                    setCurrentFeaturedIndex={setCurrentFeaturedIndex}
                    handlePlay={handlePlay}
                    toggleMyList={toggleMyList}
                    isInMyList={isInMyList}
                    setSelectedMovie={setSelectedMovie}
                    setIsDetailsOpen={setIsDetailsOpen}
                  />
                </Grid>
              )}

              {/* My List */}
              {myList.length > 0 && (
                <Grid item xs={12}>
                  <MovieList
                    title="My List"
                    movies={myList}
                    categoryId="myList"
                    hoveredMovie={hoveredMovie}
                    setHoveredMovie={setHoveredMovie}
                    handlePlay={handlePlay}
                    toggleMyList={toggleMyList}
                    isInMyList={isInMyList}
                    formatDuration={formatDuration}
                    setSelectedMovie={setSelectedMovie}
                    setIsDetailsOpen={setIsDetailsOpen}
                    contentFilter={getContentFilter()}
                  />
                </Grid>
              )}

              {/* Movie Categories */}
              {(contentType === 'all' || contentType === 'movies') && categories.map((category, categoryIndex) => (
                <Grid item xs={12} key={categoryIndex}>
                  <MovieList
                    title={category.title}
                    movies={category.movies}
                    categoryId={`category-${categoryIndex}`}
                    backdropPath={category.backdrop_path}
                    hoveredMovie={hoveredMovie}
                    setHoveredMovie={setHoveredMovie}
                    handlePlay={handlePlay}
                    toggleMyList={toggleMyList}
                    isInMyList={isInMyList}
                    formatDuration={formatDuration}
                    setSelectedMovie={setSelectedMovie}
                    setIsDetailsOpen={setIsDetailsOpen}
                  />
                </Grid>
              ))}

              {/* TV Show Categories */}
              {(contentType === 'all' || contentType === 'tv') && tvCategories.map((category, categoryIndex) => (
                <Grid item xs={12} key={`tv-${categoryIndex}`}>
                  <MovieList
                    title={category.title}
                    movies={category.movies}
                    categoryId={`tv-category-${categoryIndex}`}
                    backdropPath={category.backdrop_path}
                    hoveredMovie={hoveredMovie}
                    setHoveredMovie={setHoveredMovie}
                    handlePlay={handlePlay}
                    toggleMyList={toggleMyList}
                    isInMyList={isInMyList}
                    formatDuration={formatDuration}
                    setSelectedMovie={setSelectedMovie}
                    setIsDetailsOpen={setIsDetailsOpen}
                  />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Box>
      
      {/* Movie Details */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedMovie(null);
          }}
          handlePlay={handlePlay}
          toggleMyList={toggleMyList}
          isInMyList={isInMyList}
          formatDuration={formatDuration}
          setSelectedMovie={setSelectedMovie}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          selectedEpisode={selectedEpisode}
          setSelectedEpisode={setSelectedEpisode}
          showDetails={showDetails}
          totalSeasons={totalSeasons}
          seasonDetails={seasonDetails}
        />
      )}

      {/* Content Type Toggle */}
      <ContentTypeToggle 
        contentType={contentType}
        handleContentTypeChange={handleContentTypeChange}
      />

      {/* Footer Shadow */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25px',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* API Source Popup */}
      <ApiSourcePopup
        open={isApiPopupOpen}
        onClose={handleApiPopupClose}
        currentApi={apiSource}
        onApiChange={(newApi) => {
          setApiSource(newApi);
        }}
        apiSources={apiSources}
      />

      {/* Video Player */}
      <VideoPlayer
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={currentVideoUrl}
        onApiPopupOpen={handleApiPopupOpen}
      />
    </Box>
  );
}

export default NetflixPage; 