import { useState } from 'react';

function Home() {
  return (
    <div className="home-container bg-gradient-to-br from-blue-500 to-indigo-600 min-h-screen flex flex-col items-center justify-center text-white">
      <div className="home-content text-center p-6 max-w-2xl bg-white bg-opacity-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Flik</h1> {/* Updated name */}
        <p className="home-description text-lg mb-6">
          Easily shorten your long URLs and share them with ease. Sign up or log in to get started!
        </p>
        <div className="home-links flex justify-center space-x-6">
          <a
            href="/login"
            className="home-button bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold transition duration-300 transform hover:bg-indigo-700 hover:text-white hover:scale-105"
          >
            Login
          </a>
          <a
            href="/register"
            className="home-button bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold transition duration-300 transform hover:bg-indigo-700 hover:text-white hover:scale-105"
          >
            Register
          </a>
        </div>
      </div>
      <footer className="home-footer mt-10 text-sm opacity-80">
        Made with ❤️ by Rupankar
      </footer>
    </div>
  );
}

export default Home;
