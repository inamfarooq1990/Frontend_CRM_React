import React from 'react';
import { TrendingUp, Users, Target, CheckSquare, DollarSign, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,563',
      change: '+12.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Deals',
      value: '47',
      change: '+8.2%',
      changeType: 'positive',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'New Contacts',
      value: '156',
      change: '+23.1%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Tasks Completed',
      value: '89%',
      change: '+5.4%',
      changeType: 'positive',
      icon: CheckSquare,
      color: 'bg-amber-500'
    }
  ];

  const recentDeals = [
    { id: 1, name: 'Acme Corp Deal', value: '$45,000', status: 'negotiation', probability: '75%' },
    { id: 2, name: 'TechStart Contract', value: '$32,500', status: 'proposal', probability: '60%' },
    { id: 3, name: 'Global Systems', value: '$78,900', status: 'qualified', probability: '40%' },
    { id: 4, name: 'Innovation Labs', value: '$25,600', status: 'negotiation', probability: '85%' }
  ];

  const recentTasks = [
    { id: 1, title: 'Follow up with Acme Corp', due: '2025-01-16', priority: 'high' },
    { id: 2, title: 'Prepare proposal for TechStart', due: '2025-01-17', priority: 'medium' },
    { id: 3, title: 'Schedule demo for Global Systems', due: '2025-01-18', priority: 'high' },
    { id: 4, title: 'Send contract to Innovation Labs', due: '2025-01-19', priority: 'low' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'negotiation': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening with your sales.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Recent Deals</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div>
                  <h3 className="font-medium text-slate-800">{deal.name}</h3>
                  <p className="text-sm text-slate-600">{deal.value} • {deal.probability} probability</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deal.status)}`}>
                  {deal.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Upcoming Tasks</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div>
                  <h3 className="font-medium text-slate-800">{task.title}</h3>
                  <div className="flex items-center text-sm text-slate-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {task.due}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;