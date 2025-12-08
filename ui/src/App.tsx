import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function App() {
  const { token, logout } = useAuth();

  return (
    <div>
      <h1>Quote App</h1>
      {token ? (
        <>
          <Link to="/add-quote">Add Quote</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default App;