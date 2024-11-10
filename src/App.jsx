// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard  from './components/Dasboard';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Redirect from './components/Redirect';
import './App.css'; // Import global styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/:shortId" element={<Redirect />} /> {/* Redirect route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
