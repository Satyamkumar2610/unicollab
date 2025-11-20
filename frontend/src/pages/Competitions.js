import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Competitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/competitions', {
        params: { upcoming: true, status: 'all' }
      });
      setCompetitions(response.data.competitions || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      setError('Failed to load competitions. Please try again later.');
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompetition = async (competitionId) => {
    try {
      await api.post(`/competitions/${competitionId}/join`);
      // Refresh competitions to update participant count
      fetchCompetitions();
    } catch (error) {
      console.error('Error joining competition:', error);
      alert(error.response?.data?.message || 'Failed to join competition');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading competitions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Competitions</h3>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={fetchCompetitions}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            🏆 Competitions
          </h1>
          <p className="text-xl text-white/80">Showcase your skills and win amazing prizes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.length > 0 ? competitions.map(competition => (
            <div key={competition._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{competition.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  competition.status === 'open'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {competition.status}
                </span>
              </div>

              <p className="text-white/80 mb-4">{competition.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Prize:</span>
                  <span className="text-yellow-400 font-semibold">{competition.prize}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Participants:</span>
                  <span>{competition.participants?.length || 0}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Deadline:</span>
                  <span>{new Date(competition.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => competition.status === 'open' && handleJoinCompetition(competition._id)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  competition.status === 'open'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
                disabled={competition.status !== 'open'}
              >
                {competition.status === 'open' ? 'Join Competition' : 'Registration Closed'}
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-2">No competitions available</h3>
                <p className="text-white/70">Check back later for upcoming competitions!</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-2">Want to host a competition?</h3>
            <p className="text-white/70 mb-6">Contact us to organize your own coding competition or hackathon</p>
            <Link 
              to="/contact" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Competitions;
