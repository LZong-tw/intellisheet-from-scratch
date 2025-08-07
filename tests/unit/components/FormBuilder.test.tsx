import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormBuilder from '@/components/FormBuilder';

// Mock dependencies
vi.mock('@/stores/useFormStore', () => ({
  useFormStore: vi.fn(() => ({
    forms: [],
    createForm: vi.fn(),
    updateForm: vi.fn(),
    deleteForm: vi.fn(),
    currentForm: null,
    setCurrentForm: vi.fn(),
  })),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockFormData = {
  id: '1',
  title: 'Test Form',
  description: 'Test Description',
  fields: [
    {
      id: 'field1',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Enter your name',
    },
  ],
  settings: {
    allowMultipleSubmissions: true,
    requireAuthentication: false,
  },
};

describe('FormBuilder Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders form builder interface', () => {
    render(<FormBuilder />);
    
    expect(screen.getByText(/form builder/i)).toBeInTheDocument();
    expect(screen.getByText(/form title/i)).toBeInTheDocument();
    expect(screen.getByText(/form description/i)).toBeInTheDocument();
  });

  it('allows creating a new form', async () => {
    render(<FormBuilder />);
    
    const titleInput = screen.getByLabelText(/form title/i);
    const descriptionInput = screen.getByLabelText(/form description/i);
    
    await user.type(titleInput, 'New Test Form');
    await user.type(descriptionInput, 'This is a test form');
    
    expect(titleInput).toHaveValue('New Test Form');
    expect(descriptionInput).toHaveValue('This is a test form');
  });

  it('allows adding form fields', async () => {
    render(<FormBuilder />);
    
    const addFieldButton = screen.getByText(/add field/i);
    await user.click(addFieldButton);
    
    // Check if field editor appears
    expect(screen.getByText(/field type/i)).toBeInTheDocument();
    expect(screen.getByText(/field label/i)).toBeInTheDocument();
  });

  it('allows editing field properties', async () => {
    render(<FormBuilder />);
    
    // Add a field first
    const addFieldButton = screen.getByText(/add field/i);
    await user.click(addFieldButton);
    
    const fieldLabelInput = screen.getByLabelText(/field label/i);
    await user.type(fieldLabelInput, 'Email Address');
    
    expect(fieldLabelInput).toHaveValue('Email Address');
  });

  it('allows changing field type', async () => {
    render(<FormBuilder />);
    
    // Add a field first
    const addFieldButton = screen.getByText(/add field/i);
    await user.click(addFieldButton);
    
    const fieldTypeSelect = screen.getByLabelText(/field type/i);
    await user.selectOptions(fieldTypeSelect, 'email');
    
    expect(fieldTypeSelect).toHaveValue('email');
  });

  it('allows setting field as required', async () => {
    render(<FormBuilder />);
    
    // Add a field first
    const addFieldButton = screen.getByText(/add field/i);
    await user.click(addFieldButton);
    
    const requiredCheckbox = screen.getByLabelText(/required/i);
    await user.click(requiredCheckbox);
    
    expect(requiredCheckbox).toBeChecked();
  });

  it('allows deleting fields', async () => {
    render(<FormBuilder />);
    
    // Add a field first
    const addFieldButton = screen.getByText(/add field/i);
    await user.click(addFieldButton);
    
    const deleteButton = screen.getByRole('button', { name: /delete field/i });
    await user.click(deleteButton);
    
    // Field should be removed
    expect(screen.queryByText(/field type/i)).not.toBeInTheDocument();
  });

  it('allows saving form', async () => {
    render(<FormBuilder />);
    
    const saveButton = screen.getByText(/save form/i);
    await user.click(saveButton);
    
    // Should show success message or validation errors
    expect(screen.getByText(/form saved/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<FormBuilder />);
    
    const saveButton = screen.getByText(/save form/i);
    await user.click(saveButton);
    
    // Should show validation error for empty title
    expect(screen.getByText(/form title is required/i)).toBeInTheDocument();
  });

  it('allows previewing form', async () => {
    render(<FormBuilder />);
    
    const previewButton = screen.getByText(/preview/i);
    await user.click(previewButton);
    
    // Should show preview mode
    expect(screen.getByText(/form preview/i)).toBeInTheDocument();
  });

  it('allows configuring form settings', async () => {
    render(<FormBuilder />);
    
    const settingsButton = screen.getByText(/settings/i);
    await user.click(settingsButton);
    
    // Should show settings panel
    expect(screen.getByText(/form settings/i)).toBeInTheDocument();
  });
});