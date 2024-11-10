import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './Dashboard.css';

function Dashboard() {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserUrls(currentUser.uid);
      } else {
        navigate('/'); // Redirect to home if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserUrls = async (userId) => {
    try {
      const q = query(collection(db, 'urls'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const urlsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUrls(urlsArray);
    } catch (error) {
      alert('Error fetching URLs: ' + error.message);
    }
  };

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
      const uniqueId = Math.random().toString(36).substr(2, 5);
      const shortUrl = `${window.location.host}/${uniqueId}`;

      const docRef = await addDoc(collection(db, 'urls'), {
        originalUrl: url,
        shortId: uniqueId,
        shortUrl: shortUrl,
        userId: user.uid, // Associate URL with the logged-in user
        createdAt: new Date(),
        visits: 0,
        active: true,
      });

      setUrls([
        ...urls,
        { id: docRef.id, originalUrl: url, shortId: uniqueId, shortUrl, createdAt: new Date(), visits: 0, active: true },
      ]);
      setUrl('');
    } catch (error) {
      alert('Error shortening URL: ' + error.message);
    }
  };

  const deleteLink = async (id) => {
    try {
      await deleteDoc(doc(db, 'urls', id));
      setUrls(urls.filter((url) => url.id !== id));
    } catch (error) {
      alert('Error deleting link: ' + error.message);
    }
  };

  const toggleActive = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'urls', id), { active: newStatus });
      setUrls(
        urls.map((url) => (url.id === id ? { ...url, active: newStatus } : url))
      );
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

      {/* Modal */}
      <div className={`about-me-modal ${showAboutMe ? 'show' : ''}`}>
        <div className="modal-content">
          <h3>About Me</h3>
          <p>
            Hi, users! My name is <strong>Rupankar Bhuiya</strong>. I am currently a student in Class 11, pursuing a science stream.
            I have a deep passion for coding and development...
          </p>
          <button onClick={() => setShowAboutMe(false)}>Close</button>
        </div>
      </div>

      <h3>All Shortened URLs</h3>
      <div className="url-table-container">
      <table className="url-table">
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Shortened URL</th>
            <th>Visits</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id}>
              <td>{url.originalUrl}</td>
              <td>{url.shortUrl}</td>
              <td>{url.visits}</td>
              <td>
                {url.createdAt?.seconds
                  ? new Date(url.createdAt.seconds * 1000).toLocaleString()
                  : new Date(url.createdAt).toLocaleString()}
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
      </div>

      <footer className="author-footer">
        Made with ❤️ by Rupankar
      </footer>
    </div>
  );
}

export default Dashboard;
