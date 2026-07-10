import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCopy, FaSignOutAlt, FaLink } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/auth');
      
      const res = await axios.get(`${API_BASE}/api/links`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLinks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/shorten`, 
        { original_url: url },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUrl('');
      fetchLinks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0 d-flex align-items-center gap-2">
          <FaLink className="text-primary" /> DevTrack Links
        </h2>
        <button className="btn btn-outline-light d-flex align-items-center gap-2" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="glass-card mb-5">
        <form onSubmit={handleShorten} className="d-flex gap-3 flex-column flex-md-row">
          <input 
            type="url" 
            className="form-control form-control-lg flex-grow-1" 
            placeholder="Paste your long URL here... (e.g. https://example.com/very/long/path)" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary btn-lg px-5">Shorten</button>
        </form>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      <h4 className="fw-semibold mb-4 text-white">Your Links</h4>
      {links.length === 0 ? (
        <p className="text-muted-custom">You haven't shortened any links yet.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {links.map((link) => (
            <div key={link.id} className="link-item">
              <div className="overflow-hidden pe-3">
                <a 
                  href={`${API_BASE}/${link.short_code}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="short-url fs-5 d-block mb-1 text-truncate"
                >
                  {API_BASE}/{link.short_code}
                </a>
                <div className="text-muted-custom text-truncate">{link.original_url}</div>
              </div>
              <button 
                className="copy-btn flex-shrink-0" 
                title="Copy to clipboard"
                onClick={() => navigator.clipboard.writeText(`${API_BASE}/${link.short_code}`)}
              >
                <FaCopy size={22} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
