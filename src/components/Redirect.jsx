import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { ThreeDots } from 'react-loader-spinner'; // Importing the spinner

function Redirect() {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const q = query(collection(db, 'urls'), where('shortId', '==', shortId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const urlDoc = querySnapshot.docs[0];
          const originalUrl = urlDoc.data().originalUrl;

          // Update the visit count
          const urlDocRef = doc(db, 'urls', urlDoc.id);
          await updateDoc(urlDocRef, {
            visits: (urlDoc.data().visits || 0) + 1, // Increment the visit count
          });

          // Redirect to the original URL
          window.location.href = originalUrl;
        } else {
          setError('URL not found.');
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching URL: ' + error.message);
        setLoading(false);
      }
    };

    fetchUrl();
  }, [shortId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <ThreeDots color="#4A90E2" height={50} width={50} />
          <p className="text-gray-600 mt-4">Redirecting...</p>
        </div>
      ) : (
        error && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-red-500 font-bold">{error}</p>
            <button
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Redirect;
