import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Users, Target, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { Button, buttonVariants } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { cn } from '../utils/cn';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Card className="h-full bg-card/40 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300 border border-primary/10 shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      { }
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/20 rounded-full blur-[100px] opacity-30 animate-pulse-slow delay-1000" />
      </div>

      { }
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(124,58,237,0.2)]"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              The Future of Student Collaboration
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8 relative">
              <span className="relative z-10">Build Together,</span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-indigo-500 drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                Grow Faster.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Join a vibrant community of university students. Create projects, find teammates, and build your portfolio with real-world experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className={cn(
                  buttonVariants({ size: "lg", variant: "glow" }),
                  "text-lg px-8 h-14 rounded-full shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-300"
                )}
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/showcase"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "text-lg px-8 h-14 rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-sm transition-all duration-300"
                )}
              >
                Explore Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      { }
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Everything you need to succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              UniCollab provides the tools and network you need to turn your ideas into reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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

      { }
      <section className="py-24 border-t border-white/5 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Students Love UniCollab</h2>
              <div className="space-y-6">
                {[
                  "Connect with peers across different majors",
                  "Gain real-world project management experience",
                  "Access exclusive learning resources and workshops",
                  "Get feedback from industry mentors"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-lg text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                  </motion.div>
                ))}
              </div>
              <Button className="mt-8 md:mt-10 h-12 px-8 rounded-full w-full sm:w-auto" variant="secondary" asChild>
                <Link to="/resources">View Resources</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 rounded-3xl blur-3xl opacity-20 animate-pulse-slow" />
              <div className="relative bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Active Community</h3>
                    <p className="text-sm text-muted-foreground">Growing every day</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
                    <div className="text-4xl font-bold text-primary mb-1">500+</div>
                    <div className="text-sm text-muted-foreground font-medium">Projects</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-colors">
                    <div className="text-4xl font-bold text-violet-500 mb-1">2k+</div>
                    <div className="text-sm text-muted-foreground font-medium">Students</div>
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
