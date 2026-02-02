import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace';
import { TeamChat, KanbanBoard } from '../components';
import WorkspaceDashboard from '../components/workspace/WorkspaceDashboard';
import ActivityFeed from '../components/workspace/ActivityFeed';
import TeamPresence from '../components/workspace/TeamPresence';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

const ProjectWorkspace = () => {
  const { id } = useParams();

  const {
    workspaceId,
    dashboard,
    activities,
    isLoading,
    error,
    createTask,
    updateTask,
    moveTask,
    deleteTask
  } = useWorkspace(id);

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    }
  });

  useEffect(() => {
    if (createTask && updateTask && moveTask && deleteTask) {
      window.__createTaskMutation = createTask;
      window.__updateTaskMutation = updateTask;
      window.__moveTaskMutation = moveTask;
      window.__deleteTaskMutation = deleteTask;
    }
  }, [createTask, updateTask, moveTask, deleteTask]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {project?.title || 'Project Workspace'}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
              Collaborate with your team in real-time
            </p>
          </div>
          <TeamPresence projectMembers={project?.members || []} />
        </header>

        <WorkspaceDashboard
          dashboard={dashboard}
          onCreateTask={() => {
            const createTaskMutation = window.__createTaskMutation;
            if (createTaskMutation) {
              console.log('Create task from dashboard');
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <KanbanBoard
              projectId={id}
              workspaceId={workspaceId}
              projectMembers={project?.members || []}
            />
          </div>

          <div className="space-y-6">
            <ActivityFeed activities={activities} />
            <TeamChat teamId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
