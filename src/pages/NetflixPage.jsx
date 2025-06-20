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
import userDataManager from '../utils/userDataManager';

const TMDB_API_KEY = 'da914409e3ab4f883504dc0dbf9d9917';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const movieCategories = [
  { title: 'Trending Now', endpoint: '/trending/movie/week' },
  { title: 'Popular on Netflix', endpoint: '/movie/popular' },
  { title: 'New Releases', endpoint: '/movie/now_playing' },
  { title: 'Top Rated', endpoint: '/movie/top_rated' }
];

const tvShowCategories = [
  { title: 'Trending TV Shows', endpoint: '/trending/tv/week' },
  { title: 'Popular TV Shows', endpoint: '/tv/popular' },
  { title: 'Top Rated TV Shows', endpoint: '/tv/top_rated' },
  { 
    title: 'Trending Anime', 
    endpoint: '/discover/tv',
    params: {
      with_genres: '16', // Animation genre
      with_origin_country: 'JP', // Japanese content
      sort_by: 'popularity.desc',
      first_air_date_year: new Date().getFullYear(), // Current year
      with_status: '0' // Returning series
    }
  }
];

export const apiSources = [
  { id: 'tmdb', name: 'TMDB (Default)', url: 'https://moviesapi.club' },
  { id: 'netflix', name: 'Netflix API', url: 'https://player.autoembed.cc/embed' },
  { id: 'hulu', name: 'Hulu API', url: 'https://vidsrc.cc/v2/embed' },
  { id: 'prime', name: 'Prime Video API', url: 'https://vidlink.pro' },
  { id: 'Hotstar', name: 'Hotstar API', url: 'https://embed.su/embed' },
  { id: 'multiembed', name: 'MultiEmbed API', url: 'https://multiembed.mov' },
  { id: '2embed', name: '2Embed API', url: 'https://2embed.cc/embed' },
  { id: 'videasy', name: 'Videasy API', url: 'https://player.videasy.net' },
  { id: 'vidfast', name: 'Vidfast API', url: 'https://vidfast.pro' },
];

export const getVideoUrl = (movie, apiSourceId) => {
  const selectedApi = apiSources.find(api => api.id === apiSourceId);
  let url;
  
  if (movie.mediaType === 'tv') {
    // Check if we have a valid absolute episode number to use
    if (movie.absoluteEpisodeNumber && movie.absoluteEpisodeNumber !== null) {
      // Using absolute numbering mode - pass only the absolute number for all API sources
      if (apiSourceId === 'hulu' || apiSourceId === 'prime' || apiSourceId === 'Hotstar') {
        url = `${selectedApi.url}/tv/${movie.id}/${movie.currentSeason}/${movie.absoluteEpisodeNumber}?autoPlay=true`;
      } else if (apiSourceId === 'multiembed') {
        url = `${selectedApi.url}/directstream.php?video_id=${movie.id}&tmdb=1&s=${movie.currentSeason}&e=${movie.absoluteEpisodeNumber}&autoPlay=true`;
      } else if (apiSourceId === '2embed') {
        url = `${selectedApi.url}tv/${movie.id}&s=${movie.currentSeason}&e=${movie.absoluteEpisodeNumber}&autoPlay=true`;
      } else if (apiSourceId === 'videasy') {
        url = `${selectedApi.url}/tv/${movie.id}/${movie.currentSeason}/${movie.absoluteEpisodeNumber}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&color=8B5CF6&autoPlay=true`;
      } else if (apiSourceId === 'vidfast') {
        url = `${selectedApi.url}/tv/${movie.id}/${movie.currentSeason}/${movie.absoluteEpisodeNumber}?nextButton=true&autoNext=true&autoPlay=true`;
      } else {
        url = `${selectedApi.url}/tv/${movie.id}-${movie.currentSeason}-${movie.absoluteEpisodeNumber}?autoPlay=true`;
      }
    } else {
      // Using regular season/episode numbering
      const season = movie.currentSeason;
      const episode = movie.currentEpisode;
      
      if (apiSourceId === 'hulu' || apiSourceId === 'prime' || apiSourceId === 'Hotstar') {
        url = `${selectedApi.url}/tv/${movie.id}/${season}/${episode}?autoPlay=true`;
      } else if (apiSourceId === 'multiembed') {
        url = `${selectedApi.url}/directstream.php?video_id=${movie.id}&tmdb=1&s=${season}&e=${episode}&autoPlay=true`;
      } else if (apiSourceId === '2embed') {
        url = `${selectedApi.url}tv/${movie.id}&s=${season}&e=${episode}&autoPlay=true`;
      } else if (apiSourceId === 'videasy') {
        url = `${selectedApi.url}/tv/${movie.id}/${season}/${episode}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&color=8B5CF6&autoPlay=true`;
      } else if (apiSourceId === 'vidfast') {
        url = `${selectedApi.url}/tv/${movie.id}/${season}/${episode}?nextButton=true&autoNext=true&autoPlay=true`;
      } else {
        url = `${selectedApi.url}/tv/${movie.id}-${season}-${episode}?autoPlay=true`;
      }
    }
  } 
  else if (apiSourceId === 'multiembed') {
    url = `${selectedApi.url}/directstream.php?video_id=${movie.id}&tmdb=1&autoPlay=true`;
  } else if (apiSourceId === '2embed') {
    url = `${selectedApi.url}/${movie.id}?autoPlay=true`;
  } else if (apiSourceId === 'videasy') {
    url = `${selectedApi.url}/movie/${movie.id}?color=8B5CF6&autoPlay=true`;
  } else if (apiSourceId === 'vidfast') {
    url = `${selectedApi.url}/movie/${movie.id}?autoPlay=true`;
  } else {
    // For movies, just use the movie ID
    url = `${selectedApi.url}/movie/${movie.id}?autoPlay=true`;
  }
  
  return url;
};

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

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleMyList = (movie) => {
    const isInList = myList.some(item => item.id === movie.id);
    if (isInList) {
      setMyList(myList.filter(item => item.id !== movie.id));
      userDataManager.removeFromMyList(movie.id);
    } else {
      setMyList([...myList, movie]);
      userDataManager.addToMyList(movie);
    }
  };

  const isInMyList = useCallback((movieId) => {
    return myList.some(movie => movie.id === movieId);
  }, [myList]);

  const handlePlay = useCallback((movie) => {
    // Debug: Log whether we're using absolute numbering or not
    if (movie.mediaType === 'tv') {
      console.log("Playing TV episode with:", {
        absoluteNumbering: movie.absoluteEpisodeNumber ? "yes" : "no",
        absoluteEpisodeNumber: movie.absoluteEpisodeNumber,
        season: movie.currentSeason || 1,
        episode: movie.currentEpisode || 1
      });

      // Ensure TV show has proper episode information
      const updatedMovie = {
        ...movie,
        currentSeason: movie.currentSeason || 1,
        currentEpisode: movie.currentEpisode || 1,
        absoluteEpisodeNumber: movie.absoluteEpisodeNumber || null
      };
      
      const url = getVideoUrl(updatedMovie, apiSource);
      console.log("Generated video URL:", url);
      
      if (url) {
        setCurrentVideoUrl(url);
        setSelectedMovie(updatedMovie);
        setIsPlayerOpen(true);
      } else {
        setSelectedMovie(updatedMovie);
        setIsDetailsOpen(true);
      }
    } else {
      const url = getVideoUrl(movie, apiSource);
      console.log("Generated video URL:", url);
      
      if (url) {
        setCurrentVideoUrl(url);
        setSelectedMovie(movie);
        setIsPlayerOpen(true);
      } else {
        setSelectedMovie(movie);
        setIsDetailsOpen(true);
      }
    }
  }, [apiSource]);

  const handleNextEpisode = useCallback(() => {
    if (!selectedMovie || selectedMovie.mediaType !== 'tv') return;
    
    const currentSeason = selectedMovie.currentSeason || 1;
    const currentEpisode = selectedMovie.currentEpisode || 1;
    
    // Get the total episodes in the current season
    const seasonEpisodes = seasonDetails[currentSeason - 1]?.episodes?.length || 0;
    
    let nextSeason = currentSeason;
    let nextEpisode = currentEpisode + 1;
    
    // If we're at the end of the season, move to the next season
    if (nextEpisode > seasonEpisodes) {
      nextSeason = currentSeason + 1;
      nextEpisode = 1;
      
      // If we're at the end of the series, wrap back to season 1
      if (nextSeason > totalSeasons) {
        nextSeason = 1;
      }
    }
    
    // Update the selected movie with new episode info
    const updatedMovie = {
      ...selectedMovie,
      currentSeason: nextSeason,
      currentEpisode: nextEpisode,
      absoluteEpisodeNumber: null // Reset absolute numbering when using next episode
    };
    
    // Update states
    setSelectedSeason(nextSeason);
    setSelectedEpisode(nextEpisode);
    
    // Generate new video URL and update player
    const newUrl = getVideoUrl(updatedMovie, apiSource);
    setSelectedMovie(updatedMovie);
    setCurrentVideoUrl(newUrl);
  }, [selectedMovie, seasonDetails, totalSeasons, apiSource]);

  const handlePlayEpisode = useCallback((episodeNumber, seasonNumber) => {
    if (!selectedMovie || selectedMovie.mediaType !== 'tv' || !episodeNumber) return;
    
    let targetSeason = seasonNumber;
    let targetEpisode = episodeNumber;
    
    // If no season is provided, use absolute episode numbering
    if (seasonNumber === undefined) {
      let episodesCount = 0;
      
      // Find the correct season and episode
      for (let i = 0; i < seasonDetails.length; i++) {
        const seasonEpisodes = seasonDetails[i]?.episodes?.length || 0;
        if (episodesCount + seasonEpisodes >= episodeNumber) {
          targetSeason = i + 1;
          targetEpisode = episodeNumber - episodesCount;
          break;
        }
        episodesCount += seasonEpisodes;
      }
    } else {
      // Validate season number
      if (targetSeason > totalSeasons) {
        targetSeason = 1;
        targetEpisode = 1;
      }
      
      // Validate episode number for the selected season
      const maxEpisodes = seasonDetails[targetSeason - 1]?.episodes?.length || 0;
      if (targetEpisode > maxEpisodes) {
        targetEpisode = 1;
      }
    }
    
    // Update the selected movie with new episode info
    const updatedMovie = {
      ...selectedMovie,
      currentSeason: targetSeason,
      currentEpisode: targetEpisode,
      absoluteEpisodeNumber: seasonNumber === undefined ? episodeNumber : null // Only set absolute number if season wasn't provided
    };
    
    // Update states
    setSelectedSeason(targetSeason);
    setSelectedEpisode(targetEpisode);
    
    // Generate new video URL and update player
    const newUrl = getVideoUrl(updatedMovie, apiSource);
    setSelectedMovie(updatedMovie);
    setCurrentVideoUrl(newUrl);
  }, [selectedMovie, seasonDetails, totalSeasons, apiSource]);

  // Add effect to update video URL when API source changes
  useEffect(() => {
    if (selectedMovie && isPlayerOpen) {
      const newUrl = getVideoUrl(selectedMovie, apiSource);
      setCurrentVideoUrl(newUrl);
    }
  }, [apiSource, selectedMovie, isPlayerOpen]);

  const handleApiPopupOpen = () => {
    setIsApiPopupOpen(true);
  };

  const handleApiPopupClose = () => {
    setIsApiPopupOpen(false);
  };

  const handleApiChange = (newApi) => {
    setApiSource(newApi);
    if (selectedMovie && isPlayerOpen) {
      const newUrl = getVideoUrl(selectedMovie, newApi);
      setCurrentVideoUrl(newUrl);
    }
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

  // Add useEffect to load user data
  useEffect(() => {
    const userData = userDataManager.getUserData();
    setMyList(userData.myList);
    // You can load other user data here as needed
  }, []);

  const fetchMoreMovies = async (categoryId, page, mediaType = 'movie') => {
    try {
      const category = mediaType === 'movie' 
        ? movieCategories.find(cat => cat.title === categoryId)
        : tvShowCategories.find(cat => cat.title === categoryId);

      if (!category) return;

      const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: page.toString(),
        ...category.params
      });

      const response = await fetch(
        `${TMDB_BASE_URL}${category.endpoint}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more ${mediaType}s: ${response.status}`);
      }

      const data = await response.json();
      const newMovies = data.results.map(item => ({
        ...item,
        mediaType: mediaType,
        title: mediaType === 'tv' ? item.name : item.title,
        release_date: mediaType === 'tv' ? item.first_air_date : item.release_date
      }));

      if (mediaType === 'movie') {
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.title === categoryId
              ? { ...cat, movies: [...cat.movies, ...newMovies] }
              : cat
          )
        );
      } else {
        setTvCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.title === categoryId
              ? { ...cat, movies: [...cat.movies, ...newMovies] }
              : cat
          )
        );
      }
    } catch (error) {
      console.error(`Error fetching more ${mediaType}s:`, error);
    }
  };

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
        setSearchQuery={handleSearchQueryChange}
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
                    onLoadMore={(page) => fetchMoreMovies(category.title, page, 'movie')}
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
                    onLoadMore={(page) => fetchMoreMovies(category.title, page, 'tv')}
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
        onApiChange={handleApiChange}
        apiSources={apiSources}
      />

      {/* Video Player */}
      <VideoPlayer
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={currentVideoUrl}
        onApiPopupOpen={handleApiPopupOpen}
        onNextEpisode={handleNextEpisode}
        showNextButton={selectedMovie?.mediaType === 'tv'}
        onPlayEpisode={handlePlayEpisode}
        currentSeason={selectedMovie?.currentSeason}
        currentEpisode={selectedMovie?.currentEpisode}
      />
    </Box>
  );
}

export default NetflixPage; 