import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Select, MenuItem, FormControlLabel, Switch, Chip, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import ApiSourcePopup from './ApiSourcePopup';
import styled from 'styled-components';

const TMDB_API_KEY = 'da914409e3ab4f883504dc0dbf9d9917';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Import apiSources and getVideoUrl from NetflixPage
import { apiSources, getVideoUrl } from '../../pages/NetflixPage';

const BlankPageTemplate = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const location = useLocation();
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [useAbsoluteNumbering, setUseAbsoluteNumbering] = useState(() => {
    const storedMode = localStorage.getItem('useAbsoluteNumbering');
    return storedMode === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [apiSource, setApiSource] = useState('tmdb');
  const [isApiPopupOpen, setIsApiPopupOpen] = useState(false);
  const [seasonDetails, setSeasonDetails] = useState([]);
  const [totalSeasons, setTotalSeasons] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [showDetails, setShowDetails] = useState(null);
  const [lastPlayedEpisode, setLastPlayedEpisode] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // If we have movie data in location state, use it
        if (location.state?.movie) {
          const stateMovie = location.state.movie;
          
          // If it's a TV show, fetch season details
          if (stateMovie.mediaType === 'tv') {
            const seasonPromises = [];
            for (let i = 1; i <= stateMovie.totalSeasons; i++) {
              seasonPromises.push(
                fetch(`${TMDB_BASE_URL}/tv/${movieId}/season/${i}?api_key=${TMDB_API_KEY}`)
                  .then(res => res.json())
              );
            }
            
            const seasonDetails = await Promise.all(seasonPromises);
            stateMovie.seasonDetails = seasonDetails.map(season => ({
              season_number: season.season_number,
              name: season.name,
              overview: season.overview,
              air_date: season.air_date,
              poster_path: season.poster_path,
              episodes: season.episodes.map(episode => ({
                episode_number: episode.episode_number,
                name: episode.name,
                overview: episode.overview,
                still_path: episode.still_path,
                air_date: episode.air_date,
                vote_average: episode.vote_average,
                runtime: episode.runtime
              }))
            }));
          }

          setMovieData(stateMovie);
          setIsLoading(false);
          return;
        }
        
        // If no state data, fetch from API
        let response = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar`
        );
        let data = await response.json();

        if (data.success === false) {
          response = await fetch(
            `${TMDB_BASE_URL}/tv/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar`
          );
          data = await response.json();
          
          if (data.success === false) {
            throw new Error('Movie or TV show not found');
          }
          
          data.mediaType = 'tv';
        } else {
          data.mediaType = 'movie';
        }

        const formattedMovieData = {
          ...data,
          id: data.id,
          title: data.title || data.name,
          overview: data.overview,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          releaseDate: data.release_date || data.first_air_date,
          rating: Math.round((data.vote_average || 0) * 10) / 10,
          duration: formatDuration(data.runtime || data.episode_run_time?.[0] || 120),
          genres: data.genres || [],
          totalSeasons: data.number_of_seasons || 1,
          totalEpisodes: data.number_of_episodes || 1,
          seasonDetails: [],
          currentSeason: 1,
          currentEpisode: 1,
          useAbsoluteNumbering: false,
          credits: data.credits || {},
          videos: data.videos || {},
          similar: data.similar || {}
        };

        // If it's a TV show, fetch season details
        if (formattedMovieData.mediaType === 'tv') {
          const seasonPromises = [];
          for (let i = 1; i <= formattedMovieData.totalSeasons; i++) {
            seasonPromises.push(
              fetch(`${TMDB_BASE_URL}/tv/${movieId}/season/${i}?api_key=${TMDB_API_KEY}`)
                .then(res => res.json())
            );
          }
          
          const seasonDetails = await Promise.all(seasonPromises);
          formattedMovieData.seasonDetails = seasonDetails.map(season => ({
            season_number: season.season_number,
            name: season.name,
            overview: season.overview,
            air_date: season.air_date,
            poster_path: season.poster_path,
            episodes: season.episodes.map(episode => ({
              episode_number: episode.episode_number,
              name: episode.name,
              overview: episode.overview,
              still_path: episode.still_path,
              air_date: episode.air_date,
              vote_average: episode.vote_average,
              runtime: episode.runtime
            }))
          }));
        }

        setMovieData(formattedMovieData);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId, location.state]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSeasonChange = async (event) => {
    const newSeason = event.target.value;
    setCurrentSeason(newSeason);
    setCurrentEpisode('1'); // Reset to first episode when season changes

    // Fetch new season data if it's not already loaded
    if (movieData?.mediaType === 'tv' && (!seasonDetails[newSeason - 1] || !seasonDetails[newSeason - 1].episodes)) {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/tv/${movieData.id}/season/${newSeason}?api_key=${TMDB_API_KEY}`
        );
        const seasonData = await response.json();
        
        // Update seasonDetails with the new season data
        const updatedSeasonDetails = [...seasonDetails];
        updatedSeasonDetails[newSeason - 1] = {
          season_number: seasonData.season_number,
          name: seasonData.name,
          overview: seasonData.overview,
          air_date: seasonData.air_date,
          poster_path: seasonData.poster_path,
          episodes: seasonData.episodes.map(episode => ({
            episode_number: episode.episode_number,
            name: episode.name,
            overview: episode.overview,
            still_path: episode.still_path,
            air_date: episode.air_date,
            vote_average: episode.vote_average,
            runtime: episode.runtime
          }))
        };
        setSeasonDetails(updatedSeasonDetails);

        // Update movieData with new season details
        const updatedMovieData = {
          ...movieData,
          seasonDetails: updatedSeasonDetails
        };
        setMovieData(updatedMovieData);
      } catch (error) {
        console.error('Error fetching season data:', error);
      }
    }
  };

  const handleEpisodeChange = (event) => {
    const newEpisode = event.target.value;
    setCurrentEpisode(newEpisode);
  };

  const handleAbsoluteEpisodeChange = (event) => {
    const absoluteNumber = parseInt(event.target.value);
    const { season, episode } = getSeasonAndEpisodeFromAbsolute(absoluteNumber);
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  };

  const toggleNumberingMode = () => {
    const newMode = !useAbsoluteNumbering;
    setUseAbsoluteNumbering(newMode);
    
    // Refresh video URL with new numbering mode
    if (movieData && movieData.mediaType === 'tv') {
      let absoluteNumber = null;
      if (newMode) {
        // Calculate absolute number for current episode
        for (let s = 0; s < currentSeason - 1; s++) {
          absoluteNumber += seasonDetails[s]?.episodes?.length || 0;
        }
        absoluteNumber += parseInt(currentEpisode);
        handlePlayEpisode(absoluteNumber, undefined, true);
      } else {
        handlePlayEpisode(currentEpisode, currentSeason, false);
      }
    }
  };

  const getSeasonAndEpisodeFromAbsolute = (absoluteNumber) => {
    if (!movieData?.seasonDetails) return { season: 1, episode: 1 };
    
    let count = 0;
    for (let s = 0; s < movieData.seasonDetails.length; s++) {
      const season = movieData.seasonDetails[s];
      for (let e = 0; e < season.episodes.length; e++) {
        count++;
        if (count === absoluteNumber) {
          return { season: s + 1, episode: e + 1 };
        }
      }
    }
    return { season: 1, episode: 1 };
  };

  const getAbsoluteNumber = (season, episode) => {
    if (!movieData?.seasonDetails) return null;
    
    let absoluteNumber = 0;
    for (let s = 0; s < season - 1; s++) {
      absoluteNumber += movieData.seasonDetails[s]?.episodes?.length || 0;
    }
    return absoluteNumber + episode;
  };

  const handlePlay = () => {
    if (!movieData) return;
    
    if (movieData.mediaType === 'tv') {
      let absoluteNumber = null;
      if (useAbsoluteNumbering) {
        // Calculate absolute episode number
        absoluteNumber = 0;
        for (let s = 0; s < currentSeason - 1; s++) {
          absoluteNumber += movieData.seasonDetails[s]?.episodes?.length || 0;
        }
        absoluteNumber += parseInt(currentEpisode);
      }

      const episodeInfo = {
        season: currentSeason,
        episode: currentEpisode,
        absoluteNumber: absoluteNumber,
        name: seasonDetails[currentSeason - 1]?.episodes?.find(
          ep => ep.episode_number === parseInt(currentEpisode)
        )?.name || `Episode ${currentEpisode}`,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`lastPlayed_${movieData.id}`, JSON.stringify(episodeInfo));
      setLastPlayedEpisode(episodeInfo);
    }
    
    const updatedMovie = {
      ...movieData,
      currentSeason: currentSeason,
      currentEpisode: currentEpisode,
      absoluteEpisodeNumber: useAbsoluteNumbering ? nextAbsoluteNumber : null
    };

    const url = getVideoUrl(updatedMovie, apiSource);
    setCurrentVideoUrl(url);
    setIsPlayerOpen(true);
  };

  const handleNextEpisode = () => {
    if (!movieData || movieData.mediaType !== 'tv') return;
    
    const currentSeasonData = seasonDetails[currentSeason - 1];
    const seasonEpisodes = currentSeasonData?.episodes?.length || 0;
    
    let nextSeason = parseInt(currentSeason);
    let nextEpisode = parseInt(currentEpisode) + 1;
    let nextAbsoluteNumber = null;
    
    if (useAbsoluteNumbering) {
      // Calculate current absolute number
      let currentAbsoluteNumber = 0;
      for (let s = 0; s < currentSeason - 1; s++) {
        currentAbsoluteNumber += seasonDetails[s]?.episodes?.length || 0;
      }
      currentAbsoluteNumber += parseInt(currentEpisode);
      
      // Increment absolute number
      nextAbsoluteNumber = currentAbsoluteNumber + 1;
      
      // Calculate next season and episode from absolute number
      let episodeCount = 0;
      for (let s = 0; s < seasonDetails.length; s++) {
        const seasonEpisodes = seasonDetails[s]?.episodes?.length || 0;
        if (episodeCount + seasonEpisodes >= nextAbsoluteNumber) {
          nextSeason = s + 1;
          nextEpisode = nextAbsoluteNumber - episodeCount;
          break;
        }
        episodeCount += seasonEpisodes;
      }
      
      // If we've reached the end of all episodes, wrap back to episode 1
      if (nextAbsoluteNumber > getTotalEpisodes()) {
        nextAbsoluteNumber = 1;
        nextSeason = 1;
        nextEpisode = 1;
      }
    } else {
      // If we're at the end of the season, move to the next season
      if (nextEpisode > seasonEpisodes) {
        nextSeason = nextSeason + 1;
        nextEpisode = 1;
        
        // If we're at the end of the series, wrap back to season 1
        if (nextSeason > totalSeasons) {
          nextSeason = 1;
        }
      }
    }

    // Update states
    setCurrentSeason(nextSeason);
    setCurrentEpisode(nextEpisode);

    // Update the movie data with new episode info
    const updatedMovie = {
      ...movieData,
      currentSeason: nextSeason,
      currentEpisode: nextEpisode,
      absoluteEpisodeNumber: useAbsoluteNumbering ? nextAbsoluteNumber : null
    };

    // Save last played episode info
    const episodeInfo = {
      season: nextSeason,
      episode: nextEpisode,
      absoluteNumber: useAbsoluteNumbering ? nextAbsoluteNumber : null,
      name: seasonDetails[nextSeason - 1]?.episodes?.find(
        (ep, index) => index + 1 === nextEpisode
      )?.name || `Episode ${nextEpisode}`,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`lastPlayed_${movieData.id}`, JSON.stringify(episodeInfo));
    setLastPlayedEpisode(episodeInfo);

    // Generate new video URL and update player
    const newUrl = getVideoUrl(updatedMovie, apiSource);
    setCurrentVideoUrl(newUrl);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Update currentEpisodeData to use the latest season details
  const currentEpisodeData = movieData?.mediaType === 'tv' 
    ? seasonDetails[currentSeason - 1]?.episodes?.[currentEpisode - 1]
    : null;

  const handleApiPopupOpen = () => {
    setIsApiPopupOpen(true);
  };

  const handleApiPopupClose = () => {
    setIsApiPopupOpen(false);
  };

  const fetchShowDetails = async (showId) => {
    try {
      // Fetch show details
      const showResponse = await fetch(`${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}`);
      const showData = await showResponse.json();
      setShowDetails(showData);
      setTotalSeasons(showData.number_of_seasons);

      // Fetch season details
      const seasonPromises = Array.from({ length: showData.number_of_seasons }, (_, i) => 
        fetch(`${TMDB_BASE_URL}/tv/${showId}/season/${i + 1}?api_key=${TMDB_API_KEY}`)
          .then(res => res.json())
      );

      const seasonsData = await Promise.all(seasonPromises);
      setSeasonDetails(seasonsData);
      
      // Calculate total episodes
      const total = seasonsData.reduce((sum, season) => sum + (season.episodes?.length || 0), 0);
      setTotalEpisodes(total);

      return {
        showDetails: showData,
        totalSeasons: showData.number_of_seasons,
        totalEpisodes: total,
        seasonDetails: seasonsData
      };
    } catch (error) {
      console.error('Error fetching show details:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (movieData && movieData.mediaType === 'tv') {
      fetchShowDetails(movieData.id);
    }
  }, [movieData]);

  useEffect(() => {
    if (movieData?.mediaType === 'tv') {
      const lastPlayed = localStorage.getItem(`lastPlayed_${movieData.id}`);
      if (lastPlayed) {
        setLastPlayedEpisode(JSON.parse(lastPlayed));
      }
    }
  }, [movieData]);

  const handlePlayEpisode = (episodeNumber, seasonNumber, isAbsolute = false) => {
    if (!movieData || movieData.mediaType !== 'tv' || !episodeNumber) return;
    
    let targetSeason = seasonNumber;
    let targetEpisode = episodeNumber;
    let absoluteNumber = null;
    
    if (isAbsolute || useAbsoluteNumbering) {
      // If absolute numbering is used, calculate season and episode
      let episodesCount = 0;
      absoluteNumber = episodeNumber;
      
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
    }
    
    // Update the movie data with new episode info
    const updatedMovie = {
      ...movieData,
      currentSeason: targetSeason,
      currentEpisode: targetEpisode,
      absoluteEpisodeNumber: isAbsolute || useAbsoluteNumbering ? absoluteNumber : null
    };
    
    // Update states
    setCurrentSeason(targetSeason);
    setCurrentEpisode(targetEpisode);
    
    // Generate new video URL and update player
    const newUrl = getVideoUrl(updatedMovie, apiSource);
    setCurrentVideoUrl(newUrl);

    const episodeInfo = {
      season: targetSeason,
      episode: targetEpisode,
      absoluteNumber: absoluteNumber,
      name: seasonDetails[targetSeason - 1]?.episodes?.find(
        (ep, index) => index + 1 === targetEpisode
      )?.name || `Episode ${targetEpisode}`,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`lastPlayed_${movieData.id}`, JSON.stringify(episodeInfo));
    setLastPlayedEpisode(episodeInfo);
  };

  // Save absolute numbering mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('useAbsoluteNumbering', useAbsoluteNumbering);
  }, [useAbsoluteNumbering]);

  // Add this helper function to calculate total episodes
  const getTotalEpisodes = () => {
    if (!seasonDetails) return 0;
    return seasonDetails.reduce((total, season) => {
      return total + (season?.episodes?.length || 0);
    }, 0);
  };

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        bgcolor: '#141414',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}>
        <Typography variant="h4" sx={{ color: '#E50914', mb: 2 }}>
          Error
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: '#E50914',
            color: 'white',
            '&:hover': {
              bgcolor: '#F40612'
            }
          }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        bgcolor: '#141414',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{
          width: '100%',
          height: '3px',
          bgcolor: '#E50914',
          animation: 'loading 2s ease infinite',
          '@keyframes loading': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
          }
        }} />
        <Typography variant="h6" sx={{ mt: 4 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!movieData) return null;

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#141414',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Backdrop Image */}
      {movieData?.backdrop_path && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movieData.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.8) 0%, rgba(20, 20, 20, 0.9) 50%, rgba(20, 20, 20, 1) 100%)',
            }
          }}
        />
      )}

      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
          zIndex: 1000
        }}
      >
        Back
      </Button>

      {/* Content Container */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: '1200px',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 }
      }}>
        {/* Title and Overview */}
        <Box sx={{ 
          maxWidth: '800px', 
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              mb: 2,
              textAlign: 'center'
            }}
          >
            {movieData?.title}
          </Typography>

          {/* Play Button */}
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handlePlay}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '1.1rem',
              py: 1,
              px: 4,
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Play
          </Button>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 3,
              lineHeight: 1.6,
              textAlign: 'center',
              maxWidth: '600px'
            }}
          >
            {movieData?.overview}
          </Typography>
        </Box>

        {/* Movie Info */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: { xs: 1, sm: 2, md: 3 },
          mb: 4,
          justifyContent: 'center',
          width: '100%',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            minWidth: { xs: '100px', sm: '150px', md: '200px' },
            flexShrink: 0,
            textAlign: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
              Release Date
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              {movieData?.releaseDate ? new Date(movieData.releaseDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>

          <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            minWidth: { xs: '100px', sm: '150px', md: '200px' },
            flexShrink: 0,
            textAlign: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
              Rating
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              {movieData?.rating ? `${movieData.rating}/10` : 'N/A'}
            </Typography>
          </Box>

          <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            minWidth: { xs: '100px', sm: '150px', md: '200px' },
            flexShrink: 0,
            textAlign: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
              Duration
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              {movieData?.duration || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Genres */}
        {movieData?.genres?.length > 0 && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
              Genres
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {movieData.genres.map(genre => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  sx={{
                    bgcolor: 'rgba(229, 9, 20, 0.2)',
                    color: '#E50914',
                    '&:hover': {
                      bgcolor: 'rgba(229, 9, 20, 0.3)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* TV Show Episode Selection */}
        {movieData?.mediaType === 'tv' && (
          <Box sx={{
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 3,
            mb: 4,
            maxWidth: '800px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>Select Episode</Typography>

            {/* Last Played Episode */}
            {lastPlayedEpisode && (
              <Box sx={{
                mb: 4,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(229, 9, 20, 0.3)'
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'rgba(229, 9, 20, 0.1)',
                  borderBottom: '1px solid rgba(229, 9, 20, 0.2)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon sx={{ color: '#E50914' }} />
                    <Typography variant="subtitle1" sx={{ color: '#E50914', fontWeight: 'bold' }}>
                      Continue Watching
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.removeItem(`lastPlayed_${movieData.id}`);
                      setLastPlayedEpisode(null);
                    }}
                    sx={{
                      color: 'rgba(229, 9, 20, 0.8)',
                      '&:hover': {
                        color: '#E50914',
                        bgcolor: 'rgba(229, 9, 20, 0.1)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Box 
                  onClick={() => {
                    setCurrentSeason(lastPlayedEpisode.season);
                    setCurrentEpisode(lastPlayedEpisode.episode);
                    setUseAbsoluteNumbering(!!lastPlayedEpisode.absoluteNumber);
                    const updatedMovie = {
                      ...movieData,
                      currentSeason: lastPlayedEpisode.season,
                      currentEpisode: lastPlayedEpisode.episode,
                      absoluteEpisodeNumber: lastPlayedEpisode.absoluteNumber
                    };
                    const newUrl = getVideoUrl(updatedMovie, apiSource);
                    setCurrentVideoUrl(newUrl);
                    setIsPlayerOpen(true);
                  }}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(229, 9, 20, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(229, 9, 20, 0.3)',
                    }
                  }}>
                    <PlayArrowIcon sx={{ color: '#E50914' }} />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>
                        {lastPlayedEpisode.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Season {lastPlayedEpisode.season} Episode {lastPlayedEpisode.episode}
                      </Typography>
                      {lastPlayedEpisode.absoluteNumber && (
                        <Typography variant="body2" sx={{ color: 'rgba(229, 9, 20, 0.8)' }}>
                          Absolute #{lastPlayedEpisode.absoluteNumber}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Last watched: {new Date(lastPlayedEpisode.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useAbsoluteNumbering}
                    onChange={toggleNumberingMode}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#E50914',
                        '& + .MuiSwitch-track': {
                          bgcolor: '#E50914'
                        }
                      }
                    }}
                  />
                }
                label="Absolute Numbering"
                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
              />
            </Box>

            {!useAbsoluteNumbering ? (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center',
                width: '100%',
                '& .MuiSelect-select': {
                  whiteSpace: 'normal',
                  wordWrap: 'break-word'
                }
              }}>
                <Select
                  value={currentSeason}
                  onChange={handleSeasonChange}
                  sx={{
                    width: '30%',
                    minWidth: 120,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& .MuiSelect-icon': { color: 'white' },
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {Array.from({ length: totalSeasons }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      Season {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                
                <Select
                  value={currentEpisode}
                  onChange={handleEpisodeChange}
                  sx={{
                    width: '70%',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& .MuiSelect-icon': { color: 'white' },
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {seasonDetails[currentSeason - 1]?.episodes?.map((episode, index) => (
                    <MenuItem 
                      key={index + 1} 
                      value={index + 1}
                      sx={{ 
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}
                    >
                      Episode {index + 1}: {episode.name || `Episode ${index + 1}`}
                      {useAbsoluteNumbering && (
                        <Typography component="span" sx={{ ml: 1, color: 'rgba(229, 9, 20, 0.8)' }}>
                          (Abs #{getAbsoluteNumber(currentSeason, index + 1)})
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            ) : (
              <Select
                value={getAbsoluteNumber(currentSeason, currentEpisode)}
                onChange={handleAbsoluteEpisodeChange}
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& .MuiSelect-icon': { color: 'white' },
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {(() => {
                  let options = [];
                  let absoluteCount = 1;
                  for (let s = 0; s < movieData.seasonDetails.length; s++) {
                    const season = movieData.seasonDetails[s];
                    for (let e = 0; e < season.episodes.length; e++) {
                      const episode = season.episodes[e];
                      options.push(
                        <MenuItem key={absoluteCount} value={absoluteCount}>
                          Episode {absoluteCount}: {episode.name || `Episode ${e + 1}`} (S{s + 1}E{e + 1})
                        </MenuItem>
                      );
                      absoluteCount++;
                    }
                  }
                  return options;
                })()}
              </Select>
            )}

            {currentEpisodeData && (
              <Box sx={{
                mt: 2,
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <Typography variant="h6" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.9)' }}>
                  {currentEpisodeData.name || `Episode ${currentEpisode}`}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  {currentEpisodeData.overview || 'No overview available.'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', justifyContent: 'center' }}>
                  {currentEpisodeData.air_date && (
                    <Typography>Air Date: {new Date(currentEpisodeData.air_date).toLocaleDateString()}</Typography>
                  )}
                  {currentEpisodeData.vote_average && (
                    <Typography>Rating: {Math.round(currentEpisodeData.vote_average * 10) / 10}/10</Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Video Player */}
      <VideoPlayer
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={currentVideoUrl}
        onApiPopupOpen={handleApiPopupOpen}
        onNextEpisode={handleNextEpisode}
        showNextButton={movieData?.mediaType === 'tv'}
        onPlayEpisode={handlePlayEpisode}
        currentSeason={currentSeason}
        currentEpisode={currentEpisode}
        seasonDetails={seasonDetails}
        totalSeasons={totalSeasons}
        totalEpisodes={getTotalEpisodes()}
      />

      {/* API Source Popup */}
      <ApiSourcePopup
        open={isApiPopupOpen}
        onClose={handleApiPopupClose}
        currentApi={apiSource}
        onApiChange={(newApi) => {
          setApiSource(newApi);
          if (movieData) {
            const url = getVideoUrl(movieData.mediaType === 'tv' ? {
              ...movieData,
              currentSeason: currentSeason,
              currentEpisode: currentEpisode,
              absoluteEpisodeNumber: useAbsoluteNumbering ? (() => {
                let absoluteNumber = 0;
                for (let s = 0; s < currentSeason - 1; s++) {
                  absoluteNumber += movieData.seasonDetails[s]?.episodes?.length || 0;
                }
                return absoluteNumber + currentEpisode;
              })() : null
            } : movieData, newApi);
            setCurrentVideoUrl(url);
          }
        }}
        apiSources={apiSources}
      />
    </Box>
  );
};

export default BlankPageTemplate; 