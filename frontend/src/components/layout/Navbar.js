import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Menu, X, LayoutDashboard, Compass, FolderPlus, User, LogOut, Users, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

import logo from '../../assets/logo.jpg';

const NavItem = ({ to, children, icon: Icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => cn(
      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "text-primary bg-primary/10"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </NavLink>
);

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          { }
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="UniCollab Logo"
              className="w-10 h-10 rounded-lg shadow-lg group-hover:shadow-primary/50 transition-all object-cover"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
              UniCollab
            </span>
          </Link>

          { }
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                <NavItem to="/browse" icon={Compass}>Browse</NavItem>
                <NavItem to="/teams" icon={Users}>Teams</NavItem>
                <NavItem to="/collaborations" icon={Handshake}>Collaborations</NavItem>
                <NavItem to="/create-project" icon={FolderPlus}>Create</NavItem>
              </>
            ) : null}
          </div>

          { }
          <div className="hidden md:flex items-center gap-4">

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Profile</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-destructive group-hover:bg-destructive/20 transition-all">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-destructive transition-colors">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="glow" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          { }
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      { }
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl absolute top-16 left-0 right-0 shadow-2xl z-40"
          >
            <div className="p-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <NavItem to="/dashboard" icon={LayoutDashboard} onClick={() => setIsMenuOpen(false)}>Dashboard</NavItem>
                  <NavItem to="/browse" icon={Compass} onClick={() => setIsMenuOpen(false)}>Browse Projects</NavItem>
                  <NavItem to="/teams" icon={Users} onClick={() => setIsMenuOpen(false)}>Teams</NavItem>
                  <NavItem to="/collaborations" icon={Handshake} onClick={() => setIsMenuOpen(false)}>Collaborations</NavItem>
                  <NavItem to="/create-project" icon={FolderPlus} onClick={() => setIsMenuOpen(false)}>Create Project</NavItem>

                  <NavItem to="/profile" icon={User} onClick={() => setIsMenuOpen(false)}>Profile</NavItem>
                  <div className="pt-3 mt-2 border-t border-white/10">
                    <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (

                <div className="pt-3 mt-2 border-t border-white/10 grid gap-3">
                  <Button variant="ghost" className="w-full justify-center" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button className="w-full justify-center" variant="glow" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>

              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
