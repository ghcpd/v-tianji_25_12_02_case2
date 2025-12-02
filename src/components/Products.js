import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('Products updated');
  }, [products]);

  const loadProducts = async () => {
    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });

    try {
      const response = await axios.get('https://api.example.com/products');
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_FAILURE', payload: error.message });
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  getFilteredProducts = () => {
    const { products } = this.props;
    const { filter, sortBy } = this.state;
    
    let filtered = _.filter(products, (product) => 
      _.includes(product.name.toLowerCase(), filter.toLowerCase())
    );
    
    return _.sortBy(filtered, [sortBy]);
  };

  const filteredProducts = (() => {
    let filtered = _.filter(products, (product) => _.includes(product.name.toLowerCase(), filter.toLowerCase()));
    return _.sortBy(filtered, [sortBy]);
  })();

  return (
      <div className="products-container">
        <h1>Products Management</h1>
        
        <div className="filters">
        }

        Products.propTypes = {
          products: PropTypes.array,
        };
    );
  }
}

export default Products;
