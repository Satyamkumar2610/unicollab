import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Calendar, Users, Tag, Layers, Sparkles, Rocket } from 'lucide-react';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    maxMembers: '',
    deadline: '',
    category: '',
    status: 'planning'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : undefined
      };

      await api.post('/projects', projectData);
      navigate('/projects');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
      { }
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] opacity-20 animate-pulse-slow delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>

          <Card className="bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-violet-500 to-blue-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Rocket className="w-6 h-6" />
                </div>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Create New Project
                </CardTitle>
              </div>
              <p className="text-muted-foreground pl-[52px]">
                Launch your next big idea and find the perfect team.
              </p>
            </CardHeader>
            <CardContent className="mt-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive p-4 mb-6 rounded-xl text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Sparkles className="w-3.5 h-3.5" /> Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all text-foreground"
                    placeholder="e.g., AI-Powered Study Assistant"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium leading-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all text-foreground resize-none"
                    placeholder="Describe your project's goals, vision, and what you're looking for..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Layers className="w-4 h-4" /> Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all appearance-none cursor-pointer text-foreground"
                      >
                        <option value="" className="bg-background">Select category</option>
                        <option value="web-development" className="bg-background">Web Development</option>
                        <option value="mobile-app" className="bg-background">Mobile App</option>
                        <option value="ai-ml" className="bg-background">AI/ML</option>
                        <option value="research" className="bg-background">Research</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="h-4 w-4 border-l-2 border-b-2 border-muted-foreground transform -rotate-45 translate-y-[-2px]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Users className="w-4 h-4" /> Max Members
                    </label>
                    <input
                      type="number"
                      name="maxMembers"
                      value={formData.maxMembers}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all text-foreground"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Tag className="w-4 h-4" /> Required Skills
                  </label>
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all text-foreground"
                    placeholder="e.g., React, Node.js, Python (comma separated)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Calendar className="w-4 h-4" /> Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all text-foreground [color-scheme:dark]"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium leading-none text-muted-foreground group-focus-within:text-primary transition-colors">Status</label>
                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all appearance-none cursor-pointer text-foreground"
                      >
                        <option value="planning" className="bg-background">Planning</option>
                        <option value="active" className="bg-background">Active</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="h-4 w-4 border-l-2 border-b-2 border-muted-foreground transform -rotate-45 translate-y-[-2px]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/projects')}
                    className="flex-1 h-11 border-white/10 hover:bg-white/5 hover:text-foreground order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 order-1 sm:order-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        Create Project
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProject;
