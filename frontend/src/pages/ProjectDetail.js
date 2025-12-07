import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import {
  ArrowLeft,
  Users,
  Calendar,
  Target,
  Mail,
  Crown,
  Code,
  Clock,
  CheckCircle2,
  UserPlus,
  LogOut,
  Sparkles,
  Globe,
  Smartphone,
  Cpu,
  Beaker
} from 'lucide-react';
import { cn } from '../utils/cn';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await api.post(`/projects/${id}/join`);
      const response = await api.get(`/projects/${id}`);
      setProject(response);
    } catch (error) {
      console.error('Error joining project:', error);
      alert(error.response?.data?.message || 'Failed to join project');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this project?')) return;

    setActionLoading(true);
    try {
      await api.post(`/projects/${id}/leave`);
      const response = await api.get(`/projects/${id}`);
      setProject(response);
    } catch (error) {
      console.error('Error leaving project:', error);
      alert('Failed to leave project');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!project) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/browse')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Browse Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user && project.owner && (project.owner._id === user._id || project.owner === user._id);
  const isMember = user && project.members && project.members.some(m => (m._id === user._id || m === user._id));

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'web-development': return <Globe className="w-5 h-5" />;
      case 'mobile-app': return <Smartphone className="w-5 h-5" />;
      case 'ai-ml': return <Cpu className="w-5 h-5" />;
      case 'research': return <Beaker className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow delay-700" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/browse')}
            className="gap-2 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/40 backdrop-blur-md border-white/10 mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm gap-2">
                      {getCategoryIcon(project.category)}
                      <span className="capitalize">{project.category?.replace('-', ' ') || 'Project'}</span>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm flex items-center gap-1.5",
                      project.status === 'active'
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    )}>
                      <CheckCircle2 className="w-3 h-3" />
                      {project.status}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-violet-400">
                    {project.title}
                  </h1>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {project.owner && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg backdrop-blur-sm inline-flex">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{project.owner.name}</p>
                        {project.owner.email && (
                          <a href={`mailto:${project.owner.email}`} className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {project.owner.email}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:min-w-[200px]">
                  {isOwner ? (
                    <div className="p-4 bg-secondary/30 border border-white/10 rounded-xl text-center">
                      <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">You own this project</p>
                    </div>
                  ) : isMember ? (
                    <Button
                      onClick={handleLeave}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
                      size="lg"
                    >
                      <LogOut className="w-5 h-5" />
                      Leave Project
                    </Button>
                  ) : (
                    <Button
                      onClick={handleJoin}
                      disabled={actionLoading}
                      className="w-full gap-2 shadow-lg shadow-primary/20"
                      size="lg"
                    >
                      <UserPlus className="w-5 h-5" />
                      Join Project
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/40 backdrop-blur-md border-white/10">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Project Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {project.deadline && (
                      <div className="flex items-start gap-3 p-3 bg-secondary/30 border border-white/5 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Deadline</p>
                          <p className="font-medium">{new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-3 bg-secondary/30 border border-white/5 rounded-lg">
                      <Users className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Team Size</p>
                        <p className="font-medium">
                          {project.members?.length || 0}
                          {project.maxMembers && ` / ${project.maxMembers}`} members
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-secondary/30 border border-white/5 rounded-lg">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>

                    {project.category && (
                      <div className="flex items-start gap-3 p-3 bg-secondary/30 border border-white/5 rounded-lg">
                        <Target className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium capitalize">{project.category.replace('-', ' ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {project.requiredSkills && project.requiredSkills.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.requiredSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-medium backdrop-blur-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/40 backdrop-blur-md border-white/10">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Members
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {project.members?.length || 0}
                  </span>
                </h2>

                {project.members && project.members.length > 0 ? (
                  <div className="space-y-3">
                    {project.members.map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-secondary/30 border border-white/5 rounded-lg hover:bg-secondary/40 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-sm font-bold text-primary border border-primary/10">
                          {member.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.name}</p>
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 truncate"
                            >
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No members yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Be the first to join!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
