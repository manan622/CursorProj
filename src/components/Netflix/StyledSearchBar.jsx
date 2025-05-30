import React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
});

const SearchInput = styled(InputBase)(({ theme, isAndroid }) => ({
  width: '100%',
  padding: isAndroid ? '10px 40px' : '8px 40px',
  border: 'none',
  borderRadius: '4px',
  background: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  fontSize: isAndroid ? '16px' : '14px',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '& .MuiInputBase-input': {
    color: 'white',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
      opacity: 1,
    },
  },
  '&:focus-within': {
    background: 'rgba(255, 255, 255, 0.15)',
  },
}));

const SearchIcon = styled(Box)(({ isAndroid }) => ({
  position: 'absolute',
  left: isAndroid ? '10px' : '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(255, 255, 255, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: isAndroid ? '20px' : '18px',
  height: isAndroid ? '20px' : '18px',
}));

const ClearButton = styled(IconButton)(({ isAndroid }) => ({
  position: 'absolute',
  right: isAndroid ? '6px' : '4px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(255, 255, 255, 0.5)',
  padding: isAndroid ? '6px' : '4px',
  '&:hover': {
    color: 'white',
  },
}));

const FilterButton = styled(IconButton)(({ isAndroid }) => ({
  position: 'absolute',
  right: isAndroid ? '32px' : '28px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(255, 255, 255, 0.5)',
  padding: isAndroid ? '4px' : '2px',
  '&:hover': {
    color: 'white',
  },
}));

const StyledSearchBar = ({ value, onChange, onClear, onFilterClick, isAndroid }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        placeholder="Search movies and TV shows..."
        value={value || ''}
        onChange={handleChange}
        isAndroid={isAndroid}
        inputProps={{
          'aria-label': 'search',
          'data-testid': 'search-input'
        }}
      />
      <SearchIcon isAndroid={isAndroid}>
        <svg width={isAndroid ? "24" : "20"} height={isAndroid ? "24" : "20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 19L14.65 14.65" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear" x1="1" y1="9" x2="17" y2="9" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E50914"/>
              <stop offset="1" stopColor="#FF4D4D"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="14.65" y1="14.65" x2="19" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E50914"/>
              <stop offset="1" stopColor="#FF4D4D"/>
            </linearGradient>
          </defs>
        </svg>
      </SearchIcon>
      {value && (
        <ClearButton onClick={handleClear} isAndroid={isAndroid} aria-label="clear search">
          <svg width={isAndroid ? "24" : "20"} height={isAndroid ? "24" : "20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 5L15 15" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="paint0_linear" x1="5" y1="10" x2="15" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E50914"/>
                <stop offset="1" stopColor="#FF4D4D"/>
              </linearGradient>
              <linearGradient id="paint1_linear" x1="5" y1="10" x2="15" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E50914"/>
                <stop offset="1" stopColor="#FF4D4D"/>
              </linearGradient>
            </defs>
          </svg>
        </ClearButton>
      )}
      {!isAndroid && (
        <FilterButton onClick={onFilterClick} isAndroid={isAndroid} aria-label="filter results">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 15H11.6667V12.5H8.33333V15ZM2.5 5V7.5H17.5V5H2.5ZM5 10.8333H15V8.33333H5V10.8333Z" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="2.5" y1="10" x2="17.5" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E50914"/>
                <stop offset="1" stopColor="#FF4D4D"/>
              </linearGradient>
            </defs>
          </svg>
        </FilterButton>
      )}
    </SearchContainer>
  );
};

export default StyledSearchBar; 