import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ThreeDots } from 'react-loader-spinner';
import { Bar } from 'react-chartjs-2'; // Import the Bar chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaEye, FaTrash, FaLinkedin, FaGithub, FaGlobe, FaTwitter, FaTimes, FaInstagram, FaDiscord } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6';
import AboutMeModal from './AboutMeModal';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserUrls(currentUser.uid);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserUrls = async (userId) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
        shortUrl,
        userId: user.uid,
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

  // Data for the Bar Chart
  const chartData = {
    labels: urls.map((url) => url.shortId),
    datasets: [
      {
        label: 'Number of Visits',
        data: urls.map((url) => url.visits),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'URL Visits',
      },
    },
  };

  return (
    <section className="w-full min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md text-gray-900 p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold uppercase text-indigo-600">Dashboard</h2>
          <div className="flex space-x-4">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
              onClick={() => setShowAboutMe(true)}
            >
              About Me
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 p-3 border rounded focus:outline-none focus:ring focus:border-indigo-300"
          />
          <button
            className="bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700 transition duration-200"
            onClick={shortenUrl}
          >
            Shorten URL
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <ThreeDots color="#4A90E2" height={50} width={50} />
          </div>
        ) : (
          <>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left font-bold uppercase text-gray-600">Index</th>
                    <th className="px-4 py-2 text-left font-bold uppercase text-gray-600">Original URL</th>
                    <th className="px-4 py-2 text-left font-bold uppercase text-gray-600">Shortened URL</th>
                    <th className="px-4 py-2 text-left font-bold uppercase text-gray-600">Visits</th>
                    <th className="px-4 py-2 text-left font-bold uppercase text-gray-600">Created On</th>
                    <th className="px-4 py-2 text-left font-bold uppercase text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {urls.map((url, index) => (
                    <tr key={url.id} className="hover:bg-gray-100 transition duration-200">
                      <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-800">{url.originalUrl}</td>
                      <td className="px-4 py-2 text-indigo-600 underline cursor-pointer" onClick={() => window.open(`/${url.shortId}`, '_blank')}>
                        {url.shortUrl}
                      </td>
                      <td className="px-4 py-2 text-gray-800">{url.visits}</td>
                      <td className="px-4 py-2 text-gray-800">
                        {url.createdAt?.seconds
                          ? new Date(url.createdAt.seconds * 1000).toLocaleString()
                          : new Date(url.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200"
                          onClick={() => (url.active ? window.open(`/${url.shortId}`, '_blank') : alert('This link is currently deactivated.'))}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                          onClick={() => deleteLink(url.id)}
                        >
                          <FaTrash />
                        </button>
                        <select
                          value={url.active ? 'Active' : 'Deactive'}
                          className="border rounded px-2 py-1"
                          onChange={(e) => toggleActive(url.id, e.target.value === 'Active')}
                        >
                          <option value="Active">Active</option>
                          <option value="Deactive">Deactive</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold uppercase text-indigo-600 my-4">Visit chart</h2>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </>
        )}

        <AboutMeModal setShowAboutMe={setShowAboutMe} showAboutMe={showAboutMe}/>


        <footer className="text-center text-gray-500 mt-6">Made with ❤️ by Rupankar</footer>
      </div>
    </section>
  );
}

export default Dashboard;
