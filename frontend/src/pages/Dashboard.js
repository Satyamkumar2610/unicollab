import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import {
  LayoutDashboard,
  Plus,
  FolderOpen,
  Users,
  ArrowRight,
  Activity,
  Star,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProjects: 0, activeProjects: 0, collaborations: 0 });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects?.slice(0, 3) || []);
      setStats({
        totalProjects: response.data.projects?.length || 0,
        activeProjects: response.data.projects?.filter(p => p.status === 'active').length || 0,
        collaborations: response.data.projects?.length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600 mb-2">
            Welcome back, Creator!
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to collaborate, create, and innovate today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Projects</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.totalProjects}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                <FolderOpen className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Projects</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.activeProjects}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                <Activity className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Collaborations</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.collaborations}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/projects/create">
            <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Project</h3>
                <p className="text-muted-foreground text-sm">Start a new collaboration and invite others</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/browse">
            <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Projects</h3>
                <p className="text-muted-foreground text-sm">Find exciting projects to join and contribute to</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">My Profile</h3>
                <p className="text-muted-foreground text-sm">Manage your skills, portfolio, and settings</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Recent Projects
            </h2>
            <Link to="/projects">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map(project => (
                <Link key={project._id} to={`/projects/${project._id}`}>
                  <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg group">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                        <Star className="w-4 h-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                      </div>
                      <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                        <div className="flex -space-x-2">
                          {/* Placeholder for member avatars */}
                          <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-background"></div>
                          <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-background"></div>
                          <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-background flex items-center justify-center text-[10px] text-white">
                            +{project.members?.length || 0}
                          </div>
                        </div>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  You haven't created or joined any projects yet. Start your journey by creating a new project!
                </p>
                <Link to="/projects/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
