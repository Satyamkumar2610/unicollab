import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { api } from '../services/api';
import KanbanBoard from './KanbanBoard';

jest.mock('../services/api');

const mockTasks = [
  { id: '1', content: 'Task 1', status: 'todo' },
  { id: '2', content: 'Task 2', status: 'in-progress' },
  { id: '3', content: 'Task 3', status: 'done' },
];

describe('KanbanBoard', () => {
  it('renders loading state initially', () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<KanbanBoard projectId="1" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    api.get.mockRejectedValue(new Error('Failed to fetch'));
    render(<KanbanBoard projectId="1" />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('renders tasks in their respective columns', async () => {
    api.get.mockResolvedValue({ data: mockTasks });
    render(<KanbanBoard projectId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    const todoColumn = screen.getByText('To Do').closest('div');
    const inProgressColumn = screen.getByText('In Progress').closest('div');
    const doneColumn = screen.getByText('Done').closest('div');

    expect(todoColumn).toHaveTextContent('Task 1');
    expect(inProgressColumn).toHaveTextContent('Task 2');
    expect(doneColumn).toHaveTextContent('Task 3');
  });
});