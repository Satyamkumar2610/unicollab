import React from 'react';
import { TeamChat, KanbanBoard } from '../components';

const ProjectWorkspace = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Project Workspace</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Collaborate with your team in real-time.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <KanbanBoard />
          </div>
          <div>
            <TeamChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
