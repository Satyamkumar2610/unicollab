import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { LoadingState, EmptyState } from '../components';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { cn } from '../utils/cn';
import { Sparkles, TrendingUp, Target, Users, ArrowRight, Star } from 'lucide-react';

const Recommendations = () => {
  const [forYou, setForYou] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const [forYouRes, trendingRes] = await Promise.all([
        api.get('/recommendations/for-you?limit=6'),
        api.get('/recommendations/trending?limit=6')
      ]);
      setForYou(forYouRes);
      setTrending(trendingRes);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Finding perfect projects for you..." />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3 mr-2" />
            Personalized For You
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-violet-400">
            Recommended Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover projects that match your skills and interests
          </p>
        </motion.div>

        {/* For You Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">For You</h2>
            {forYou.length > 0 && forYou[0].matchScore && (
              <span className="text-sm text-muted-foreground">
                Based on your skills and interests
              </span>
            )}
          </div>
          
          {forYou.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forYou.map(project => (
                <ProjectCard key={project._id} project={project} showMatch />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recommendations yet"
              message="Complete your profile with skills to get personalized recommendations"
            />
          )}
        </section>

        {/* Trending Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Trending This Week</h2>
          </div>
          
          {trending.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No trending projects"
              message="Check back soon for trending projects"
            />
          )}
        </section>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, showMatch }) => (
  <Link to={`/projects/${project._id}`}>
    <Card className="h-full bg-card/40 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
            project.status === 'active'
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          )}>
            {project.status}
          </span>
          {showMatch && project.matchScore && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs font-medium text-primary">{project.matchScore}% match</span>
            </div>
          )}
        </div>
        
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {project.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.requiredSkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>{project.members?.length || 0} members</span>
          </div>
          <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default Recommendations;
