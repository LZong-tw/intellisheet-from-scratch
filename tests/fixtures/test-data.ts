export const testSpreadsheetData = {
  id: 'test-spreadsheet-1',
  name: 'Employee Data',
  description: 'Employee information spreadsheet',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T12:00:00.000Z',
  data: {
    headers: ['Employee ID', 'Name', 'Email', 'Department', 'Salary', 'Start Date'],
    rows: [
      {
        id: 'row-1',
        cells: {
          'Employee ID': 'EMP001',
          'Name': 'John Doe',
          'Email': 'john.doe@company.com',
          'Department': 'Engineering',
          'Salary': '75000',
          'Start Date': '2023-01-15'
        }
      },
      {
        id: 'row-2',
        cells: {
          'Employee ID': 'EMP002',
          'Name': 'Jane Smith',
          'Email': 'jane.smith@company.com',
          'Department': 'Marketing',
          'Salary': '65000',
          'Start Date': '2023-03-01'
        }
      },
      {
        id: 'row-3',
        cells: {
          'Employee ID': 'EMP003',
          'Name': 'Mike Johnson',
          'Email': 'mike.johnson@company.com',
          'Department': 'Sales',
          'Salary': '70000',
          'Start Date': '2023-02-15'
        }
      }
    ]
  }
}

export const testFormData = {
  id: 'test-form-1',
  name: 'Employee Feedback Form',
  description: 'Annual employee feedback form',
  fields: [
    {
      id: 'field-1',
      type: 'text',
      label: 'Employee Name',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      id: 'field-2',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      id: 'field-3',
      type: 'select',
      label: 'Department',
      required: true,
      options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
    },
    {
      id: 'field-4',
      type: 'textarea',
      label: 'Feedback',
      required: false,
      placeholder: 'Share your thoughts...'
    },
    {
      id: 'field-5',
      type: 'number',
      label: 'Rating (1-10)',
      required: true,
      min: 1,
      max: 10
    }
  ]
}

export const testPermissions = [
  {
    id: 'perm-1',
    resourceId: 'test-spreadsheet-1',
    userId: 'user-admin',
    userEmail: 'admin@company.com',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'share']
  },
  {
    id: 'perm-2',
    resourceId: 'test-spreadsheet-1',
    userId: 'user-editor',
    userEmail: 'editor@company.com',
    role: 'editor',
    permissions: ['read', 'write']
  },
  {
    id: 'perm-3',
    resourceId: 'test-spreadsheet-1',
    userId: 'user-viewer',
    userEmail: 'viewer@company.com',
    role: 'viewer',
    permissions: ['read']
  }
]

export const testWorkflows = [
  {
    id: 'workflow-1',
    name: 'Employee Onboarding',
    description: 'Automated workflow for new employee onboarding',
    triggers: [
      {
        id: 'trigger-1',
        type: 'spreadsheet_update',
        conditions: {
          column: 'Status',
          operator: 'equals',
          value: 'New Hire'
        }
      }
    ],
    actions: [
      {
        id: 'action-1',
        type: 'send_email',
        config: {
          to: '{{Email}}',
          subject: 'Welcome to the Team!',
          template: 'welcome_email'
        }
      },
      {
        id: 'action-2',
        type: 'create_task',
        config: {
          title: 'Setup workspace for {{Name}}',
          assignee: 'hr@company.com'
        }
      }
    ],
    isActive: true
  },
  {
    id: 'workflow-2',
    name: 'Data Validation Alert',
    description: 'Alert when invalid data is entered',
    triggers: [
      {
        id: 'trigger-2',
        type: 'data_validation_error',
        conditions: {}
      }
    ],
    actions: [
      {
        id: 'action-3',
        type: 'send_notification',
        config: {
          message: 'Invalid data detected in spreadsheet',
          severity: 'warning'
        }
      }
    ],
    isActive: true
  }
]

export const testAnalyticsData = {
  usage: {
    daily: [
      { date: '2024-01-01', views: 45, edits: 12 },
      { date: '2024-01-02', views: 52, edits: 18 },
      { date: '2024-01-03', views: 38, edits: 9 },
      { date: '2024-01-04', views: 61, edits: 21 },
      { date: '2024-01-05', views: 47, edits: 15 }
    ],
    weekly: [
      { week: 'W1 2024', views: 234, edits: 67 },
      { week: 'W2 2024', views: 287, edits: 89 },
      { week: 'W3 2024', views: 312, edits: 94 }
    ]
  },
  performance: {
    loadTime: [
      { page: 'Dashboard', avgTime: 1.2 },
      { page: 'Spreadsheet', avgTime: 2.8 },
      { page: 'Analytics', avgTime: 1.9 },
      { page: 'Workflows', avgTime: 1.5 }
    ],
    errors: [
      { type: 'Network Error', count: 3 },
      { type: 'Validation Error', count: 12 },
      { type: 'Permission Error', count: 2 }
    ]
  }
}

export const testUsers = [
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: 'user-editor',
    name: 'Editor User',
    email: 'editor@company.com',
    role: 'editor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor'
  },
  {
    id: 'user-viewer',
    name: 'Viewer User',
    email: 'viewer@company.com',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer'
  }
]