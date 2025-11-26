import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { useList } from '../hooks/useList';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { GraduationCap, Briefcase, Code, Award, Edit2, MapPin, Mail, User } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const isOwnProfile = !id;
  const endpoint = id ? `/users/${id}` : '/auth/me';
  const verifiedSkillsEndpoint = id ? `/users/${id}/verified-skills` : '/auth/me/verified-skills';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    university: '',
    major: '',
    skills: '',
    location: ''
  });

  const { data: verifiedSkills, loading: skillsLoading, error: skillsError } = useList(() => api.get(verifiedSkillsEndpoint));

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
          location: data.location || ''
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
      // Ideally show a toast notification here
    }
  };

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} />;
  if (!user) return <ErrorState message="User not found." />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-accent/10">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-violet-600/20"></div>
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-background bg-background overflow-hidden shadow-lg">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-background rounded-full"></div>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "secondary" : "default"}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">University</label>
                      <input
                        type="text"
                        value={editForm.university}
                        onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Major</label>
                      <input
                        type="text"
                        value={editForm.major}
                        onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background min-h-[100px]"
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-sm font-medium">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={editForm.skills}
                        onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                        placeholder="React, Node.js, Design..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    {user.university && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{user.major} at {user.university}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {user.bio || "No bio provided yet."}
                  </p>
                </CardContent>
              </Card>

              {/* Activity/Projects Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No skills listed yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Verified Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {skillsLoading ? <LoadingState /> : skillsError ? <ErrorState message={skillsError} /> : (
                    verifiedSkills.length > 0 ? (
                      <div className="space-y-3">
                        {verifiedSkills.map((skill, i) => (
                          <div key={i} className="flex items-center bg-accent/50 p-3 rounded-lg">
                            <span className="text-2xl mr-3">{skill.icon}</span>
                            <span className="font-medium">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No skills verified yet.</p>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
