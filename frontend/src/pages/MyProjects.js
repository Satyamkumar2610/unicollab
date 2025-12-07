import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { cn } from '../utils/cn';
import {
  Users,
  LogOut,
  Trash2,
  ExternalLink,
  Calendar,
  Briefcase,
  Plus,
  Layout,
  Clock
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('owned'); 

  const fetchData = useCallback(async () => {
    if (!user) return;

    const userId = user.id || user._id;
    if (!userId) return;

    try {
      const [projectsRes, requestsRes] = await Promise.all([
        api.get(`/projects?member=${userId}`),
        api.get('/collaboration-requests?type=sent&status=pending')
      ]);

      setProjects(projectsRes.data || []);
      setPendingRequests(requestsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleLeaveProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to leave this project?')) return;
    try {
      await api.post(`/projects/${projectId}/leave`);
      fetchData();
    } catch (error) {
      console.error('Error leaving project:', error);
      alert('Failed to leave project');
    }
  };

  const handleRemoveMember = async (projectId, memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`);
      fetchData();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    }
  };

  const handleWithdrawRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to withdraw this request?')) return;
    try {
      await api.delete(`/collaboration-requests/${requestId}`);
      fetchData();
    } catch (error) {
      console.error('Error withdrawing request:', error);
      alert('Failed to withdraw request');
    }
  };

  const userId = user?.id || user?._id;
  const ownedProjects = projects.filter(p => p.owner._id === userId);
  const joinedProjects = projects.filter(p => p.owner._id !== userId);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-24 pb-12">
      {}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-indigo-600">
              My Workspace
            </h1>
            <p className="text-lg text-muted-foreground">Manage your projects and collaborations</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link to="/projects/create">
              <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Create New Project
              </Button>
            </Link>
          </motion.div>
        </div>

        {}
        <div className="flex space-x-2 mb-8 p-1 bg-muted/30 backdrop-blur-sm rounded-xl border border-white/5 w-fit">
          {[
            { id: 'owned', label: 'My Projects', count: ownedProjects.length, icon: Layout },
            { id: 'joined', label: 'Collaborations', count: joinedProjects.length, icon: Users },
            { id: 'pending', label: 'Pending', count: pendingRequests.length, icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                activeTab === tab.id ? "bg-primary/10" : "bg-muted"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeTab}
          className="grid gap-6"
        >
          {activeTab === 'owned' ? (
            ownedProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ownedProjects.map(project => (
                  <motion.div key={project._id} variants={itemVariants}>
                    <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm border-white/5">
                      <CardHeader className="bg-muted/30 border-b border-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="mb-2">
                              <Link to={`/projects/${project._id}`} className="hover:text-primary transition-colors text-xl">
                                {project.title}
                              </Link>
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(project.createdAt).toLocaleDateString()}
                              </span>
                              <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                project.status === 'active'
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              )}>
                                {project.status}
                              </span>
                            </div>
                          </div>
                          <Link to={`/projects/${project._id}`}>
                            <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-foreground/80">
                          <Users className="w-4 h-4 text-primary" />
                          Team Members ({project.members.length})
                        </h4>
                        <div className="space-y-3">
                          {project.members.map(member => (
                            <div key={member._id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/50 hover:bg-background/80 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-primary text-sm font-bold border border-primary/10">
                                  {member.name?.charAt(0) || '?'}
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-sm font-medium truncate">{member.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                </div>
                              </div>
                              {member._id !== user._id ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                                  onClick={() => handleRemoveMember(project._id, member._id)}
                                  title="Remove member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Owner</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No projects yet"
                description="Create your first project to start collaborating with others!"
                action={
                  <Link to="/projects/create">
                    <Button>Create Project</Button>
                  </Link>
                }
              />
            )
          ) : activeTab === 'joined' ? (
            joinedProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {joinedProjects.map(project => (
                  <motion.div key={project._id} variants={itemVariants}>
                    <Card className="hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm border-white/5">
                      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            <Link to={`/projects/${project._id}`} className="hover:text-primary transition-colors">
                              {project.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                {project.owner.name?.charAt(0)}
                              </div>
                              <span className="text-foreground/80">{project.owner.name}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              Joined {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Link to={`/projects/${project._id}`} className="flex-1 md:flex-none">
                            <Button variant="outline" className="w-full">View Project</Button>
                          </Link>
                          <Button
                            variant="destructive"
                            className="flex-1 md:flex-none"
                            onClick={() => handleLeaveProject(project._id)}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Leave
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No collaborations yet"
                description="Join projects to see them here!"
                action={
                  <Link to="/browse">
                    <Button variant="outline">Browse Projects</Button>
                  </Link>
                }
              />
            )
          ) : (
            pendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map(request => (
                  <motion.div key={request._id} variants={itemVariants}>
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            Request to join <span className="text-primary">{request.project?.title}</span>
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Sent: {new Date(request.createdAt).toLocaleDateString()}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">
                              Pending
                            </span>
                          </div>
                          {request.message && (
                            <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm italic text-muted-foreground border border-white/5">
                              "{request.message}"
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                          onClick={() => handleWithdrawRequest(request._id)}
                        >
                          Withdraw Request
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title="No pending requests"
                description="Your sent requests will appear here."
                action={
                  <Link to="/browse">
                    <Button variant="outline">Browse Projects</Button>
                  </Link>
                }
              />
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-white/10 backdrop-blur-sm">
    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
    {action}
  </div>
);

export default MyProjects;
