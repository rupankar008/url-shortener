import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

function Redirect() {
  const { shortId } = useParams(); // Get the shortId from the URL
  const navigate = useNavigate();

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
          alert('URL not found');
          navigate('/'); // Redirect to home if URL not found
        }
      } catch (error) {
        alert('Error fetching URL: ' + error.message);
      }
    };

    fetchUrl();
  }, [shortId, navigate]);

  return <p>Redirecting...</p>;
}

export default Redirect;
