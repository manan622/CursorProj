import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BlankPageTemplate from './components/Netflix/BlankPageTemplate';
import NetflixPage from './pages/NetflixPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<NetflixPage />} />
      <Route path="/movie/:movieId" element={<BlankPageTemplate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 