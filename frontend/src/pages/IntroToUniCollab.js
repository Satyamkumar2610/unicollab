import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Zap, Users, Globe, Rocket, ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { cn } from '../utils/cn';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
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

const IntroToUniCollab = () => {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden pt-24 pb-12">
            {}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
                <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] opacity-40 animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] opacity-30" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        to="/resources"
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "mb-8 pl-0 hover:pl-2 transition-all hover:bg-transparent hover:text-primary"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Resources
                    </Link>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {}
                    <motion.div variants={itemVariants} className="text-center mb-20">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                            <Rocket className="w-4 h-4 mr-2" />
                            Launch your career
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-indigo-600 tracking-tight leading-tight">
                            Introduction to UniCollab
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Welcome to the future of student collaboration. UniCollab bridges the gap between academic learning and real-world innovation through project-based experiences.
                        </p>
                    </motion.div>

                    {}
                    <motion.div variants={itemVariants} className="prose prose-lg dark:prose-invert max-w-4xl mx-auto mb-20 text-center">
                        <p className="text-lg text-foreground/80">
                            UniCollab is more than just a project management tool; it's a vibrant ecosystem where students from diverse disciplines come together to innovate, create, and grow. Whether you're a developer, designer, researcher, or entrepreneur, UniCollab provides the platform you need to turn your ideas into reality.
                        </p>
                    </motion.div>

                    {}
                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 mb-24">
                        <FeatureCard
                            icon={<Zap className="w-7 h-7" />}
                            title="Project-Based Learning"
                            description="Gain practical experience by working on real projects. Apply what you learn in class to solve actual problems."
                            color="text-yellow-500"
                            bgColor="bg-yellow-500/10"
                        />
                        <FeatureCard
                            icon={<Users className="w-7 h-7" />}
                            title="Cross-Disciplinary Teams"
                            description="Collaborate with peers from different majors. Engineers, artists, and business students working together."
                            color="text-violet-500"
                            bgColor="bg-violet-500/10"
                        />
                        <FeatureCard
                            icon={<Globe className="w-7 h-7" />}
                            title="Global Network"
                            description="Connect with talented students beyond your campus. Build a professional network that spans universities."
                            color="text-blue-500"
                            bgColor="bg-blue-500/10"
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-7 h-7" />}
                            title="Portfolio Building"
                            description="Showcase your contributions and skills. Create a portfolio that stands out to future employers."
                            color="text-green-500"
                            bgColor="bg-green-500/10"
                        />
                    </motion.div>

                    {}
                    <motion.div variants={itemVariants} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-600/20 blur-3xl rounded-3xl opacity-50" />
                        <div className="relative bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Rocket className="w-64 h-64 transform rotate-45" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to start your journey?</h2>
                            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
                                Join thousands of students already building the future on UniCollab. Your next big project awaits.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                <Link
                                    to="/register"
                                    className={cn(
                                        buttonVariants({ size: "lg", variant: "glow" }),
                                        "text-lg px-8 h-14"
                                    )}
                                >
                                    Sign Up Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link
                                    to="/browse"
                                    className={cn(
                                        buttonVariants({ size: "lg", variant: "outline" }),
                                        "text-lg px-8 h-14 border-white/10 hover:bg-white/5 hover:text-white backdrop-blur-sm transition-colors"
                                    )}
                                >
                                    Explore Projects
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, color, bgColor }) => (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/40 backdrop-blur-sm border-white/5 overflow-hidden">
        <CardContent className="p-8">
            <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center mb-6 ${color} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{title}</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
                {description}
            </p>
        </CardContent>
    </Card>
);

export default IntroToUniCollab;
