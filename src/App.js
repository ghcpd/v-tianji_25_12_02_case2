import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Analytics from './components/Analytics';
import Navigation from './components/Navigation';

// Using class component with legacy lifecycle methods
const App = () => {
  const user = useSelector(state => state.user);
  const location = useLocation();

  // replaces legacy mounting + route-change lifecycle hooks
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  useEffect(() => {
    console.log('Route changed', location.pathname);
  }, [location]);

  return (
    <div className="app-container">
      <Navigation />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
};

App.propTypes = {
  // user is now read from the store via useSelector; kept for documentation
  user: PropTypes.object
};

export default App;
