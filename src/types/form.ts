export interface FormField {
  id: string
  columnId: string
  label: string
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required: boolean
  visible: boolean // Whether the field is visible in the form (false for admin-only fields)
  placeholder?: string
  helpText?: string
  validation?: FieldValidation
  options?: SelectOption[] // For select/radio fields
  defaultValue?: any
  order: number
}

export interface FieldValidation {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  patternMessage?: string
  customValidation?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface Form {
  id: string
  spreadsheetId: string
  name: string
  description?: string
  fields: FormField[]
  settings: FormSettings
  status: 'active' | 'disabled'
  createdAt: Date
  updatedAt: Date
  createdBy: string
  shareUrl?: string
}

export interface FormSettings {
  submitButtonText: string
  successMessage: string
  allowMultipleSubmissions: boolean
  requireAuth: boolean
  notifyOnSubmission: boolean
  notificationEmails?: string[]
  theme?: FormTheme
}

export interface FormTheme {
  primaryColor: string
  backgroundColor: string
  fontFamily?: string
  borderRadius?: string
}

export interface FormSubmission {
  id: string
  formId: string
  spreadsheetId: string
  data: Record<string, any>
  submittedAt: Date
  submittedBy?: string
  ipAddress?: string
}