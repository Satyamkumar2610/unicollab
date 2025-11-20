import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Connect & Collaborate
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join a vibrant community of university students. Create projects, find teammates, and build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🚀', title: 'Create Projects', desc: 'Start your own collaborative projects and find team members' },
            { icon: '🤝', title: 'Join Teams', desc: 'Discover exciting projects and contribute your skills' },
            { icon: '🎯', title: 'Build Network', desc: 'Connect with like-minded students from your university' }
          ].map((item, i) => (
            <div key={i} className="card p-8 text-center hover:shadow-xl transition">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
