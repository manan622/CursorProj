// API Constants
export const TMDB_API_KEY = 'da914409e3ab4f883504dc0dbf9d9917';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Common API Functions
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`Movie details fetch failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const fetchTvDetails = async (showId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TV show details fetch failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return null;
  }
};

export const fetchSeasonDetails = async (showId, seasonNumber) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`Season details fetch failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching season details:', error);
    return null;
  }
};

export const searchContent = async (query) => {
  try {
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

    return combinedResults;
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
};

// Helper Functions
export const formatDuration = (minutes) => {
  if (!minutes) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const getVideoUrl = (movie, apiSourceInfo, selectedSeason, selectedEpisode) => {
  if (!movie || !apiSourceInfo) return '';
  
  const { url, id } = apiSourceInfo;
  
  if (movie.mediaType === 'tv') {
    if (id === 'hulu' || id === 'prime' || id === 'Hotstar') {
      return `${url}/tv/${movie.id}/${selectedSeason}/${selectedEpisode}`;
    } else {
      return `${url}/tv/${movie.id}-${selectedSeason}-${selectedEpisode}`;
    }
  } else {
    return `${url}/movie/${movie.id}`;
  }
};

// Content Filter Helpers
export const movieTypeFilter = (item) => item.mediaType === 'movie';
export const tvTypeFilter = (item) => item.mediaType === 'tv';
export const allTypeFilter = () => true; 