import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { cn } from '../utils/cn';
import {
  LayoutDashboard,
  Plus,
  FolderOpen,
  Users,
  ArrowRight,
  Activity,
  Star,
  Clock,
  Sparkles,
  Target
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

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalProjects: 0, activeProjects: 0, collaborations: 0 });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      
      const statsRes = await api.get('/users/stats');
      setStats(statsRes);

      
      const projectsRes = await api.get(`/projects?member=${user._id}&limit=3`);
      setProjects(projectsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
      {}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-20 animate-pulse-slow delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-2" />
            Welcome Back
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-violet-400 mb-4 tracking-tight drop-shadow-sm">
            Hello, {user?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Ready to collaborate, create, and innovate today? Here's what's happening in your workspace.
          </p>
        </motion.div>

        {}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-card/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Projects</p>
                  <h3 className="text-3xl font-bold text-foreground group-hover:text-blue-500 transition-colors">{stats.totalProjects}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                  <FolderOpen className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Projects</p>
                  <h3 className="text-3xl font-bold text-foreground group-hover:text-purple-500 transition-colors">{stats.activeProjects}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                  <Activity className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card/40 backdrop-blur-xl border border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Collaborations</p>
                  <h3 className="text-3xl font-bold text-foreground group-hover:text-orange-500 transition-colors">{stats.collaborations}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300 border border-orange-500/20">
                  <Users className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants}>
            <Link to="/projects/create" className="block h-full">
              <Card className="h-full bg-card/30 backdrop-blur-sm border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10 shadow-inner">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Create Project</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Start a new collaboration and invite others to join your vision</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/browse" className="block h-full">
              <Card className="h-full bg-card/30 backdrop-blur-sm border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/10 shadow-inner">
                    <LayoutDashboard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">Browse Projects</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Find exciting projects to join and contribute your skills to</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/profile" className="block h-full">
              <Card className="h-full bg-card/30 backdrop-blur-sm border border-white/5 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/10 shadow-inner">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors">My Profile</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Manage your skills, portfolio, and personal settings</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Recent Projects
            </h2>
            <Link to="/projects">
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map(project => (
                <Link key={project._id} to={`/projects/${project._id}`}>
                  <Card className="h-full bg-card/40 backdrop-blur-sm border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          project.status === 'active'
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        )}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                        <Star className="w-4 h-4 text-muted-foreground/50 group-hover:text-yellow-500 transition-colors" />
                      </div>
                      <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors text-lg">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm mt-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-4 border-t border-white/5">
                        <div className="flex -space-x-2">
                          {}
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-background flex items-center justify-center text-[8px] font-bold text-primary">
                            {project.owner?.name?.charAt(0) || '?'}
                          </div>
                          {project.members?.length > 1 && (
                            <div className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center text-[8px] text-muted-foreground font-medium">
                              +{project.members.length - 1}
                            </div>
                          )}
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-white/10 bg-card/20 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mb-6 animate-pulse-slow">
                  <FolderOpen className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-8 max-w-sm">
                  You haven't created or joined any projects yet. Start your journey by creating a new project!
                </p>
                <Link to="/projects/create">
                  <Button size="lg" className="shadow-lg shadow-primary/20">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
