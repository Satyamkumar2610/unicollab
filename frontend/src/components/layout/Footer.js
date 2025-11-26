import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                U
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                UniCollab
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Connect, collaborate, and create amazing projects with fellow students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Projects</Link></li>
              <li><Link to="/showcase" className="hover:text-primary transition-colors">Showcase</Link></li>
              <li><Link to="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()} UniCollab. Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
