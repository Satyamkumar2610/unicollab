import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Code, Terminal, ExternalLink, Compass, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const resources = [
    {
        category: "Getting Started",
        items: [
            { title: "Introduction to UniCollab", type: "article", icon: BookOpen, readTime: "5 min" },
            { title: "Setting up your profile", type: "video", icon: Video, readTime: "10 min" },
            { title: "Finding your first team", type: "guide", icon: Compass, readTime: "8 min" }
        ]
    },
    {
        category: "Development",
        items: [
            { title: "Best Practices for React", type: "article", icon: Code, readTime: "15 min" },
            { title: "Git Workflow Guide", type: "guide", icon: Terminal, readTime: "12 min" },
            { title: "API Documentation", type: "docs", icon: FileText, readTime: "N/A" }
        ]
    }
];



const Resources = () => {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600 mb-4"
                    >
                        Learning Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground"
                    >
                        Guides, tutorials, and documentation to help you succeed.
                    </motion.p>
                </div>

                <div className="grid gap-8">
                    {resources.map((section, idx) => (
                        <motion.div
                            key={section.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                {section.category}
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.items.map((item, itemIdx) => (
                                    <Card key={itemIdx} className="hover:border-primary/50 transition-colors cursor-pointer group">
                                        <CardHeader>
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                            <CardDescription className="flex items-center justify-between mt-2">
                                                <span className="capitalize">{item.type}</span>
                                                <span>{item.readTime}</span>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                                                Read Now <ExternalLink className="w-4 h-4 ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Resources;
