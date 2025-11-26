import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, GitFork, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

// Mock data for showcase
const projects = [
    {
        id: 1,
        title: "EcoTrack",
        description: "A sustainable lifestyle tracking app built with React Native and Firebase.",
        tags: ["React Native", "Firebase", "Mobile"],
        stars: 120,
        forks: 45,
        views: 1200,
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
    },
    {
        id: 2,
        title: "DevConnect",
        description: "Social platform for developers to share code snippets and collaborate.",
        tags: ["Next.js", "TypeScript", "Prisma"],
        stars: 89,
        forks: 23,
        views: 850,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
    },
    {
        id: 3,
        title: "AI Writer",
        description: "GPT-3 powered writing assistant for content creators.",
        tags: ["Python", "FastAPI", "OpenAI"],
        stars: 256,
        forks: 89,
        views: 3400,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
    },
    {
        id: 4,
        title: "CryptoDash",
        description: "Real-time cryptocurrency dashboard with advanced charting.",
        tags: ["Vue.js", "D3.js", "WebSockets"],
        stars: 150,
        forks: 30,
        views: 1500,
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80"
    },
    {
        id: 5,
        title: "HealthMate",
        description: "Telemedicine platform connecting patients with doctors.",
        tags: ["React", "WebRTC", "Node.js"],
        stars: 78,
        forks: 15,
        views: 600,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
    },
    {
        id: 6,
        title: "LearnLoop",
        description: "Adaptive learning management system for schools.",
        tags: ["Angular", "NestJS", "PostgreSQL"],
        stars: 92,
        forks: 28,
        views: 920,
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80"
    }
];

const Showcase = () => {
    const [filter, setFilter] = useState('All');

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600 mb-4"
                    >
                        Project Showcase
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Discover amazing projects built by the UniCollab community.
                    </motion.p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {['All', 'Web', 'Mobile', 'AI/ML', 'Blockchain'].map((item) => (
                            <Button
                                key={item}
                                variant={filter === item ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter(item)}
                                className="whitespace-nowrap"
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" size="sm">View Details</Button>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-border pt-4 text-muted-foreground text-sm flex justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {project.stars}</span>
                                        <span className="flex items-center gap-1"><GitFork className="w-4 h-4" /> {project.forks}</span>
                                    </div>
                                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {project.views}</span>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Showcase;
