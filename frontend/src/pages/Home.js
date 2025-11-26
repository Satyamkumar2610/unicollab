import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Users, Target, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Card className="h-full hover:border-primary/50 transition-colors group">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/20 rounded-full blur-[100px] opacity-30" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              🚀 The Future of Student Collaboration
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Build Together, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-600 to-indigo-600">
                Grow Faster.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join a vibrant community of university students. Create projects, find teammates, and build your portfolio with real-world experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/showcase">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              UniCollab provides the tools and network you need to turn your ideas into reality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Rocket}
              title="Launch Projects"
              description="Start your own collaborative projects and find the perfect team members to bring your vision to life."
              delay={0.1}
            />
            <FeatureCard
              icon={Users}
              title="Find Your Squad"
              description="Connect with talented students from your university and beyond. Build your dream team."
              delay={0.2}
            />
            <FeatureCard
              icon={Target}
              title="Build Portfolio"
              description="Showcase your work, gain practical experience, and build a portfolio that stands out to employers."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Why Students Love UniCollab</h2>
              <div className="space-y-4">
                {[
                  "Connect with peers across different majors",
                  "Gain real-world project management experience",
                  "Access exclusive learning resources and workshops",
                  "Get feedback from industry mentors"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-8" variant="secondary" asChild>
                <Link to="/resources">View Resources</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur-2xl opacity-20" />
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Active Community</h3>
                    <p className="text-sm text-muted-foreground">Growing every day</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-accent/50">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/50">
                    <div className="text-3xl font-bold text-violet-600">2k+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
