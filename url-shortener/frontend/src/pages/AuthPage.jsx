import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLink } from 'react-icons/fa';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';
    
    try {
      const res = await axios.post(url, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="row justify-content-center align-items-center min-vh-100 mt-n5">
      <div className="col-md-5">
        <div className="glass-card text-center">
          <FaLink size={40} className="text-primary mb-3" />
          <h2 className="fw-bold mb-4">DevTrack Links</h2>
          
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control form-control-lg" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className="mb-4">
              <input 
                type="password" 
                className="form-control form-control-lg" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button className="btn btn-primary btn-lg w-100 mb-3" type="submit">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <p className="text-muted-custom mb-0">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" className="text-primary text-decoration-none fw-bold" onClick={(e) => {
              e.preventDefault();
              setIsLogin(!isLogin);
              setError('');
            }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
