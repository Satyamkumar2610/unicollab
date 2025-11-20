import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProject = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleJoinProject = async () => {
    try {
      await api.post(`/projects/${id}/join`);
      fetchProject();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join project');
    }
  };

  const handleLeaveProject = async () => {
    try {
      await api.post(`/projects/${id}/leave`);
      fetchProject();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to leave project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <p className="text-white text-xl">Project not found</p>
        </div>
      </div>
    );
  }

  const isOwner = project.owner?._id === user?._id;
  const isMember = project.members?.some(member => member._id === user?._id);
  const canJoin = !isMember && (!project.maxMembers || project.members?.length < project.maxMembers);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className={`${getStatusColor(project.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {project.status}
                </span>
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {isOwner && (
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                  Edit Project
                </button>
              )}
              {canJoin && (
                <button 
                  onClick={handleJoinProject}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium transform hover:scale-105"
                >
                  Join Project
                </button>
              )}
              {isMember && !isOwner && (
                <button 
                  onClick={handleLeaveProject}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Leave Project
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-white/90 leading-relaxed">{project.description}</p>
            </div>

            {/* Required Skills */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills?.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white px-3 py-1 rounded-full text-sm border border-purple-300/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Team Members ({project.members?.length || 0})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.members?.map(member => (
                  <div key={member._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">{member.name}</h4>
                        <p className="text-white/70 text-sm">{member.university}</p>
                        <p className="text-white/70 text-sm">{member.major}</p>
                      </div>
                      {member._id === project.owner?._id && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Owner
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Project Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Owner:</span>
                  <span className="text-white font-medium">{project.owner?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Created:</span>
                  <span className="text-white font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {project.deadline && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Deadline:</span>
                    <span className="text-white font-medium">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/70">Members:</span>
                  <span className="text-white font-medium">
                    {project.members?.length || 0}
                    {project.maxMembers && `/${project.maxMembers}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
