import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useWorkspaceStore from '../../stores/workspaceStore';
import TaskCard from '../workspace/TaskCard';
import TaskModal from '../workspace/TaskModal';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SortableTask = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
};

const Column = ({ column, tasks, onAddTask, onTaskClick }) => {
  const taskIds = tasks.map(t => t._id);

  const columnColors = {
    backlog: 'bg-gray-100 dark:bg-gray-900',
    'in-progress': 'bg-blue-50 dark:bg-blue-900/20',
    review: 'bg-yellow-50 dark:bg-yellow-900/20',
    done: 'bg-green-50 dark:bg-green-900/20'
  };

  return (
    <div className={`rounded-lg p-4 min-h-[500px] ${columnColors[column.id] || 'bg-gray-100 dark:bg-gray-900'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-700 dark:text-gray-300">
          {column.title} ({tasks.length})
        </h3>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[400px]">
          {tasks.map(task => (
            <SortableTask key={task._id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => onAddTask(column.id)}
        className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
};

const KanbanBoard = ({ projectId, workspaceId, projectMembers = [] }) => {
  const { getTasksByStatus } = useWorkspaceStore();
  const [activeId, setActiveId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('backlog');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = {
    'backlog': { id: 'backlog', title: 'Backlog' },
    'in-progress': { id: 'in-progress', title: 'In Progress' },
    'review': { id: 'review', title: 'Review' },
    'done': { id: 'done', title: 'Done' },
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = findTask(active.id);
    const overColumn = Object.values(columns).find(col => {
      const tasks = getTasksByStatus(col.id);
      return tasks.some(t => t._id === over.id);
    });

    if (overColumn && activeTask && activeTask.status !== overColumn.id) {
      // Task moved to a different column
      const moveTaskMutation = window.__moveTaskMutation;
      if (moveTaskMutation) {
        const tasks = getTasksByStatus(overColumn.id);
        moveTaskMutation({
          taskId: activeTask._id,
          status: overColumn.id,
          order: tasks.length
        });
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = findTask(active.id);
    const overTask = findTask(over.id);

    if (activeTask && overTask && active.id !== over.id) {
      // Reordering within same column
      if (activeTask.status === overTask.status) {
        const tasks = getTasksByStatus(activeTask.status);
        const oldIndex = tasks.findIndex(t => t._id === active.id);
        const newIndex = tasks.findIndex(t => t._id === over.id);

        const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);

        // Update order on server
        const moveTaskMutation = window.__moveTaskMutation;
        if (moveTaskMutation) {
          moveTaskMutation({
            taskId: activeTask._id,
            status: activeTask.status,
            order: newIndex
          });
        }
      }
    }

    setActiveId(null);
  };

  const findTask = (id) => {
    for (const column of Object.values(columns)) {
      const tasks = getTasksByStatus(column.id);
      const task = tasks.find(t => t._id === id);
      if (task) return task;
    }
    return null;
  };

  const handleAddTask = (status) => {
    setNewTaskStatus(status);
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (selectedTask) {
      const updateTaskMutation = window.__updateTaskMutation;
      if (updateTaskMutation) {
        updateTaskMutation({ taskId: selectedTask._id, updates: taskData });
      }
    } else {
      const createTaskMutation = window.__createTaskMutation;
      if (createTaskMutation) {
        createTaskMutation({ ...taskData, status: newTaskStatus });
      }
    }
  };

  const handleDeleteTask = (taskId) => {
    const deleteTaskMutation = window.__deleteTaskMutation;
    if (deleteTaskMutation) {
      deleteTaskMutation(taskId);
    }
  };

  const activeTask = activeId ? findTask(activeId) : null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg">Task Board</h3>
          <button
            onClick={() => handleAddTask('backlog')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon />
            New Task
          </button>
        </div>

        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(columns).map(column => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={getTasksByStatus(column.id)}
                  onAddTask={handleAddTask}
                  onTaskClick={handleTaskClick}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <TaskModal
        task={selectedTask}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        projectMembers={projectMembers}
      />
    </>
  );
};

export default KanbanBoard;
