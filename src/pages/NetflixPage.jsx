import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, useMediaQuery, useTheme, Fade, Skeleton } from '@mui/material';

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

const movieCategories = [
  { title: 'Trending Now', endpoint: '/trending/movie/week' },
  { title: 'Popular on Netflix', endpoint: '/movie/popular' },
  { title: 'New Releases', endpoint: '/movie/now_playing' },
  { title: 'Top Rated', endpoint: '/movie/top_rated' },
  { title: 'Action Movies', endpoint: '/discover/movie', params: { with_genres: '28' } },
  { title: 'Comedy Movies', endpoint: '/discover/movie', params: { with_genres: '35' } }
];

const tvShowCategories = [
  { title: 'Trending TV Shows', endpoint: '/trending/tv/week' },
  { title: 'Popular TV Shows', endpoint: '/tv/popular' },
  { title: 'Top Rated TV Shows', endpoint: '/tv/top_rated' },
  { title: 'Netflix Originals', endpoint: '/discover/tv', params: { with_networks: '213' } },
  { 
    title: 'Trending Anime', 
    endpoint: '/discover/tv',
    params: {
      with_genres: '16',
      with_origin_country: 'JP',
      sort_by: 'popularity.desc'
    }
  },
  { title: 'Crime TV Shows', endpoint: '/discover/tv', params: { with_genres: '80' } }
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
    if (movie.absoluteEpisodeNumber && movie.absoluteEpisodeNumber !== null) {
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
    url = `${selectedApi.url}/movie/${movie.id}?autoPlay=true`;
  }
  
  return url;
};

// Loading skeleton component
const CategorySkeleton = () => (
  <Box sx={{ mb: 6, px: { xs: 2, sm: 3 } }}>
    <Skeleton 
      variant="text" 
      width={200} 
      height={40} 
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} 
    />
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'hidden' }}>
      {[...Array(6)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={220}
          height={330}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '8px',
            flex: '0 0 auto'
          }}
        />
      ))}
    </Box>
  </Box>
);

function NetflixPage() {
  // State for content display
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tvCategories, setTvCategories] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [contentType, setContentType] = useState('all');
  
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
  const [apiSource, setApiSource] = useState('tmdb');
  const [isApiPopupOpen, setIsApiPopupOpen] = useState(false);
  
  // TV Show specifics
  const [selectedSeason, setSelectedSeason] = useState('1');
  const [selectedEpisode, setSelectedEpisode] = useState('1');
  const [showDetails, setShowDetails] = useState(null);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [totalSeasons, setTotalSeasons] = useState(0);
  const [seasonDetails, setSeasonDetails] = useState([]);

  // Responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Auto-rotate featured content
  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => 
          prev === featuredMovies.length - 1 ? 0 : prev + 1
        );
      }, 8000); // Change every 8 seconds

      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

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
    if (movie.mediaType === 'tv') {
      const updatedMovie = {
        ...movie,
        currentSeason: movie.currentSeason || 1,
        currentEpisode: movie.currentEpisode || 1,
        absoluteEpisodeNumber: movie.absoluteEpisodeNumber || null
      };
      
      const url = getVideoUrl(updatedMovie, apiSource);
      
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
    
    const seasonEpisodes = seasonDetails[currentSeason - 1]?.episodes?.length || 0;
    
    let nextSeason = currentSeason;
    let nextEpisode = currentEpisode + 1;
    
    if (nextEpisode > seasonEpisodes) {
      nextSeason = currentSeason + 1;
      nextEpisode = 1;
      
      if (nextSeason > totalSeasons) {
        nextSeason = 1;
      }
    }
    
    const updatedMovie = {
      ...selectedMovie,
      currentSeason: nextSeason,
      currentEpisode: nextEpisode,
      absoluteEpisodeNumber: null
    };
    
    setSelectedSeason(nextSeason);
    setSelectedEpisode(nextEpisode);
    
    const newUrl = getVideoUrl(updatedMovie, apiSource);
    setSelectedMovie(updatedMovie);
    setCurrentVideoUrl(newUrl);
  }, [selectedMovie, seasonDetails, totalSeasons, apiSource]);

  const handlePlayEpisode = useCallback((episodeNumber, seasonNumber) => {
    if (!selectedMovie || selectedMovie.mediaType !== 'tv' || !episodeNumber) return;
    
    let targetSeason = seasonNumber;
    let targetEpisode = episodeNumber;
    
    if (seasonNumber === undefined) {
      let episodesCount = 0;
      
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
      if (targetSeason > totalSeasons) {
        targetSeason = 1;
        targetEpisode = 1;
      }
      
      const maxEpisodes = seasonDetails[targetSeason - 1]?.episodes?.length || 0;
      if (targetEpisode > maxEpisodes) {
        targetEpisode = 1;
      }
    }
    
    const updatedMovie = {
      ...selectedMovie,
      currentSeason: targetSeason,
      currentEpisode: targetEpisode,
      absoluteEpisodeNumber: seasonNumber === undefined ? episodeNumber : null
    };
    
    setSelectedSeason(targetSeason);
    setSelectedEpisode(targetEpisode);
    
    const newUrl = getVideoUrl(updatedMovie, apiSource);
    setSelectedMovie(updatedMovie);
    setCurrentVideoUrl(newUrl);
  }, [selectedMovie, seasonDetails, totalSeasons, apiSource]);

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

      const [featuredContent, movieCategoriesData, tvCategoriesData] = await Promise.all([
        fetchFeaturedContent(),
        fetchCategoriesData(movieCategories, 'movie'),
        fetchCategoriesData(tvShowCategories, 'tv')
      ]);

      setFeaturedMovies(featuredContent);
      setCategories(movieCategoriesData);
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

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

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

  useEffect(() => {
    const userData = userDataManager.getUserData();
    setMyList(userData.myList);
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

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: '#141414',
        minHeight: '100vh',
        pt: 8
      }}>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          handleClearSearch={handleClearSearch}
          handleRefresh={fetchMovies}
          handleApiPopupOpen={handleApiPopupOpen}
        />
        
        {/* Featured content skeleton */}
        <Box sx={{ mb: 6 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height="80vh"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: { xs: 0, sm: '16px' },
              mx: { xs: 0, sm: 2 }
            }}
          />
        </Box>

        {/* Category skeletons */}
        {[...Array(4)].map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
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
        <Typography variant="h4">Error Loading Content</Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  const getContentFilter = () => {
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
        overflow: 'hidden auto',
        scrollBehavior: 'smooth'
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

      {/* Main Content */}
      <Box sx={{ pt: { xs: 9, sm: 8 }, pb: 10 }}>
        {isSearching ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh', 
            color: 'white' 
          }}>
            <Typography variant="h4">Searching...</Typography>
          </Box>
        ) : searchResults.length > 0 ? (
          <Fade in timeout={500}>
            <div>
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
            </div>
          </Fade>
        ) : (
          <Fade in timeout={800}>
            <div>
              {/* Featured Content */}
              {contentType !== 'tv' && featuredMovies.some(movie => movie.mediaType === 'movie') && (
                <Box sx={{ mb: { xs: 4, sm: 6 } }}>
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
                </Box>
              )}

              {/* My List */}
              {myList.length > 0 && (
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
              )}

              {/* Movie Categories */}
              {(contentType === 'all' || contentType === 'movies') && categories.map((category, categoryIndex) => (
                <MovieList
                  key={`movie-${categoryIndex}`}
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
              ))}

              {/* TV Show Categories */}
              {(contentType === 'all' || contentType === 'tv') && tvCategories.map((category, categoryIndex) => (
                <MovieList
                  key={`tv-${categoryIndex}`}
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
              ))}
            </div>
          </Fade>
        )}
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
        seasonDetails={seasonDetails}
        totalSeasons={totalSeasons}
        totalEpisodes={totalEpisodes}
      />
    </Box>
  );
}

export default NetflixPage;