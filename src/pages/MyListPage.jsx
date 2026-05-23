import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../components/Netflix/Header';
import MovieList from '../components/Netflix/MovieList';
import MovieDetails from '../components/Netflix/MovieDetails';
import userDataManager from '../utils/userDataManager';
import { formatDuration } from '../utils/netflixUtils';

const MyListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    setMyList(userDataManager.getUserData().myList || []);
  }, []);

  const handleRefresh = () => {
    setMyList(userDataManager.getUserData().myList || []);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleMyList = (movie) => {
    const isInList = myList.some((item) => item.id === movie.id);

    if (isInList) {
      userDataManager.removeFromMyList(movie.id);
      setMyList(myList.filter((item) => item.id !== movie.id));
    } else {
      userDataManager.addToMyList(movie);
      setMyList([...myList, movie]);
    }
  };

  const isInMyList = (movieId) => {
    return myList.some((movie) => movie.id === movieId);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#141414', color: '#FFFFFF' }}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        handleRefresh={handleRefresh}
        handleApiPopupOpen={() => {}}
      />

      <Box sx={{ pt: { xs: 9, sm: 8 }, pb: 10 }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 1,
              letterSpacing: '1px'
            }}
          >
            My List
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 720 }}>
            Your saved titles are now on their own page. Remove items from My List directly below.
          </Typography>
        </Box>

        {myList.length === 0 ? (
          <Box sx={{ px: { xs: 2, sm: 3 }, textAlign: 'center', mt: 12 }}>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
              Your list is empty.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                bgcolor: '#E50914',
                '&:hover': {
                  bgcolor: '#c30714'
                }
              }}
            >
              Browse Movies
            </Button>
          </Box>
        ) : (
          <Fade in timeout={600}>
            <div>
              <MovieList
                title="My List"
                movies={myList}
                categoryId="myList"
                hoveredMovie={hoveredMovie}
                setHoveredMovie={setHoveredMovie}
                handlePlay={() => {}}
                toggleMyList={toggleMyList}
                isInMyList={isInMyList}
                formatDuration={formatDuration}
                setSelectedMovie={setSelectedMovie}
                setIsDetailsOpen={setIsDetailsOpen}
                contentFilter={() => true}
              />
            </div>
          </Fade>
        )}
      </Box>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedMovie(null);
          }}
          handlePlay={() => {}}
          toggleMyList={toggleMyList}
          isInMyList={isInMyList}
          formatDuration={formatDuration}
          setSelectedMovie={setSelectedMovie}
          selectedSeason={selectedMovie?.currentSeason}
          setSelectedSeason={() => {}}
          selectedEpisode={selectedMovie?.currentEpisode}
          showDetails={true}
          totalSeasons={selectedMovie?.number_of_seasons || 0}
          seasonDetails={selectedMovie?.seasons || []}
        />
      )}
    </Box>
  );
};

export default MyListPage;
