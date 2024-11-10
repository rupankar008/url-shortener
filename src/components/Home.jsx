import { useState } from 'react';
import './Home.css';

function Home() {
  const [isColorful, setIsColorful] = useState(false);

  // Function to handle the background change
  const handleLoginClick = () => {
    setIsColorful(true);
  };

  return (
    <div className={`home-container ${isColorful ? 'colorful-background' : ''}`}>
      <div className="home-content">
        <h1>Welcome to MinimURL</h1>
        <p className="home-description">
          Easily shorten your long URLs and share them with ease. Sign up or log in to get started!
        </p>
        <div className="home-links">
          <a href="/login" className="home-button" onClick={handleLoginClick}>
            Login
          </a>
          <span className="divider">|</span>
          <a href="/register" className="home-button">Register</a>
        </div>
      </div>
      <footer className="home-footer">
        Made with ❤️ by Rupankar
      </footer>
    </div>
  );
}

export default Home;
