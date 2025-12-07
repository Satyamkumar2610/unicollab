import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import {
    Users,
    Calendar,
    Trash2,
    LogOut,
    ExternalLink,
    AlertCircle
} from 'lucide-react';

const Collaborations = () => {
    const { user, loading: authLoading } = useAuth();
    const [collaborations, setCollaborations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!authLoading && user) {
            fetchCollaborations();
        } else if (!authLoading && !user) {
            setLoading(false);
            setError('Please log in to view collaborations');
        }
    }, [user, authLoading]);

    const fetchCollaborations = async () => {
        if (!user || !user.id) {
            console.log('User not found in context, skipping fetch');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('Fetching collaborations from dedicated endpoint');
            console.log('API config baseURL:', api.defaults.baseURL);

            const response = await api.get('/users/collaborations');
            console.log('Collaborations response raw:', response);

            const projects = Array.isArray(response) ? response : (response.data || []);

            if (!Array.isArray(projects)) {
                console.error('Invalid projects data format:', projects);
                throw new Error('Invalid data received from server');
            }

            console.log('Collaborations loaded:', projects);
            setCollaborations(projects);
            setError(null);
        } catch (err) {
            console.error('Error fetching collaborations:', err);
            setError('Failed to load collaborations. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (projectId) => {
        if (!window.confirm('Are you sure you want to withdraw from this collaboration?')) return;

        try {
            await api.post(`/projects/${projectId}/leave`);
            setCollaborations(prev => prev.filter(p => p._id !== projectId));
        } catch (err) {
            console.error('Error withdrawing:', err);
            alert('Failed to withdraw from project');
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this collaboration record? This will remove you from the project.')) return;

        try {

            await api.post(`/projects/${projectId}/leave`);
            setCollaborations(prev => prev.filter(p => p._id !== projectId));
        } catch (err) {
            console.error('Error deleting:', err);
            alert('Failed to delete collaboration');
        }
    };

    if (loading) return <LoadingState />;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
<div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold">My Collaborations</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Manage the projects you are contributing to. View details, track progress, or leave projects you are no longer active in.
                    </p>
                </motion.div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {collaborations.length === 0 ? (
                    <Card className="border-dashed border-white/10 bg-card/20 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mb-6">
                                <Users className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No active collaborations</h3>
                            <p className="text-muted-foreground mb-8 max-w-sm">
                                You haven't joined any projects yet. Browse projects to find teams looking for your skills!
                            </p>
                            <Link to="/browse">
                                <Button size="lg" className="shadow-lg shadow-primary/20">
                                    Browse Projects
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {collaborations.map((project) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                layout
                            >
                                <Card className="group hover:border-orange-500/30 transition-all duration-300 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${project.status === 'active'
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                        }`}>
                                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                            {project.owner?.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span>Owner: {project.owner?.name || 'Unknown'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Joined: {new Date(project.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Link to={`/projects/${project._id}`}>
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <ExternalLink className="w-4 h-4" />
                                                        View
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                                    onClick={() => handleWithdraw(project._id)}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Withdraw
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                                    onClick={() => handleDelete(project._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collaborations;
