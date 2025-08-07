// Mock 數據統一導出
export * from './stores';
export * from './api';
export * from './components';

// 常用 Mock 數據
export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
  },
];

export const mockForms = [
  {
    id: '1',
    title: 'Contact Form',
    description: 'A simple contact form',
    fields: [
      {
        id: 'field1',
        type: 'text',
        label: 'Name',
        required: true,
        placeholder: 'Enter your name',
      },
      {
        id: 'field2',
        type: 'email',
        label: 'Email',
        required: true,
        placeholder: 'Enter your email',
      },
    ],
    settings: {
      allowMultipleSubmissions: true,
      requireAuthentication: false,
    },
  },
  {
    id: '2',
    title: 'Survey Form',
    description: 'A survey form with various field types',
    fields: [
      {
        id: 'field1',
        type: 'text',
        label: 'Full Name',
        required: true,
      },
      {
        id: 'field2',
        type: 'select',
        label: 'Age Group',
        required: true,
        options: ['18-25', '26-35', '36-45', '46+'],
      },
      {
        id: 'field3',
        type: 'checkbox',
        label: 'Subscribe to newsletter',
        required: false,
      },
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: true,
    },
  },
];

export const mockSpreadsheets = [
  {
    id: '1',
    name: 'Sales Report',
    description: 'Monthly sales report',
    data: [
      ['Month', 'Sales', 'Profit'],
      ['January', '10000', '2000'],
      ['February', '12000', '2400'],
      ['March', '15000', '3000'],
    ],
  },
  {
    id: '2',
    name: 'Inventory',
    description: 'Product inventory tracking',
    data: [
      ['Product', 'Quantity', 'Price'],
      ['Laptop', '50', '999'],
      ['Mouse', '100', '25'],
      ['Keyboard', '75', '50'],
    ],
  },
];

export const mockSubmissions = [
  {
    id: '1',
    formId: '1',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    submittedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    formId: '1',
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    submittedAt: '2024-01-16T14:20:00Z',
  },
];

export const mockAnalytics = {
  totalForms: 10,
  totalSubmissions: 150,
  activeUsers: 25,
  conversionRate: 0.75,
  submissionsByMonth: [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 38 },
    { month: 'Apr', count: 61 },
  ],
  topForms: [
    { id: '1', title: 'Contact Form', submissions: 45 },
    { id: '2', title: 'Survey Form', submissions: 32 },
    { id: '3', title: 'Registration Form', submissions: 28 },
  ],
};

export const mockPermissions = [
  {
    id: '1',
    userId: '1',
    resource: 'forms',
    action: 'create',
    granted: true,
  },
  {
    id: '2',
    userId: '1',
    resource: 'forms',
    action: 'read',
    granted: true,
  },
  {
    id: '3',
    userId: '2',
    resource: 'forms',
    action: 'create',
    granted: false,
  },
];

export const mockWorkflows = [
  {
    id: '1',
    name: 'Form Submission Workflow',
    description: 'Automated workflow for form submissions',
    steps: [
      {
        id: 'step1',
        name: 'Validate Submission',
        type: 'validation',
        config: {
          requiredFields: ['name', 'email'],
        },
      },
      {
        id: 'step2',
        name: 'Send Notification',
        type: 'notification',
        config: {
          email: 'admin@example.com',
          template: 'new-submission',
        },
      },
    ],
    active: true,
  },
  {
    id: '2',
    name: 'Data Export Workflow',
    description: 'Export data to external systems',
    steps: [
      {
        id: 'step1',
        name: 'Prepare Data',
        type: 'data-processing',
        config: {
          format: 'csv',
          includeHeaders: true,
        },
      },
      {
        id: 'step2',
        name: 'Upload to Cloud',
        type: 'file-upload',
        config: {
          destination: 's3://bucket/data/',
        },
      },
    ],
    active: false,
  },
];