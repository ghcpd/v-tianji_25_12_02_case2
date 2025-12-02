# Code Migration Examples - React 16 to 18 & Router 5 to 6

## Quick Migration Patterns

### Pattern 1: Converting Class Component with Lifecycle Methods

**OLD (React 16 Class):**
```javascript
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null, loading: true };
  }

  UNSAFE_componentWillMount() {
    this.loadData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.loadData(nextProps.id);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('About to update');
  }

  loadData = async (id) => {
    const response = await api.getData(id);
    this.setState({ data: response, loading: false });
  };

  render() {
    return <div>{this.state.data}</div>;
  }
}
```

**NEW (React 18 Hooks):**
```javascript
function MyComponent({ id }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData(id);
  }, [id]); // Runs when id changes

  const loadData = useCallback(async (id) => {
    const response = await api.getData(id);
    setData(response);
    setLoading(false);
  }, []);

  return <div>{data}</div>;
}
```

**Key Changes:**
- `UNSAFE_componentWillMount` → `useEffect` with no dependencies
- `UNSAFE_componentWillReceiveProps` → `useEffect` with dependency array
- `componentWillUpdate` → `useEffect` before the state setter
- `this.state` → `useState`
- `this.setState` → State setters

---

### Pattern 2: Converting withRouter HOC

**OLD (React Router 5):**
```javascript
class ProductPage extends Component {
  handleNavigate = () => {
    this.props.history.push(`/product/${id}`);
  };

  render() {
    const { match, location, history } = this.props;
    return (
      <div>
        <p>Current: {location.pathname}</p>
        <p>ID: {match.params.id}</p>
        <button onClick={this.handleNavigate}>Navigate</button>
      </div>
    );
  }
}

export default withRouter(ProductPage);
```

**NEW (React Router 6 + Hooks):**
```javascript
function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <p>Current: {location.pathname}</p>
      <p>ID: {id}</p>
      <button onClick={handleNavigate}>Navigate</button>
    </div>
  );
}

export default ProductPage;
```

**Hook Equivalents:**
- `this.props.history.push()` → `navigate()`
- `this.props.location` → `useLocation()`
- `this.props.match.params` → `useParams()`
- `withRouter(Component)` → Remove HOC entirely

---

### Pattern 3: Converting Redux connect() HOC

**OLD:**
```javascript
const mapStateToProps = (state) => ({
  user: state.user,
  products: state.products.items
});

const mapDispatchToProps = (dispatch) => ({
  fetchProducts: () => dispatch(fetchProducts()),
  updateUser: (user) => dispatch(updateUser(user))
});

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  render() {
    return <div>{this.props.products.map(...)}</div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
```

**NEW (Hooks):**
```javascript
function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return <div>{products.map(...)}</div>;
}

export default Dashboard;
```

**Equivalents:**
- `connect(mapStateToProps)` → `useSelector`
- `mapDispatchToProps` → `useDispatch`
- `this.props.dispatch()` → `dispatch(action)`

---

### Pattern 4: Replacing moment with date-fns

**OLD (moment):**
```javascript
import moment from 'moment';

const timestamp = new Date();
const formatted = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
const daysAgo = moment().diff(moment(timestamp), 'days');
const startOfWeek = moment().startOf('week');
const endOfMonth = moment().endOf('month');
const isAfter = moment(date1).isAfter(moment(date2));
```

**NEW (date-fns):**
```javascript
import { format, differenceInDays, startOfWeek, endOfMonth, isAfter } from 'date-fns';

const timestamp = new Date();
const formatted = format(timestamp, 'yyyy-MM-dd HH:mm:ss');
const daysAgo = differenceInDays(new Date(), timestamp);
const startOfWeekDate = startOfWeek(new Date());
const endOfMonthDate = endOfMonth(new Date());
const isAfterResult = isAfter(date1, date2);
```

**Common Conversions:**
| moment | date-fns |
|--------|----------|
| `moment().format('YYYY-MM-DD')` | `format(new Date(), 'yyyy-MM-dd')` |
| `moment(date).add(1, 'day')` | `addDays(date, 1)` |
| `moment(date).subtract(1, 'month')` | `subMonths(date, 1)` |
| `moment(date).diff(other, 'days')` | `differenceInDays(date, other)` |
| `moment().startOf('day')` | `startOfDay(new Date())` |

---

### Pattern 5: Converting Switch/Route (Router v5 → v6)

**OLD (React Router 5):**
```javascript
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/user/:id" component={User} />
        <Route component={NotFound} /> {/* 404 */}
      </Switch>
    </BrowserRouter>
  );
}
```

**NEW (React Router 6):**
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="*" element={<NotFound />} /> {/* 404 */}
      </Routes>
    </BrowserRouter>
  );
}
```

**Changes:**
- `Switch` → `Routes`
- `component={}` → `element={}`
- `exact` keyword removed (v6 matches exactly by default)
- `Route component={NotFound}` → `Route path="*"`
- Routes no longer need to be in order

---

### Pattern 6: Deprecated Lifecycle Replacements

#### UNSAFE_componentWillMount → useEffect

**OLD:**
```javascript
class Component extends React.Component {
  UNSAFE_componentWillMount() {
    this.initializeData();
  }
}
```

**NEW:**
```javascript
function Component() {
  useEffect(() => {
    initializeData();
  }, []); // Empty deps = runs once on mount
}
```

---

#### UNSAFE_componentWillReceiveProps → useEffect

**OLD:**
```javascript
UNSAFE_componentWillReceiveProps(nextProps) {
  if (nextProps.userId !== this.props.userId) {
    this.loadUser(nextProps.userId);
  }
}
```

**NEW:**
```javascript
useEffect(() => {
  loadUser(userId);
}, [userId]); // Runs when userId changes
```

---

#### componentWillUpdate → useEffect with cleanup

**OLD:**
```javascript
componentWillUpdate(nextProps, nextState) {
  if (nextState.filter !== this.state.filter) {
    console.log('About to filter');
  }
}
```

**NEW:**
```javascript
useEffect(() => {
  console.log('Filter changed to:', filter);
  // Cleanup if needed
  return () => {
    console.log('Cleaning up from filter:', filter);
  };
}, [filter]);
```

---

### Pattern 7: Optimizing Component Renders with useMemo

**OLD (Re-renders on every state change):**
```javascript
class ProductList extends Component {
  getFilteredProducts() {
    const { products } = this.props;
    const { filter } = this.state;
    
    return products.filter(p => 
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  render() {
    const filtered = this.getFilteredProducts(); // Called every render
    return <div>{filtered.map(...)}</div>;
  }
}
```

**NEW (Optimized with useMemo):**
```javascript
function ProductList({ products }) {
  const [filter, setFilter] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]); // Only recalculates when deps change

  return <div>{filteredProducts.map(...)}</div>;
}
```

---

### Pattern 8: useCallback for Event Handlers

**OLD (New function created on every render):**
```javascript
class SearchBox extends Component {
  handleSearch = (e) => { // Gets recreated every render
    this.props.onSearch(e.target.value);
  }

  render() {
    return <input onChange={this.handleSearch} />;
  }
}
```

**NEW (Function identity preserved):**
```javascript
function SearchBox({ onSearch }) {
  const handleSearch = useCallback((e) => {
    onSearch(e.target.value);
  }, [onSearch]); // Only recreated if onSearch changes

  return <input onChange={handleSearch} />;
}
```

---

### Pattern 9: Async State Updates

**OLD (class setState with callback):**
```javascript
loadData() {
  axios.get('/api/data').then(res => {
    this.setState({ data: res.data }, () => {
      console.log('Data updated:', this.state.data);
    });
  });
}
```

**NEW (separate useEffect):**
```javascript
const [data, setData] = useState(null);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  const res = await axios.get('/api/data');
  setData(res.data);
};

useEffect(() => {
  console.log('Data updated:', data);
}, [data]); // Runs after data changes
```

---

### Pattern 10: Component PropTypes

**OLD:**
```javascript
class User extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    email: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
  };
}
```

**NEW (same, just in functional):**
```javascript
function User({ name, age, email, onDelete }) {
  return <div>{name}</div>;
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default User;
```

---

## Full Component Migration Example

### BEFORE (React 16 Class Component)

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';

class UserProfile extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      loading: true,
      error: null,
      editMode: false
    };
  }

  UNSAFE_componentWillMount() {
    this.loadUser();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.loadUser(nextProps.userId);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.editMode !== this.state.editMode) {
      console.log('Edit mode changing to:', nextState.editMode);
    }
  }

  loadUser = async (userId = this.props.userId) => {
    this.setState({ loading: true });

    try {
      const response = await axios.get(`/api/users/${userId}`);
      const formattedDate = moment(response.data.createdAt).format('MMMM Do YYYY');
      
      this.setState({
        userData: { ...response.data, createdAt: formattedDate },
        loading: false
      });

      this.props.dispatch({
        type: 'SET_CURRENT_USER',
        payload: response.data
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false
      });
    }
  };

  handleEditToggle = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  handleSaveUser = _.debounce(async (updates) => {
    try {
      const response = await axios.put(
        `/api/users/${this.props.userId}`,
        updates
      );
      
      this.setState({ 
        userData: response.data,
        editMode: false 
      }, () => {
        console.log('User updated:', this.state.userData);
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }, 500);

  render() {
    const { userData, loading, error, editMode } = this.state;
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="user-profile">
        <h1>{userData.name}</h1>
        <p>Email: {userData.email}</p>
        <p>Member Since: {userData.createdAt}</p>
        
        {editMode && (
          <form onSubmit={(e) => {
            e.preventDefault();
            this.handleSaveUser({ name: userData.name });
          }}>
            <input 
              value={userData.name}
              onChange={(e) => this.setState({
                userData: { ...userData, name: e.target.value }
              })}
            />
            <button type="submit">Save</button>
          </form>
        )}
        
        <button onClick={this.handleEditToggle}>
          {editMode ? 'Cancel' : 'Edit'}
        </button>
        <button onClick={() => this.props.history.push('/users')}>
          Back
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.current
});

export default withRouter(connect(mapStateToProps)(UserProfile));
```

### AFTER (React 18 Functional Component)

```javascript
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import _ from 'lodash';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const user = useSelector((state) => state.user.current);

  const loadUser = useCallback(async (id = userId) => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/users/${id}`);
      const formattedDate = format(
        new Date(response.data.createdAt), 
        'MMMM d, yyyy'
      );
      
      setUserData({ 
        ...response.data, 
        createdAt: formattedDate 
      });

      dispatch({
        type: 'SET_CURRENT_USER',
        payload: response.data
      });

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    loadUser();
  }, [userId, loadUser]);

  useEffect(() => {
    console.log('Edit mode changing to:', editMode);
  }, [editMode]);

  const handleSaveUser = useCallback(
    _.debounce(async (updates) => {
      try {
        const response = await axios.put(
          `/api/users/${userId}`,
          updates
        );
        
        setUserData(response.data);
        setEditMode(false);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }, 500),
    [userId]
  );

  const handleEditToggle = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);

  const handleNameChange = useCallback((newName) => {
    setUserData(prev => ({ ...prev, name: newName }));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-profile">
      <h1>{userData?.name}</h1>
      <p>Email: {userData?.email}</p>
      <p>Member Since: {userData?.createdAt}</p>
      
      {editMode && (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveUser({ name: userData.name });
        }}>
          <input 
            value={userData?.name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      )}
      
      <button onClick={handleEditToggle}>
        {editMode ? 'Cancel' : 'Edit'}
      </button>
      <button onClick={() => navigate('/users')}>
        Back
      </button>
    </div>
  );
}

export default UserProfile;
```

**Key Improvements:**
- Removed 8+ deprecated APIs
- Better error handling with try/catch/finally
- Cleaner state management with multiple useState
- Proper use of useCallback for optimization
- date-fns replaces moment (67KB saved)
- More readable and maintainable code
- Better TypeScript support (for future migration)

---

## Testing Migration Examples

### OLD (Jest 24 + Testing Library 9)

```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Dashboard from './Dashboard';
import store from './redux/store';

describe('Dashboard', () => {
  it('renders dashboard', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
  });

  it('loads stats on mount', async () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total Sales/i)).toBeInTheDocument();
    });
  });
});
```

### NEW (Jest 29 + Testing Library 14)

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Dashboard from './Dashboard';
import store from './redux/store';

describe('Dashboard', () => {
  it('renders dashboard', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
  });

  it('loads stats on mount', async () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total Sales/i)).toBeInTheDocument();
    });
  });
});
```

**Changes:**
- Import organization simplified
- `getByText` works better with React 18
- Async updates handled automatically
- No breaking test changes needed

---

**End of Migration Examples**
