// User data management utilities
const USER_DATA_KEY = 'netflix_user_data';

// Initialize user data structure
const initialUserData = {
  myList: [],
  watchHistory: [],
  preferences: {
    theme: 'dark',
    autoplay: true,
    quality: 'auto'
  },
  lastWatched: {},
  favorites: []
};

// Get user data from localStorage
export const getUserData = () => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : initialUserData;
  } catch (error) {
    console.error('Error reading user data:', error);
    return initialUserData;
  }
};

// Save user data to localStorage
export const saveUserData = (data) => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Add movie to My List
export const addToMyList = (movie) => {
  const userData = getUserData();
  if (!userData.myList.some(item => item.id === movie.id)) {
    userData.myList.push(movie);
    saveUserData(userData);
  }
};

// Remove movie from My List
export const removeFromMyList = (movieId) => {
  const userData = getUserData();
  userData.myList = userData.myList.filter(item => item.id !== movieId);
  saveUserData(userData);
};

// Add to watch history
export const addToWatchHistory = (movie) => {
  const userData = getUserData();
  const timestamp = new Date().toISOString();
  
  // Remove if already exists
  userData.watchHistory = userData.watchHistory.filter(item => item.id !== movie.id);
  
  // Add to beginning of array
  userData.watchHistory.unshift({
    ...movie,
    watchedAt: timestamp
  });
  
  // Keep only last 100 entries
  userData.watchHistory = userData.watchHistory.slice(0, 100);
  
  saveUserData(userData);
};

// Update last watched position
export const updateLastWatched = (movieId, position) => {
  const userData = getUserData();
  userData.lastWatched[movieId] = {
    position,
    timestamp: new Date().toISOString()
  };
  saveUserData(userData);
};

// Get last watched position
export const getLastWatched = (movieId) => {
  const userData = getUserData();
  return userData.lastWatched[movieId] || null;
};

// Toggle favorite
export const toggleFavorite = (movie) => {
  const userData = getUserData();
  const index = userData.favorites.findIndex(item => item.id === movie.id);
  
  if (index === -1) {
    userData.favorites.push(movie);
  } else {
    userData.favorites.splice(index, 1);
  }
  
  saveUserData(userData);
};

// Update user preferences
export const updatePreferences = (preferences) => {
  const userData = getUserData();
  userData.preferences = {
    ...userData.preferences,
    ...preferences
  };
  saveUserData(userData);
};

// Clear all user data
export const clearUserData = () => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};

// Export all functions
export default {
  getUserData,
  saveUserData,
  addToMyList,
  removeFromMyList,
  addToWatchHistory,
  updateLastWatched,
  getLastWatched,
  toggleFavorite,
  updatePreferences,
  clearUserData
}; 