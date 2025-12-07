import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { LoadingState, EmptyState, ErrorState, Pagination } from '../components';
import { useDebounce } from '../hooks/useDebounce';
import { cn } from '../utils/cn';
import {
  Search,
  Filter,
  Code,
  Smartphone,
  Cpu,
  Beaker,
  Users,
  ArrowRight,
  Sparkles,
  Globe
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

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    skills: '',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 9); // Show 9 projects per page
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.skills) params.append('skills', filters.skills);

      const response = await api.get(`/projects?${params.toString()}`);

      // Handle both paginated and non-paginated responses for backward compatibility
      if (response.data && response.metadata) {
        setProjects(response.data);
        setMetadata(response.metadata);
      } else {
        setProjects(Array.isArray(response) ? response : []);
        setMetadata(null);
      }
    } catch (err) {
      setError('Failed to fetch projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.category, filters.skills, page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-24 pb-12">
      { }
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] opacity-20 animate-pulse-slow delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-2" />
            Explore Innovation
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-violet-400 tracking-tight drop-shadow-sm">
            Discover Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find innovative projects and collaborate with talented students and professionals from around the world.
          </p>
        </motion.div>

        { }
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 sticky top-24 z-30"
        >
          <div className="p-4 bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-primary/5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 text-foreground"
                />
              </div>

              <div className="md:col-span-3 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer text-foreground"
                >
                  <option value="all" className="bg-background">All Categories</option>
                  <option value="web-development" className="bg-background">Web Development</option>
                  <option value="mobile-app" className="bg-background">Mobile App</option>
                  <option value="ai-ml" className="bg-background">AI/ML</option>
                  <option value="research" className="bg-background">Research</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="h-4 w-4 border-l-2 border-b-2 border-muted-foreground transform -rotate-45 translate-y-[-2px]" />
                </div>
              </div>

              <div className="md:col-span-4 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="skills"
                  placeholder="Filter by skills..."
                  value={filters.skills}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 text-foreground"
                />
              </div>
            </div>
          </div>
        </motion.div>

        { }
        {loading ? (
          <LoadingState message="Fetching latest projects..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : projects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No Projects Found"
            message="No projects match your current filters. Try a different search!"
          />
        )}

        {!loading && !error && projects.length > 0 && metadata && (
          <Pagination
            metadata={metadata}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'web-development': return <Globe className="w-4 h-4" />;
      case 'mobile-app': return <Smartphone className="w-4 h-4" />;
      case 'ai-ml': return <Cpu className="w-4 h-4" />;
      case 'research': return <Beaker className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Link to={`/projects/${project._id}`} className="block h-full group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-violet-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500"></div>
        <div className="h-full bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative flex flex-col hover:transform hover:scale-[1.02] transition-all duration-300">
          <div className="p-6 flex-grow">
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                {getCategoryIcon(project.category)}
                <span className="ml-1.5 capitalize">{project.category?.replace('-', ' ') || 'Project'}</span>
              </div>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
                project.status === 'active'
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}>
                {project.status}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>

            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
              {project.description}
            </p>

            {project.requiredSkills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.requiredSkills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-muted-foreground group-hover:border-primary/20 transition-colors">
                    {skill}
                  </span>
                ))}
                {project.requiredSkills.length > 3 && (
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-muted-foreground">
                    +{project.requiredSkills.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
                {project.owner?.name?.charAt(0) || '?'}
              </div>
              <span className="text-xs text-muted-foreground font-medium">{project.owner?.name || 'Anonymous'}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {project.members?.length || 0}
              </span>
              <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                View Details
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BrowseProjects;
