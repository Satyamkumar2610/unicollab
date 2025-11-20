import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            🎓 UniCollab
          </h1>
          <p className="text-2xl text-white/90 mb-8 leading-relaxed">
            Connect, Collaborate, and Create Amazing Projects with Fellow Students
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
            Join a vibrant community of university students working together on innovative projects. 
            Discover opportunities, share your skills, and build something amazing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30"
            >
              Login
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Create Projects</h3>
              <p className="text-white/70">Start your own collaborative projects and find team members</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Join Teams</h3>
              <p className="text-white/70">Discover exciting projects and contribute your skills</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">Build Network</h3>
              <p className="text-white/70">Connect with like-minded students from your university</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;