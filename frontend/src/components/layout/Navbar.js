import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Menu, X, Sun, Moon, LayoutDashboard, Compass, FolderPlus, User, LogOut, Layers, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

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
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary/50 transition-all">
              U
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
              UniCollab
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                <NavItem to="/browse" icon={Compass}>Browse</NavItem>
                <NavItem to="/create-project" icon={FolderPlus}>Create</NavItem>
                <NavItem to="/showcase" icon={Layers}>Showcase</NavItem>
                <NavItem to="/resources" icon={BookOpen}>Resources</NavItem>
              </>
            ) : (
              <>
                <NavItem to="/showcase" icon={Layers}>Showcase</NavItem>
                <NavItem to="/resources" icon={BookOpen}>Resources</NavItem>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="p-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <NavItem to="/dashboard" icon={LayoutDashboard} onClick={() => setIsMenuOpen(false)}>Dashboard</NavItem>
                  <NavItem to="/browse" icon={Compass} onClick={() => setIsMenuOpen(false)}>Browse Projects</NavItem>
                  <NavItem to="/create-project" icon={FolderPlus} onClick={() => setIsMenuOpen(false)}>Create Project</NavItem>
                  <NavItem to="/showcase" icon={Layers} onClick={() => setIsMenuOpen(false)}>Showcase</NavItem>
                  <NavItem to="/resources" icon={BookOpen} onClick={() => setIsMenuOpen(false)}>Resources</NavItem>
                  <NavItem to="/profile" icon={User} onClick={() => setIsMenuOpen(false)}>Profile</NavItem>
                  <div className="pt-2 border-t border-border">
                    <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <NavItem to="/showcase" icon={Layers} onClick={() => setIsMenuOpen(false)}>Showcase</NavItem>
                  <NavItem to="/resources" icon={BookOpen} onClick={() => setIsMenuOpen(false)}>Resources</NavItem>
                  <div className="pt-2 border-t border-border grid gap-2">
                    <Button variant="ghost" className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
