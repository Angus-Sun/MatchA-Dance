import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UploadPage from './pages/UploadPage';
import Home from './pages/Home';
import ChallengePage from './pages/ChallengePage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">TokTik</h1>
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/upload">Upload</Link>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/challenge/:id" element={<ChallengePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;