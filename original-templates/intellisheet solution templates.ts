import React, { useState, useEffect } from 'react';
import { Package, Users, Briefcase, ClipboardList, ShoppingCart, GraduationCap, Heart, Building2, Truck, Calendar, ArrowRight, Check, Star, TrendingUp, Clock, Shield, Zap, Globe, Copy, Eye, Download, Search, X } from 'lucide-react';

// Template Categories
const categories = [
  { id: 'business', name: 'Business Operations', icon: Briefcase, color: 'blue' },
  { id: 'hr', name: 'Human Resources', icon: Users, color: 'green' },
  { id: 'project', name: 'Project Management', icon: ClipboardList, color: 'purple' },
  { id: 'sales', name: 'Sales & CRM', icon: TrendingUp, color: 'orange' },
  { id: 'inventory', name: 'Inventory', icon: Package, color: 'yellow' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: 'indigo' },
  { id: 'nonprofit', name: 'Non-Profit', icon: Heart, color: 'pink' },
  { id: 'logistics', name: 'Logistics', icon: Truck, color: 'cyan' }
];

// Solution Templates Data
const templates = [
  {
    id: 'it-asset-mgmt',
    name: 'IT Asset Management',
    category: 'business',
    description: 'Complete IT asset lifecycle management from procurement to retirement',
    icon: Building2,
    color: 'blue',
    popularity: 4.8,
    users: 2340,
    features: [
      'Asset tracking with QR codes',
      'Maintenance scheduling',
      'Depreciation tracking',
      'Assignment workflow',
      'Vendor management',
      'License compliance'
    ],
    tables: ['assets', 'assignments', 'maintenance', 'vendors', 'licenses'],
    workflows: ['procurement', 'assignment', 'maintenance', 'retirement'],
    dashboards: ['asset-overview', 'cost-analysis', 'compliance'],
    permissions: {
      roles: ['IT Admin', 'Asset Manager', 'Department Head', 'Employee'],
      rules: 12
    },
    preview: {
      records: 500,
      fields: 45,
      automations: 8
    }
  },
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    category: 'hr',
    description: 'Streamline new hire onboarding with automated workflows and checklists',
    icon: Users,
    color: 'green',
    popularity: 4.9,
    users: 3120,
    features: [
      'Onboarding checklists',
      'Document collection',
      'Training schedules',
      'Equipment provisioning',
      'Team introductions',
      'Progress tracking'
    ],
    tables: ['employees', 'onboarding_tasks', 'documents', 'training', 'equipment'],
    workflows: ['offer-acceptance', 'first-day', 'first-week', 'probation'],
    dashboards: ['onboarding-progress', 'team-overview', 'compliance'],
    permissions: {
      roles: ['HR Manager', 'Hiring Manager', 'IT Admin', 'New Employee'],
      rules: 15
    },
    preview: {
      records: 250,
      fields: 38,
      automations: 12
    }
  },
  {
    id: 'project-tracker',
    name: 'Agile Project Tracker',
    category: 'project',
    description: 'Manage sprints, track issues, and deliver projects on time',
    icon: ClipboardList,
    color: 'purple',
    popularity: 4.7,
    users: 4560,
    features: [
      'Sprint planning',
      'Kanban boards',
      'Issue tracking',
      'Time logging',
      'Burndown charts',
      'Team velocity metrics'
    ],
    tables: ['projects', 'sprints', 'issues', 'time_logs', 'teams'],
    workflows: ['sprint-planning', 'issue-lifecycle', 'release'],
    dashboards: ['sprint-overview', 'velocity', 'burndown'],
    permissions: {
      roles: ['Product Owner', 'Scrum Master', 'Developer', 'Stakeholder'],
      rules: 10
    },
    preview: {
      records: 1200,
      fields: 52,
      automations: 15
    }
  },
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline CRM',
    category: 'sales',
    description: 'Track leads, manage opportunities, and close more deals',
    icon: TrendingUp,
    color: 'orange',
    popularity: 4.6,
    users: 5230,
    features: [
      'Lead scoring',
      'Pipeline stages',
      'Activity tracking',
      'Quote generation',
      'Email integration',
      'Revenue forecasting'
    ],
    tables: ['leads', 'accounts', 'opportunities', 'activities', 'quotes'],
    workflows: ['lead-qualification', 'opportunity-stages', 'quote-approval'],
    dashboards: ['pipeline-overview', 'sales-forecast', 'team-performance'],
    permissions: {
      roles: ['Sales Manager', 'Sales Rep', 'Marketing', 'Executive'],
      rules: 18
    },
    preview: {
      records: 3000,
      fields: 62,
      automations: 20
    }
  },
  {
    id: 'inventory-control',
    name: 'Inventory Control System',
    category: 'inventory',
    description: 'Real-time inventory tracking with automated reordering',
    icon: Package,
    color: 'yellow',
    popularity: 4.5,
    users: 1890,
    features: [
      'Stock level tracking',
      'Automated reordering',
      'Barcode scanning',
      'Multi-warehouse support',
      'Supplier management',
      'Inventory forecasting'
    ],
    tables: ['products', 'stock_levels', 'orders', 'suppliers', 'warehouses'],
    workflows: ['reorder-point', 'receiving', 'stock-transfer'],
    dashboards: ['inventory-levels', 'order-status', 'supplier-performance'],
    permissions: {
      roles: ['Warehouse Manager', 'Stock Controller', 'Purchaser', 'Viewer'],
      rules: 14
    },
    preview: {
      records: 5000,
      fields: 48,
      automations: 10
    }
  },
  {
    id: 'student-management',
    name: 'Student Management System',
    category: 'education',
    description: 'Comprehensive student information and academic tracking',
    icon: GraduationCap,
    color: 'indigo',
    popularity: 4.4,
    users: 890,
    features: [
      'Student profiles',
      'Grade tracking',
      'Attendance management',
      'Course scheduling',
      'Parent portal',
      'Report cards'
    ],
    tables: ['students', 'courses', 'grades', 'attendance', 'schedules'],
    workflows: ['enrollment', 'grading', 'promotion'],
    dashboards: ['academic-performance', 'attendance-overview', 'course-analytics'],
    permissions: {
      roles: ['Administrator', 'Teacher', 'Student', 'Parent'],
      rules: 20
    },
    preview: {
      records: 2000,
      fields: 55,
      automations: 8
    }
  },
  {
    id: 'volunteer-coordination',
    name: 'Volunteer Coordination',
    category: 'nonprofit',
    description: 'Manage volunteers, events, and impact tracking',
    icon: Heart,
    color: 'pink',
    popularity: 4.3,
    users: 670,
    features: [
      'Volunteer database',
      'Event scheduling',
      'Shift management',
      'Hours tracking',
      'Impact reporting',
      'Communication tools'
    ],
    tables: ['volunteers', 'events', 'shifts', 'hours', 'projects'],
    workflows: ['volunteer-onboarding', 'event-planning', 'hours-approval'],
    dashboards: ['volunteer-engagement', 'event-calendar', 'impact-metrics'],
    permissions: {
      roles: ['Coordinator', 'Team Lead', 'Volunteer', 'Board Member'],
      rules: 12
    },
    preview: {
      records: 800,
      fields: 35,
      automations: 6
    }
  },
  {
    id: 'fleet-management',
    name: 'Fleet Management',
    category: 'logistics',
    description: 'Vehicle tracking, maintenance scheduling, and route optimization',
    icon: Truck,
    color: 'cyan',
    popularity: 4.2,
    users: 450,
    features: [
      'Vehicle tracking',
      'Maintenance scheduling',
      'Fuel management',
      'Driver assignments',
      'Route optimization',
      'Compliance tracking'
    ],
    tables: ['vehicles', 'drivers', 'routes', 'maintenance', 'fuel_logs'],
    workflows: ['maintenance-schedule', 'route-assignment', 'inspection'],
    dashboards: ['fleet-overview', 'maintenance-calendar', 'fuel-analysis'],
    permissions: {
      roles: ['Fleet Manager', 'Dispatcher', 'Driver', 'Mechanic'],
      rules: 16
    },
    preview: {
      records: 1500,
      fields: 42,
      automations: 9
    }
  }
];

const SolutionTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popularity') return b.popularity - a.popularity;
    if (sortBy === 'users') return b.users - a.users;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };
    return colors[color] || colors.blue;
  };

  const TemplateCard = ({ template }) => {
    const Icon = template.icon;
    
    return (
      <div 
        className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => {
          setSelectedTemplate(template);
          setShowPreview(true);
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(template.color)}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-slate-900">{template.popularity}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {template.name}
        </h3>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {template.users.toLocaleString()} users
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {template.tables.length} tables
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {template.preview.automations} automations
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {template.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
              +{template.features.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };

  const TemplatePreview = ({ template, onClose }) => {
    if (!template) return null;
    
    const Icon = template.icon;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{template.name}</h2>
                  <p className="text-blue-100">{template.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                      <span className="font-medium">{template.popularity}</span>
                    </div>
                    <span className="text-blue-100">•</span>
                    <span>{template.users.toLocaleString()} active users</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Features */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Components */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Included Components</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Tables ({template.tables.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.tables.map((table, index) => (
                          <span key={index} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm">
                            {table}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Workflows ({template.workflows.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.workflows.map((workflow, index) => (
                          <span key={index} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm">
                            {workflow}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Dashboards ({template.dashboards.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.dashboards.map((dashboard, index) => (
                          <span key={index} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm">
                            {dashboard}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Template Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Records</span>
                      <span className="font-medium text-slate-900">{template.preview.records.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Custom Fields</span>
                      <span className="font-medium text-slate-900">{template.preview.fields}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Automations</span>
                      <span className="font-medium text-slate-900">{template.preview.automations}</span>
                    </div>
                  </div>
                </div>
                
                {/* Permissions */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Access Control</h4>
                  <div className="space-y-2 mb-4">
                    {template.permissions.roles.map((role, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-slate-700">{role}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-purple-700 font-medium">
                    {template.permissions.rules} permission rules configured
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium">
                    <Download className="w-4 h-4" />
                    Use This Template
                  </button>
                  <button className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Demo
                  </button>
                  <button className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" />
                    Clone & Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold mb-4">Solution Templates</h1>
          <p className="text-xl text-blue-100 mb-8">
            Pre-built business solutions ready to deploy in minutes
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-white focus:ring-opacity-30"
              />
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Templates
            </button>
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            {filteredTemplates.length} templates available
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="popularity">Most Popular</option>
            <option value="users">Most Users</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
        
        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No templates found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      
      {/* Template Preview Modal */}
      {showPreview && (
        <TemplatePreview 
          template={selectedTemplate} 
          onClose={() => {
            setShowPreview(false);
            setSelectedTemplate(null);
          }}
        />
      )}
      
      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 mt-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Use Solution Templates?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Save Time</h3>
              <p className="text-sm text-slate-600">Deploy complete solutions in minutes instead of building from scratch</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Best Practices</h3>
              <p className="text-sm text-slate-600">Built with industry standards and proven workflows</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Fully Customizable</h3>
              <p className="text-sm text-slate-600">Adapt templates to your specific needs and requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Community Tested</h3>
              <p className="text-sm text-slate-600">Used by thousands of organizations worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionTemplates;