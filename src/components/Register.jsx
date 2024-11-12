import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError(''); // Clear any previous error messages
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create an account. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Register</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <input
          type="email"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="w-full p-3 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className={`w-full p-3 rounded text-white font-bold ${
            loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
          } transition duration-300`}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
