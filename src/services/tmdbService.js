import { 
  TMDB_API_KEY, 
  TMDB_BASE_URL 
} from '../utils/netflixUtils';

export const fetchFeaturedContent = async () => {
  try {
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

    return featuredWithDetails;
  } catch (error) {
    console.error('Error fetching featured content:', error);
    throw error;
  }
};

export const fetchCategoriesData = async (categories, mediaType = 'movie') => {
  try {
    const usedMovieIds = new Set(); // Track used movie IDs
    const categoriesData = await Promise.all(
      categories.map(async (category) => {
        const params = new URLSearchParams({
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: '1',
          ...category.params
        });

        const response = await fetch(
          `${TMDB_BASE_URL}${category.endpoint}?${params.toString()}`
        );
        
        if (!response.ok) {
          throw new Error(`Category ${category.title} fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        let backdropPath = '';
        
        if (data.results.length > 0) {
          const firstItemDetails = await fetch(
            `${TMDB_BASE_URL}/${mediaType}/${data.results[0].id}?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const firstItemData = await firstItemDetails.json();
          backdropPath = firstItemData.backdrop_path;
        }
        
        // Filter out movies that have already been used in other categories
        const uniqueMovies = data.results
          .filter(item => !usedMovieIds.has(item.id))
          .slice(0, 6)
          .map(item => {
            usedMovieIds.add(item.id); // Add movie ID to used set
            if (mediaType === 'tv') {
              return {
                ...item,
                mediaType: 'tv',
                title: item.name,
                release_date: item.first_air_date
              };
            }
            return { ...item, mediaType: 'movie' };
          });
        
        return {
          ...category,
          movies: uniqueMovies,
          backdrop_path: backdropPath,
        };
      })
    );
    
    return categoriesData;
  } catch (error) {
    console.error(`Error fetching ${mediaType} categories:`, error);
    throw error;
  }
};

export const fetchShowDetails = async (showId) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch show details: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Fetch season details
    const seasonPromises = [];
    for (let i = 1; i <= data.number_of_seasons; i++) {
      seasonPromises.push(fetch(`${TMDB_BASE_URL}/tv/${showId}/season/${i}?api_key=${TMDB_API_KEY}`));
    }
    
    const seasonResponses = await Promise.all(seasonPromises);
    const seasonData = await Promise.all(seasonResponses.map(res => res.json()));
    
    return {
      showDetails: data,
      totalEpisodes: data.number_of_episodes,
      totalSeasons: data.number_of_seasons,
      seasonDetails: seasonData
    };
  } catch (error) {
    console.error('Error fetching show details:', error);
    throw error;
  }
};

export const fetchRecommendations = async (id, mediaType) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    
    const data = await response.json();
    return data.results.slice(0, 6);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

/**
 * Fetches episode details for multiple seasons of a TV show
 * @param {number} showId - The TMDB ID of the TV show
 * @param {number[]} seasonNumbers - Array of season numbers to fetch (or undefined to fetch all)
 * @returns {Object} Object containing episode data keyed by season number
 */
export const fetchEpisodeNames = async (showId, seasonNumbers) => {
  try {
    // First fetch the show details to get the number of seasons if not provided
    if (!seasonNumbers || seasonNumbers.length === 0) {
      const showResponse = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      
      if (!showResponse.ok) {
        throw new Error(`Failed to fetch show details: ${showResponse.status}`);
      }
      
      const showData = await showResponse.json();
      seasonNumbers = Array.from(
        { length: showData.number_of_seasons },
        (_, i) => i + 1
      );
    }
    
    // Create an object to store episodes by season
    const episodesBySeason = {};
    
    // Fetch each season in parallel
    await Promise.all(
      seasonNumbers.map(async (seasonNum) => {
        const seasonResponse = await fetch(
          `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNum}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        
        if (!seasonResponse.ok) {
          console.warn(`Failed to fetch season ${seasonNum}: ${seasonResponse.status}`);
          episodesBySeason[seasonNum] = { error: `Failed to fetch season ${seasonNum}` };
          return;
        }
        
        const seasonData = await seasonResponse.json();
        
        // Format the episode data to just what we need
        episodesBySeason[seasonNum] = {
          seasonName: seasonData.name,
          seasonNumber: seasonNum,
          episodes: seasonData.episodes.map(episode => ({
            id: episode.id,
            episodeNumber: episode.episode_number,
            name: episode.name,
            overview: episode.overview,
            stillPath: episode.still_path,
            airDate: episode.air_date,
            runtime: episode.runtime || 0
          }))
        };
      })
    );
    
    return {
      showId,
      seasons: episodesBySeason
    };
  } catch (error) {
    console.error('Error fetching episode names:', error);
    throw error;
  }
}; 