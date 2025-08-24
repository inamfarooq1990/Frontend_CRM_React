import React, { useState } from 'react';
import { Plus, Search, DollarSign, Calendar, User, Edit2, Trash2 } from 'lucide-react';
import DealModal from './DealModal';

interface Deal {
  id: number;
  name: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  contact: string;
  company: string;
  description: string;
}

const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 1,
      name: 'Acme Corp Integration',
      value: 45000,
      stage: 'negotiation',
      probability: 75,
      closeDate: '2025-02-15',
      contact: 'Alice Johnson',
      company: 'Acme Corp',
      description: 'Complete software integration project'
    },
    {
      id: 2,
      name: 'TechStart Platform License',
      value: 32500,
      stage: 'proposal',
      probability: 60,
      closeDate: '2025-02-28',
      contact: 'Bob Smith',
      company: 'TechStart',
      description: 'Annual platform licensing deal'
    },
    {
      id: 3,
      name: 'Global Systems Upgrade',
      value: 78900,
      stage: 'qualified',
      probability: 40,
      closeDate: '2025-03-15',
      contact: 'Carol Williams',
      company: 'Global Systems',
      description: 'System upgrade and migration services'
    },
    {
      id: 4,
      name: 'Innovation Labs Consulting',
      value: 25600,
      stage: 'negotiation',
      probability: 85,
      closeDate: '2025-01-30',
      contact: 'David Brown',
      company: 'Innovation Labs',
      description: 'Strategic consulting engagement'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleAddDeal = (dealData: Omit<Deal, 'id'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: Math.max(...deals.map(d => d.id)) + 1
    };
    setDeals([...deals, newDeal]);
    setIsModalOpen(false);
  };

  const handleUpdateDeal = (dealData: Omit<Deal, 'id'>) => {
    if (!editingDeal) return;
    
    setDeals(deals.map(deal => 
      deal.id === editingDeal.id 
        ? { ...dealData, id: editingDeal.id }
        : deal
    ));
    setEditingDeal(null);
    setIsModalOpen(false);
  };

  const handleDeleteDeal = (id: number) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-gray-100 text-gray-800';
      case 'qualified': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedPipelineValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Deals</h1>
          <p className="text-slate-600">Track your sales pipeline and opportunities</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(totalPipelineValue)}</h3>
              <p className="text-slate-600">Total Pipeline</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(weightedPipelineValue)}</h3>
              <p className="text-slate-600">Weighted Pipeline</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{deals.length}</h3>
              <p className="text-slate-600">Active Deals</p>
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
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stages</option>
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">{deal.name}</h3>
                <p className="text-sm text-slate-600">{deal.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(deal.stage)}`}>
                {deal.stage.replace('-', ' ')}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-xl font-bold text-slate-800">{formatCurrency(deal.value)}</span>
                </div>
                <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                  {deal.probability}% probability
                </div>
              </div>
              
              <div className="flex items-center text-sm text-slate-600">
                <User className="w-4 h-4 mr-2" />
                {deal.contact} • {deal.company}
              </div>
              
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="w-4 h-4 mr-2" />
                Close date: {new Date(deal.closeDate).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => openEditModal(deal)}
                className="flex items-center px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteDeal(deal.id)}
                className="flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No deals found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      )}

      <DealModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingDeal ? handleUpdateDeal : handleAddDeal}
        deal={editingDeal}
      />
    </div>
  );
};

export default Deals;