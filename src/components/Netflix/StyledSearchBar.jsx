import React from 'react';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';

const StyledSearchBar = ({ value, onChange, onClear, onFilterClick, isAndroid }) => {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search movies and TV shows..."
        value={value}
        onChange={onChange}
        $isAndroid={isAndroid}
      />
      <SearchIcon $isAndroid={isAndroid}>
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
        <ClearButton onClick={onClear} $isAndroid={isAndroid}>
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
        <FilterIcon onClick={onFilterClick} $isAndroid={isAndroid}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 15H11.6667V12.5H8.33333V15ZM2.5 5V7.5H17.5V5H2.5ZM5 10.8333H15V8.33333H5V10.8333Z" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="2.5" y1="10" x2="17.5" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E50914"/>
                <stop offset="1" stopColor="#FF4D4D"/>
              </linearGradient>
            </defs>
          </svg>
        </FilterIcon>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.$isAndroid ? '16px 48px' : '12px 48px'};
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: ${props => props.$isAndroid ? '18px' : '16px'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.$isAndroid ? '12px' : '8px'};
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.$isAndroid ? '24px' : '20px'};
  height: ${props => props.$isAndroid ? '24px' : '20px'};
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${props => props.$isAndroid ? '8px' : '4px'};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: ${props => props.$isAndroid ? '8px' : '4px'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: white;
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  right: ${props => props.$isAndroid ? '40px' : '32px'};
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: ${props => props.$isAndroid ? '4px' : '2px'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: white;
  }
`;

export default StyledSearchBar; 