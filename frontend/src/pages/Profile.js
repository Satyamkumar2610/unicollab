import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  GraduationCap, Briefcase, Code, Edit2, MapPin, Mail, User,
  Trash2, Save, X, Sparkles
} from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isOwnProfile = !id;
  const endpoint = id ? `/users/${id}` : '/auth/me';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    university: '',
    major: '',
    skills: '',
    location: '',
    github: '',
    linkedin: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get(endpoint);
        setUser(data);
        setEditForm({
          name: data.name || '',
          bio: data.bio || '',
          university: data.university || '',
          major: data.major || '',
          skills: data.skills?.join(', ') || '',
          location: data.location || '',
          github: data.github || '',
          linkedin: data.linkedin || ''
        });
      } catch (err) {
        setError('Failed to fetch user profile.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [endpoint]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...editForm,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      const data = await api.put('/users/profile', updatedData);
      setUser(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/profile');
      logout();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account.');
    }
  };

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} />;
  if (!user) return <ErrorState message="User not found." />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
      {}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] opacity-20 animate-pulse-slow delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 overflow-hidden border-none shadow-2xl bg-card/40 backdrop-blur-xl border border-white/10">
              <div className="h-48 bg-gradient-to-r from-primary/30 via-violet-600/30 to-indigo-600/30 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              </div>
              <div className="px-8 pb-8">
                <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-6 gap-4">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl border-4 border-background bg-background overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-lg"></div>
                  </div>

                  {isOwnProfile && (
                    <div className="flex gap-3 mb-2">
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "secondary" : "glow"}
                        className="shadow-lg"
                      >
                        {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                      {isEditing && (
                        <Button
                          variant="destructive"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleUpdateProfile}
                      className="space-y-6 max-w-3xl"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                          <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Full Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2 group">
                          <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">University</label>
                          <input
                            type="text"
                            value={editForm.university}
                            onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                            className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2 group">
                          <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Major</label>
                          <input
                            type="text"
                            value={editForm.major}
                            onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                            className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2 group">
                          <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Location</label>
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                          />
                        </div>
                        <div className="col-span-full space-y-2 group">
                          <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Bio</label>
                          <textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none min-h-[120px] resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div className="col-span-full space-y-2 group">
                          <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Skills (comma separated)</label>
                          <input
                            type="text"
                            value={editForm.skills}
                            onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                            className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                            placeholder="React, Node.js, Design..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button type="submit" variant="glow">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                            {user.name}
                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Student
                            </span>
                          </h1>
                          <p className="text-muted-foreground flex items-center gap-2 text-lg">
                            <Mail className="w-4 h-4" /> {user.email}
                          </p>
                        </div>

                        {!isOwnProfile && (
                          <Button variant="glow" className="shadow-lg shadow-primary/20">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Me
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-6 mt-6 text-sm text-muted-foreground">
                        {user.university && (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span>{user.major} at <span className="text-foreground font-medium">{user.university}</span></span>
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{user.location}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <Card className="bg-card/40 backdrop-blur-xl border border-white/10 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="w-5 h-5 text-primary" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-lg">
                    {user.bio || "No bio provided yet. Add a bio to tell others about yourself!"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <Card className="bg-card/40 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Code className="w-5 h-5 text-primary" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No skills listed yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-muted-foreground">Joined</span>
                      <span className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    {}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border p-6 rounded-xl shadow-2xl max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-2 text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete Account
              </h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be lost.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>Yes, Delete My Account</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
