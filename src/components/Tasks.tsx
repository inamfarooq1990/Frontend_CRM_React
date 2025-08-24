import React, { useState } from 'react';
import { Plus, Search, Calendar, User, CheckSquare, Clock, Flag, Edit2, Trash2 } from 'lucide-react';
import TaskModal from './TaskModal';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  relatedContact?: string;
  relatedDeal?: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Follow up with Acme Corp',
      description: 'Call Alice Johnson to discuss the integration project timeline',
      dueDate: '2025-01-16',
      priority: 'high',
      status: 'pending',
      assignee: 'John Doe',
      relatedContact: 'Alice Johnson',
      relatedDeal: 'Acme Corp Integration'
    },
    {
      id: 2,
      title: 'Prepare proposal for TechStart',
      description: 'Create detailed proposal document for platform licensing',
      dueDate: '2025-01-17',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Jane Smith',
      relatedContact: 'Bob Smith',
      relatedDeal: 'TechStart Platform License'
    },
    {
      id: 3,
      title: 'Schedule demo for Global Systems',
      description: 'Coordinate with Carol Williams for system demonstration',
      dueDate: '2025-01-18',
      priority: 'high',
      status: 'pending',
      assignee: 'Mike Johnson',
      relatedContact: 'Carol Williams',
      relatedDeal: 'Global Systems Upgrade'
    },
    {
      id: 4,
      title: 'Send contract to Innovation Labs',
      description: 'Finalize and send the consulting agreement',
      dueDate: '2025-01-19',
      priority: 'low',
      status: 'completed',
      assignee: 'Sarah Davis',
      relatedContact: 'David Brown',
      relatedDeal: 'Innovation Labs Consulting'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.max(...tasks.map(t => t.id)) + 1
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id'>) => {
    if (!editingTask) return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...taskData, id: editingTask.id }
        : task
    ));
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        if (task.status === 'completed') {
          return { ...task, status: 'pending' };
        } else if (task.status === 'pending') {
          return { ...task, status: 'in-progress' };
        } else {
          return { ...task, status: 'completed' };
        }
      }
      return task;
    }));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in-progress': return Clock;
      case 'completed': return CheckSquare;
      default: return Clock;
    }
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const isOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overdueTasks = tasks.filter(task => task.status !== 'completed' && isOverdue(task.dueDate)).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Tasks</h1>
          <p className="text-slate-600">Manage your activities and follow-ups</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{pendingTasks}</h3>
              <p className="text-slate-600">Pending Tasks</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{completedTasks}</h3>
              <p className="text-slate-600">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{overdueTasks}</h3>
              <p className="text-slate-600">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const StatusIcon = getStatusIcon(task.status);
          const isTaskOverdue = task.status !== 'completed' && isOverdue(task.dueDate);
          const isTaskDueSoon = task.status !== 'completed' && isDueSoon(task.dueDate);
          
          return (
            <div 
              key={task.id} 
              className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
                isTaskOverdue ? 'border-red-200 bg-red-50' : 
                isTaskDueSoon ? 'border-yellow-200 bg-yellow-50' : 
                'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => handleToggleTaskStatus(task.id)}
                    className={`mt-1 p-1 rounded transition-colors ${
                      task.status === 'completed' 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-1 ${
                      task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className={
                          isTaskOverdue ? 'text-red-600 font-medium' :
                          isTaskDueSoon ? 'text-yellow-600 font-medium' : ''
                        }>
                          {new Date(task.dueDate).toLocaleDateString()}
                          {isTaskOverdue && ' (Overdue)'}
                          {isTaskDueSoon && !isTaskOverdue && ' (Due Soon)'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-slate-600">
                        <User className="w-4 h-4 mr-1" />
                        {task.assignee}
                      </div>
                      
                      <div className="flex items-center">
                        <Flag className={`w-4 h-4 mr-1 ${getPriorityColor(task.priority)}`} />
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                    
                    {(task.relatedContact || task.relatedDeal) && (
                      <div className="mt-2 text-xs text-slate-500">
                        {task.relatedContact && `Contact: ${task.relatedContact}`}
                        {task.relatedContact && task.relatedDeal && ' • '}
                        {task.relatedDeal && `Deal: ${task.relatedDeal}`}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => openEditModal(task)}
                  className="flex items-center px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No tasks found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;