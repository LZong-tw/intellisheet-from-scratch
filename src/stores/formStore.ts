import { create } from 'zustand'
import { Form, FormField, FormSubmission } from '../types/form'

interface FormStore {
  forms: Form[]
  activeForm: Form | null
  submissions: FormSubmission[]
  
  // Actions
  createForm: (spreadsheetId: string, columns: any[]) => Form
  updateForm: (formId: string, updates: Partial<Form>) => void
  deleteForm: (formId: string) => void
  getFormBySpreadsheetId: (spreadsheetId: string) => Form | undefined
  
  // Field actions
  addField: (formId: string, field: FormField) => void
  updateField: (formId: string, fieldId: string, updates: Partial<FormField>) => void
  removeField: (formId: string, fieldId: string) => void
  reorderFields: (formId: string, fields: FormField[]) => void
  
  // Submission actions
  submitForm: (formId: string, data: Record<string, any>) => FormSubmission
  getSubmissions: (formId: string) => FormSubmission[]
  
  // UI state
  setActiveForm: (form: Form | null) => void
}

export const useFormStore = create<FormStore>((set, get) => ({
  forms: [],
  activeForm: null,
  submissions: [],
  
  createForm: (spreadsheetId: string, columns: any[]) => {
    const form: Form = {
      id: `form-${Date.now()}`,
      spreadsheetId,
      name: 'New Form',
      description: '',
      fields: columns
        .filter(col => col.editable)
        .map((col, index) => ({
          id: `field-${col.id}`,
          columnId: col.id,
          label: col.name,
          type: col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text',
          required: false,
          order: index,
          placeholder: `Enter ${col.name.toLowerCase()}`,
        })),
      settings: {
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your submission!',
        allowMultipleSubmissions: true,
        requireAuth: false,
        notifyOnSubmission: false,
        theme: {
          primaryColor: '#3b82f6',
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      shareUrl: `/form/${Date.now()}`,
    }
    
    set(state => ({
      forms: [...state.forms, form],
      activeForm: form,
    }))
    
    return form
  },
  
  updateForm: (formId: string, updates: Partial<Form>) => {
    set(state => ({
      forms: state.forms.map(form => 
        form.id === formId 
          ? { ...form, ...updates, updatedAt: new Date() }
          : form
      ),
      activeForm: state.activeForm?.id === formId 
        ? { ...state.activeForm, ...updates, updatedAt: new Date() }
        : state.activeForm,
    }))
  },
  
  deleteForm: (formId: string) => {
    set(state => ({
      forms: state.forms.filter(form => form.id !== formId),
      activeForm: state.activeForm?.id === formId ? null : state.activeForm,
    }))
  },
  
  getFormBySpreadsheetId: (spreadsheetId: string) => {
    return get().forms.find(form => form.spreadsheetId === spreadsheetId)
  },
  
  addField: (formId: string, field: FormField) => {
    set(state => ({
      forms: state.forms.map(form => 
        form.id === formId 
          ? { 
              ...form, 
              fields: [...form.fields, field],
              updatedAt: new Date()
            }
          : form
      ),
    }))
  },
  
  updateField: (formId: string, fieldId: string, updates: Partial<FormField>) => {
    set(state => ({
      forms: state.forms.map(form => 
        form.id === formId 
          ? {
              ...form,
              fields: form.fields.map(field => 
                field.id === fieldId 
                  ? { ...field, ...updates }
                  : field
              ),
              updatedAt: new Date()
            }
          : form
      ),
    }))
  },
  
  removeField: (formId: string, fieldId: string) => {
    set(state => ({
      forms: state.forms.map(form => 
        form.id === formId 
          ? {
              ...form,
              fields: form.fields.filter(field => field.id !== fieldId),
              updatedAt: new Date()
            }
          : form
      ),
    }))
  },
  
  reorderFields: (formId: string, fields: FormField[]) => {
    set(state => ({
      forms: state.forms.map(form => 
        form.id === formId 
          ? { ...form, fields, updatedAt: new Date() }
          : form
      ),
    }))
  },
  
  submitForm: (formId: string, data: Record<string, any>) => {
    const form = get().forms.find(f => f.id === formId)
    if (!form) throw new Error('Form not found')
    
    const submission: FormSubmission = {
      id: `submission-${Date.now()}`,
      formId,
      spreadsheetId: form.spreadsheetId,
      data,
      submittedAt: new Date(),
    }
    
    set(state => ({
      submissions: [...state.submissions, submission],
    }))
    
    return submission
  },
  
  getSubmissions: (formId: string) => {
    return get().submissions.filter(sub => sub.formId === formId)
  },
  
  setActiveForm: (form: Form | null) => {
    set({ activeForm: form })
  },
}))