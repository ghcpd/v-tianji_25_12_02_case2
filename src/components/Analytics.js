import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

const Analytics = () => {
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    dispatch({ type: 'FETCH_ANALYTICS_REQUEST' });
    try {
      const response = await axios.get(`https://api.example.com/analytics?range=${timeRange}`);

      const processedData = response.data.map((item) => ({
        ...item,
        formattedDate: moment(item.date).format('MMM DD, YYYY'),
        daysAgo: moment().diff(moment(item.date), 'days')
      }));

      dispatch({ type: 'FETCH_ANALYTICS_SUCCESS', payload: processedData });
      setChartData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // fetch on mount and when timeRange changes
  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  calculateMetrics = () => {
    const { chartData } = this.state;
    
    const total = _.sumBy(chartData, 'value');
    const average = _.meanBy(chartData, 'value');
    const max = _.maxBy(chartData, 'value');
    
    return { total, average, max: max ? max.value : 0 };
  };

  render() {
    // hook-managed state
    // loading, timeRange, chartData are locals from hooks
    const metrics = this.calculateMetrics();

    if (loading) {
      return <div className="loading">Loading analytics...</div>;
    }

    return (
      <div className="analytics-container">
        <h1>Analytics Dashboard</h1>
        
          <div className="time-range-selector">
            <button 
            className={timeRange === 'week' ? 'active' : ''} 
            onClick={() => handleTimeRangeChange('week')}
          >
            This Week
          </button>
            <button 
            className={timeRange === 'month' ? 'active' : ''} 
            onClick={() => handleTimeRangeChange('month')}
          >
            This Month
          </button>
            <button 
            className={timeRange === 'year' ? 'active' : ''} 
            onClick={() => handleTimeRangeChange('year')}
          >
            This Year
          </button>
        </div>

        <div className="metrics-summary">
          <div className="metric">
            <h3>Total</h3>
            <p>{metrics.total.toFixed(2)}</p>
          </div>
          <div className="metric">
            <h3>Average</h3>
            <p>{metrics.average.toFixed(2)}</p>
          </div>
          <div className="metric">
            <h3>Peak</h3>
            <p>{metrics.max.toFixed(2)}</p>
          </div>
        </div>

        <div className="chart-container">
          {chartData.map((item, index) => (
            <div key={index} className="chart-bar">
              <span>{item.formattedDate}</span>
              <div 
                className="bar" 
                style={{ height: `${(item.value / metrics.max) * 100}%` }}
              />
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  analytics: state.analytics.data
});

export default connect(mapStateToProps)(Analytics);
