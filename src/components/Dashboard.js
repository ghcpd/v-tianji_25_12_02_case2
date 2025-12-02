import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('https://api.example.com/dashboard/stats');
      
      const formattedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
      
      setStats(response.data);
      setLoading(false);
      // lastUpdated stored into local state only
      setLastUpdated(formattedDate);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const [lastUpdated, setLastUpdated] = useState(null);

  const handleSearch = _.debounce((value) => {
    console.log('Searching for:', value);
  }, 300);

  useEffect(() => {
    // run on mount
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render
  const containerClass = classNames({
    'dashboard-container': true,
    'loading': loading,
    'loaded': !loading
  });
    
    return (
      <div className={containerClass}>
        <h1>Dashboard Overview</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p>${stats.totalSales || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{stats.activeUsers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>${stats.revenue || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Last Updated</h3>
            <p>{lastUpdated}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
