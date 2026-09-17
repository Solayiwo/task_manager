import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const DEBOUNCE_DELAY = 300;

const getApiErrorMessage = (error, fallback) =>
  error.response?.data?.error || error.message || fallback;

import Header from '@components/Header';
import StatsOverview from '@components/StatsOverview';
import FilterBar from '@components/FilterBar';
import TaskCard from '@components/TaskCard';

// Modals
import CreateTaskModal from '@components/modals/CreateTaskModal';
import ViewTaskModal from '@components/modals/ViewTaskModal';
import EditTaskModal from '@components/modals/EditTaskModal';
import DeleteTaskModal from '@components/modals/DeleteTaskModal';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tasks`;

export default function Home() {
  const { statusFilter, setStatusFilter, setStats, setIsSidebarOpen } = useOutletContext();
  
  // Data State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [modalError, setModalError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('due_date');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setTasks(res.data);
      setApiError('');
    } catch (err) {
      console.error('API Error:', err);
      setApiError(getApiErrorMessage(err, 'Unable to load tasks. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Sync Sidebar Stats
  useEffect(() => {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const health = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({ total, inProgress, pending, completed, health });
  }, [tasks, setStats]);

  // Handle Task Creation
  const handleCreateTask = async (formData) => {
    setModalError('');
    try {
      await axios.post(API_URL, formData);
      await fetchTasks();
      return true;
    } catch (err) {
      console.error('Error creating task:', err);
      const message = getApiErrorMessage(err, 'Unable to create the task. Please try again.');
      setModalError(message);
      setApiError(message);
      return false;
    }
  };

  // Handle Task Update
  const handleUpdateTask = async (updatedTask) => {
    setModalError('');
    try {
      const response = await axios.put(`${API_URL}/${updatedTask.id}`, updatedTask);
      const savedTask = response.data;

      setSelectedTask(savedTask);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === savedTask.id ? savedTask : task
        )
      );

      await fetchTasks();
      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      const message = getApiErrorMessage(err, 'Unable to update the task. Please try again.');
      setModalError(message);
      setApiError(message);
      return false;
    }
  };

  // Handle Task Deletion
  const handleDeleteTask = async (taskId) => {
    setModalError('');
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      await fetchTasks();
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      const message = getApiErrorMessage(err, 'Unable to delete the task. Please try again.');
      setModalError(message);
      setApiError(message);
      return false;
    }
  };

  // Filter & Search Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const normalizedSearch = debouncedSearch.trim().toLowerCase();
        const matchesSearch = !normalizedSearch ||
          task.title.toLowerCase().includes(normalizedSearch) ||
          (task.description && task.description.toLowerCase().includes(normalizedSearch));

        const targetStatus = statusFilter.toLowerCase().replace(' ', '_');
        const matchesStatus = statusFilter === 'All' || task.status === targetStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'due_date') {
          return new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31');
        }
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [tasks, debouncedSearch, statusFilter, sortBy]);

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Top Header */}
      <Header 
        onOpenCreate={() => setIsCreateOpen(true)} 
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {apiError && (
        <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          <span>{apiError}</span>
          <button
            type="button"
            onClick={() => setApiError('')}
            className="shrink-0 font-semibold text-rose-700 hover:text-rose-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <StatsOverview tasks={tasks} />

      {/* Filter and Search Bar */}
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
          No tasks found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onView={() => { setSelectedTask(task); setIsViewOpen(true); }}
              onEdit={() => {
                if (task.status === 'completed') return;
                setSelectedTask(task);
                setIsEditOpen(true);
              }}
              onDelete={() => { setSelectedTask(task); setIsDeleteOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      <CreateTaskModal 
        isOpen={isCreateOpen} 
        onClose={() => { setIsCreateOpen(false); setModalError(''); }} 
        onSubmit={handleCreateTask} 
        error={modalError}
        onDismissError={() => setModalError('')}
      />

      <ViewTaskModal 
        task={selectedTask} 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        onEdit={() => {
          if (selectedTask?.status === 'completed') return;
          setIsViewOpen(false);
          setIsEditOpen(true);
        }} 
        onDelete={() => { setIsViewOpen(false); setIsDeleteOpen(true); }} 
      />

      <EditTaskModal 
        task={selectedTask} 
        isOpen={isEditOpen} 
        onClose={() => { setIsEditOpen(false); setModalError(''); }} 
        onSave={handleUpdateTask} 
        onDelete={() => { setIsEditOpen(false); setIsDeleteOpen(true); }} 
        error={modalError}
        onDismissError={() => setModalError('')}
      />

      <DeleteTaskModal 
        task={selectedTask} 
        isOpen={isDeleteOpen} 
        onClose={() => { setIsDeleteOpen(false); setModalError(''); }} 
        onConfirm={handleDeleteTask} 
        error={modalError}
        onDismissError={() => setModalError('')}
      />
    </main>
  );
}