import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

// Import and register components from chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import './Dashboard.css';

function Dashboard() {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]); // State to store all URLs
  const [showAboutMe, setShowAboutMe] = useState(false); // State to control About Me modal
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all URLs from Firestore when the component loads
    const fetchUrls = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'urls'));
        const urlsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUrls(urlsArray);
      } catch (error) {
        alert('Error fetching URLs: ' + error.message);
      }
    };

    fetchUrls();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const shortenUrl = async () => {
    if (!url) {
      alert('Please enter a valid URL!');
      return;
    }

    try {
      const uniqueId = Math.random().toString(36).substr(2, 5); // Generate a short, random ID
      const shortUrl = `${window.location.host}/${uniqueId}`;

      // Add the shortened URL to the Firestore database
      const docRef = await addDoc(collection(db, 'urls'), {
        originalUrl: url,
        shortId: uniqueId,
        shortUrl: shortUrl,
        createdAt: new Date(),
        visits: 0,
        active: true, // Default to active
      });

      // Update the state
      setUrls([
        ...urls,
        { id: docRef.id, originalUrl: url, shortId: uniqueId, shortUrl, createdAt: new Date(), visits: 0, active: true },
      ]);
      setUrl(''); // Clear the input field
    } catch (error) {
      alert('Error shortening URL: ' + error.message);
    }
  };

  const deleteLink = async (id) => {
    try {
      await deleteDoc(doc(db, 'urls', id));
      setUrls(urls.filter((url) => url.id !== id)); // Update the state
    } catch (error) {
      alert('Error deleting link: ' + error.message);
    }
  };

  const toggleActive = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'urls', id), { active: newStatus });
      setUrls(
        urls.map((url) => (url.id === id ? { ...url, active: newStatus } : url))
      ); // Update the state
    } catch (error) {
      alert('Error updating link status: ' + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="menu-buttons">
          <button className="about-me-button" onClick={() => setShowAboutMe(true)}>
            About Me
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="input-button-container">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button onClick={shortenUrl}>Shorten URL</button>
      </div>

      {showAboutMe && (
        <div className="about-me-modal">
          <div className="modal-content">
            <h3>About Me</h3>
            <p>
              Hi, users! My name is <strong>Rupankar Bhuiya</strong>. I am currently a student in Class 11, pursuing a science stream. 
              I have a deep passion for coding and development. From creating new projects to tackling complex challenges, 
              coding is not just a hobby for me; it’s a part of my life and my dream.
            </p>
            <p>
              I aspire to join an NIT (National Institute of Technology) and pursue a degree in <strong>Computer Science and Engineering (CSE)</strong>. 
              My dream is to make a significant impact in the tech world, and I am determined to work hard to achieve this goal.
            </p>
            <p>
              I live in <strong>West Bengal</strong>, and I am always working on big and exciting projects to prepare for the future. 
              My ambition drives me to keep learning and improving, and I am dedicated to bringing my ideas to life through code.
            </p>
            <button onClick={() => setShowAboutMe(false)}>Close</button>
          </div>
        </div>
      )}

      <h3>All Shortened URLs</h3>
      <table className="url-table">
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Shortened URL</th>
            <th>Visits</th>
            <th>Created On</th>
            <th>Graph</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id}>
              <td className="url-original">{url.originalUrl}</td>
              <td className="url-short">{`${window.location.host}/${url.shortId}`}</td>
              <td className="url-visits">{url.visits}</td>
              <td className="url-date">
                {url.createdAt && url.createdAt.seconds
                  ? new Date(url.createdAt.seconds * 1000).toLocaleString()
                  : new Date(url.createdAt).toLocaleString()}
              </td>
              <td className="url-graph">
                <Line
                  data={{
                    labels: Array.from({ length: url.visits }, (_, i) => `Visit ${i + 1}`),
                    datasets: [
                      {
                        label: 'Number of Visits',
                        data: Array.from({ length: url.visits }, (_, i) => i + 1),
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderColor: '#667eea',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      x: { display: false },
                      y: { beginAtZero: true, display: false },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true },
                    },
                  }}
                />
              </td>
              <td className="url-actions">
                <button
                  onClick={() => {
                    if (url.active) {
                      window.open(`/${url.shortId}`, '_blank');
                    } else {
                      alert('This link is currently deactivated.');
                    }
                  }}
                  className={url.active ? 'active-link' : 'inactive-link'}
                >
                  View
                </button>
                <button onClick={() => deleteLink(url.id)}>Delete</button>

                <div className="dropdown">
                  <button className="dropbtn">
                    {url.active ? 'Active' : 'Deactive'}
                  </button>
                  <div className="dropdown-content">
                    <button
                      className={url.active ? 'selected' : ''}
                      onClick={() => toggleActive(url.id, true)}
                    >
                      Activate
                    </button>
                    <button
                      className={!url.active ? 'selected' : ''}
                      onClick={() => toggleActive(url.id, false)}
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Author Footer */}
      <footer className="author-footer">
        Made with ❤️ by Rupankar
      </footer>
    </div>
  );
}

export default Dashboard;
