import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, GraduationCap, BookOpen, X, Filter, Mail, Crown, UserMinus, LogOut, UserPlus } from 'lucide-react';
import { api } from '../services/api';
import { useList } from '../hooks/useList';
import { usePagination } from '../hooks/usePagination';
import { SkeletonLoader } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { buildListUrl } from '../utils/queryBuilder';

const TeamDetailModal = ({ team: initialTeam, isOpen, onClose, onUpdate }) => {
  const [team, setTeam] = useState(initialTeam);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialTeam) {

      const fetchTeamDetails = async () => {
        try {
          console.log('Fetching team details for:', initialTeam._id);

          const teamData = await api.get(`/teams/${initialTeam._id}`);
          console.log('Team details received:', teamData);

          if (teamData && teamData._id) {
            setTeam(teamData);
          } else {
            console.error('Invalid or empty team data received:', teamData);

            setTeam(initialTeam);
          }
        } catch (err) {
          console.error('Error fetching team details:', err);
          console.error('Error response:', err.response);

          setTeam(initialTeam);
        }
      };
      fetchTeamDetails();
    }
  }, [isOpen, initialTeam]);

  const handleJoinTeam = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/teams/${team._id}/join`);
      setTeam(response.data);
      onUpdate?.();
    } catch (err) {
      console.error('Error joining team:', err);
      alert(err.response?.data?.message || 'Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;

    setLoading(true);
    try {
      await api.post(`/teams/${team._id}/leave`);
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error('Error leaving team:', err);
      alert(err.response?.data?.message || 'Failed to leave team');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    setLoading(true);
    try {
      const response = await api.delete(`/teams/${team._id}/members/${memberId}`);
      setTeam(response.data);
      onUpdate?.();
    } catch (err) {
      console.error('Error removing member:', err);
      alert(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !team) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
<div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-violet-500/10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{team.name}</h2>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {team.university && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{team.university}</span>
                      </div>
                    )}
                    {team.major && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{team.major}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{team.members?.length || 0} Members</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
<div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
{team.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{team.description}</p>
                </div>
              )}
{team.leader && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Team Owner
                  </h3>
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    {team.leader.avatar ? (
                      <img
                        src={team.leader.avatar}
                        alt={team.leader.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{team.leader.name}</p>
                      {team.leader.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${team.leader.email}`} className="hover:text-primary transition-colors">
                            {team.leader.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
{team.members && team.members.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Members</h3>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-3 p-3 bg-secondary/30 border border-white/5 rounded-lg hover:bg-secondary/40 transition-colors"
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                          {member.email && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                                {member.email}
                              </a>
                            </div>
                          )}
                        </div>
                        {team.isOwner && member._id !== team.leader._id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member._id)}
                            disabled={loading}
                            className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
                          >
                            <UserMinus className="w-4 h-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
<div className="p-6 border-t border-white/10 bg-secondary/20">
              <div className="flex gap-3 justify-end">
                {!team.isMember && (
                  <Button
                    onClick={handleJoinTeam}
                    disabled={loading}
                    className="gap-2"
                    size="lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    Join Team
                  </Button>
                )}
                {team.isMember && !team.isOwner && (
                  <Button
                    onClick={handleLeaveTeam}
                    disabled={loading}
                    variant="outline"
                    className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
                    size="lg"
                  >
                    <LogOut className="w-5 h-5" />
                    Leave Team
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TeamCard = ({ team, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card
      className="group h-full bg-card/40 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground border border-white/5">
            {team.members.length} Members
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {team.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 h-10">
          {team.description}
        </p>

        <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary/60" />
            <span className="truncate">{team.university}</span>
          </div>
          {team.major && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="w-4 h-4 text-primary/60" />
              <span className="truncate">{team.major}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const Teams = () => {
  const navigate = useNavigate();
  const { page, limit, goToPage, resetPage } = usePagination();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', university: '', major: '' });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data, metadata, loading, error, refetch } = useList(
    () => api.get(buildListUrl('/teams', { page, limit, search, sortBy, order: 'desc' })),
    [page, limit, search, sortBy]
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    resetPage();
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teams', formData);
      setFormData({ name: '', description: '', university: '', major: '' });
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedTeam(null);
  };

  const handleTeamUpdate = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
<div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 mb-2">
              Explore Teams
            </h1>
            <p className="text-muted-foreground text-lg">
              Join existing teams or create your own to collaborate on projects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2 shadow-lg shadow-primary/20"
              size="lg"
            >
              {showCreateForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showCreateForm ? 'Cancel' : 'Create Team'}
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: 'auto', mb: 32 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-card/50 backdrop-blur-md border-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Create a New Team</h2>
                  <form onSubmit={handleCreateTeam} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Team Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="University"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Major / Department"
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col h-full">
                      <textarea
                        placeholder="Description (Tell us about your team's goals...)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full flex-1 bg-background/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors min-h-[120px] resize-none mb-4"
                      />
                      <Button type="submit" className="w-full">Create Team</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-card/30 border-white/10" onClick={() => setSortBy(sortBy === 'createdAt' ? 'name' : 'createdAt')}>
              <Filter className="w-4 h-4" />
              Sort by {sortBy === 'createdAt' ? 'Date' : 'Name'}
            </Button>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : data.length === 0 ? (
          <EmptyState title="No teams found" description="Try adjusting your search or create a new team." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.map((team, index) => (
              <TeamCard
                key={team._id}
                team={team}
                index={index}
                onClick={() => handleTeamClick(team)}
              />
            ))}
          </div>
        )}

        {metadata && <Pagination metadata={metadata} onPageChange={goToPage} />}
      </div>
<TeamDetailModal
        team={selectedTeam}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        onUpdate={handleTeamUpdate}
      />
    </div>
  );
};
