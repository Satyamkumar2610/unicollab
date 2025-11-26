import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-20 text-center text-white text-xl">Loading...</div>;
  if (!project) return <div className="pt-20 text-center text-white text-xl">Project not found</div>;

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/projects')}
          className="mb-6 text-white font-semibold hover:text-gray-200 transition"
        >
          ← Back to Projects
        </button>

        <div className="card p-8 animate-slide-up">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{project.title}</h1>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                {project.status}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Project Details</h3>
              <div className="space-y-3">
                <p><strong>Owner:</strong> {project.owner?.name}</p>
                <p><strong>Category:</strong> {project.category || 'N/A'}</p>
                <p><strong>Members:</strong> {project.members?.length || 0}</p>
                {project.maxMembers && <p><strong>Max Members:</strong> {project.maxMembers}</p>}
                {project.deadline && <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Required Skills</h3>
              {project.requiredSkills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No specific skills required</p>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Team Members</h3>
            {project.members?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.members.map((member, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-gray-600 text-sm">{member.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No members yet</p>
            )}
          </div>

          <button className="btn-primary w-full mt-8">
            Join Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
