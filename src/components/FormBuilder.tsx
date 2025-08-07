import { useState } from 'react'
import { X, Plus, GripVertical, Settings, Eye, EyeOff, Save, Share2, Trash2, Power, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Form, FormField, FieldValidation } from '../types/form'
import { useFormStore } from '../stores/formStore'
import toast from 'react-hot-toast'

interface FormBuilderProps {
  spreadsheetId: string
  columns: any[]
  onClose: () => void
}

interface SortableFieldProps {
  field: FormField
  formId: string
  onEdit: (field: FormField) => void
}

const SortableField: React.FC<SortableFieldProps> = ({ field, formId, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })
  const { updateField, removeField } = useFormStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{field.label}</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateField(formId, field.id, { visible: !field.visible })}
                className={`${field.visible ? 'text-gray-400 hover:text-gray-300' : 'text-orange-400 hover:text-orange-300'}`}
                title={field.visible ? 'Hide field from form' : 'Show field in form'}
              >
                {field.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onEdit(field)}
                className="text-gray-400 hover:text-gray-300"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeField(formId, field.id)}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Type: {field.type}</span>
            {field.required && <span className="text-yellow-400">Required</span>}
            {!field.visible && <span className="text-orange-400">Hidden</span>}
            {field.validation && <span>Has validation</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FormBuilder({ spreadsheetId, columns, onClose }: FormBuilderProps) {
  const { forms, activeForm, createForm, updateForm, reorderFields, updateField, setActiveForm, deleteForm } = useFormStore()
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState<'fields' | 'settings' | 'manage'>('fields')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize form if it doesn't exist
  if (!activeForm || activeForm.spreadsheetId !== spreadsheetId) {
    const existingForm = forms.find(f => f.spreadsheetId === spreadsheetId)
    if (existingForm) {
      setActiveForm(existingForm)
    } else {
      const newForm = createForm(spreadsheetId, columns)
      setActiveForm(newForm)
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (active.id !== over.id && activeForm) {
      const oldIndex = activeForm.fields.findIndex(f => f.id === active.id)
      const newIndex = activeForm.fields.findIndex(f => f.id === over.id)
      
      const newFields = arrayMove(activeForm.fields, oldIndex, newIndex).map((field, index) => ({
        ...field,
        order: index,
      }))
      
      reorderFields(activeForm.id, newFields)
    }
  }

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    if (editingField && activeForm) {
      updateField(activeForm.id, editingField.id, updates)
      setEditingField(null)
      toast.success('Field updated')
    }
  }

  const handleSaveForm = () => {
    if (activeForm) {
      toast.success('Form saved successfully')
    }
  }

  const handleShareForm = () => {
    if (activeForm?.shareUrl) {
      const fullUrl = `${window.location.origin}${activeForm.shareUrl}`
      navigator.clipboard.writeText(fullUrl)
      toast.success('Form link copied to clipboard!')
    }
  }

  const handleToggleFormStatus = () => {
    if (activeForm) {
      const newStatus = activeForm.status === 'active' ? 'disabled' : 'active'
      updateForm(activeForm.id, { status: newStatus })
      toast.success(`Form ${newStatus === 'active' ? 'enabled' : 'disabled'}`)
    }
  }

  const handleDeleteForm = () => {
    if (activeForm) {
      deleteForm(activeForm.id)
      toast.success('Form deleted')
      onClose()
    }
  }

  if (!activeForm) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold">Form Builder</h2>
            <p className="text-gray-400 mt-1">Create a form from your spreadsheet</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={handleShareForm}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Form
            </button>
            <button
              onClick={handleSaveForm}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Builder Section */}
          <div className={`flex-1 flex flex-col ${showPreview ? 'w-1/2' : 'w-full'}`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab('fields')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'fields'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Form Fields
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'manage'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Manage
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'fields' ? (
                <div>
                  <div className="mb-6">
                    <input
                      type="text"
                      value={activeForm.name}
                      onChange={(e) => updateForm(activeForm.id, { name: e.target.value })}
                      className="text-2xl font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                      placeholder="Form Name"
                    />
                    <textarea
                      value={activeForm.description || ''}
                      onChange={(e) => updateForm(activeForm.id, { description: e.target.value })}
                      className="mt-2 w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-gray-400 resize-none"
                      placeholder="Form description (optional)"
                      rows={2}
                    />
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={activeForm.fields.map(f => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {activeForm.fields.map(field => (
                        <SortableField
                          key={field.id}
                          field={field}
                          formId={activeForm.id}
                          onEdit={setEditingField}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              ) : activeTab === 'settings' ? (
                <FormSettings form={activeForm} onUpdate={(updates) => updateForm(activeForm.id, updates)} />
              ) : (
                <FormManagement 
                  form={activeForm} 
                  onToggleStatus={handleToggleFormStatus}
                  onDelete={() => setShowDeleteConfirm(true)}
                />
              )}
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="w-1/2 border-l border-gray-800 bg-gray-950 p-6 overflow-y-auto">
              <FormPreview form={activeForm} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Field Editor Modal */}
      <AnimatePresence>
        {editingField && (
          <FieldEditor
            field={editingField}
            onSave={handleFieldUpdate}
            onClose={() => setEditingField(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Delete Form</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this form? This will permanently remove the form and all its submissions.
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleDeleteForm()
                    setShowDeleteConfirm(false)
                  }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Delete Form
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Form Management Component
function FormManagement({ form, onToggleStatus, onDelete }: { 
  form: Form; 
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Form Status</h3>
        
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Form Status</h4>
              <p className="text-sm text-gray-400 mt-1">
                {form.status === 'active' 
                  ? 'Form is active and accepting submissions' 
                  : 'Form is disabled and not accepting submissions'}
              </p>
            </div>
            <button
              onClick={onToggleStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                form.status === 'active'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Power className="w-4 h-4" />
              {form.status === 'active' ? 'Disable Form' : 'Enable Form'}
            </button>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Created</p>
                <p className="font-medium">{new Date(form.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Updated</p>
                <p className="font-medium">{new Date(form.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Form URL</p>
                <p className="font-medium text-blue-400">{form.shareUrl}</p>
              </div>
              <div>
                <p className="text-gray-400">Form ID</p>
                <p className="font-medium font-mono text-xs">{form.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-red-500">Danger Zone</h3>
        
        <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-6">
          <h4 className="font-medium text-red-400 mb-2">Delete Form</h4>
          <p className="text-sm text-gray-400 mb-4">
            Once you delete a form, there is no going back. All form data and submissions will be permanently removed.
          </p>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Delete Form
          </button>
        </div>
      </div>
    </div>
  )
}

// Form Settings Component
function FormSettings({ form, onUpdate }: { form: Form; onUpdate: (updates: Partial<Form>) => void }) {
  const settings = form.settings

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Form Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Submit Button Text</label>
            <input
              type="text"
              value={settings.submitButtonText}
              onChange={(e) => onUpdate({
                settings: { ...settings, submitButtonText: e.target.value }
              })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Success Message</label>
            <textarea
              value={settings.successMessage}
              onChange={(e) => onUpdate({
                settings: { ...settings, successMessage: e.target.value }
              })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowMultipleSubmissions}
                onChange={(e) => onUpdate({
                  settings: { ...settings, allowMultipleSubmissions: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Allow multiple submissions</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireAuth}
                onChange={(e) => onUpdate({
                  settings: { ...settings, requireAuth: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Require authentication</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifyOnSubmission}
                onChange={(e) => onUpdate({
                  settings: { ...settings, notifyOnSubmission: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Send email notifications</span>
            </label>
          </div>

          {settings.notifyOnSubmission && (
            <div>
              <label className="block text-sm font-medium mb-2">Notification Emails</label>
              <input
                type="text"
                value={settings.notificationEmails?.join(', ') || ''}
                onChange={(e) => onUpdate({
                  settings: {
                    ...settings,
                    notificationEmails: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Theme</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <input
              type="color"
              value={settings.theme?.primaryColor || '#3b82f6'}
              onChange={(e) => onUpdate({
                settings: {
                  ...settings,
                  theme: { ...settings.theme, primaryColor: e.target.value }
                }
              })}
              className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <input
              type="color"
              value={settings.theme?.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({
                settings: {
                  ...settings,
                  theme: { ...settings.theme, backgroundColor: e.target.value }
                }
              })}
              className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Form Preview Component
function FormPreview({ form }: { form: Form }) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    toast.success(form.settings.successMessage)
  }

  return (
    <div
      className="max-w-2xl mx-auto p-6 rounded-lg"
      style={{
        backgroundColor: form.settings.theme?.backgroundColor || '#ffffff',
        color: form.settings.theme?.backgroundColor === '#ffffff' ? '#000000' : '#ffffff',
      }}
    >
      <h2 className="text-2xl font-bold mb-2">{form.name}</h2>
      {form.description && (
        <p className="text-gray-600 mb-6">{form.description}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.filter(field => field.visible).map(field => (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.columnId] || ''}
                onChange={(e) => setFormData({ ...formData, [field.columnId]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            ) : field.type === 'select' ? (
              <select
                required={field.required}
                value={formData[field.columnId] || ''}
                onChange={(e) => setFormData({ ...formData, [field.columnId]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an option</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={formData[field.columnId] || false}
                onChange={(e) => setFormData({ ...formData, [field.columnId]: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.columnId] || ''}
                onChange={(e) => setFormData({ ...formData, [field.columnId]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...(field.validation && {
                  minLength: field.validation.minLength,
                  maxLength: field.validation.maxLength,
                  min: field.validation.min,
                  max: field.validation.max,
                  pattern: field.validation.pattern,
                })}
              />
            )}
            
            {field.helpText && (
              <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: form.settings.theme?.primaryColor || '#3b82f6',
            color: '#ffffff',
          }}
        >
          {form.settings.submitButtonText}
        </button>
      </form>
    </div>
  )
}

// Field Editor Component
function FieldEditor({
  field,
  onSave,
  onClose,
}: {
  field: FormField
  onSave: (updates: Partial<FormField>) => void
  onClose: () => void
}) {
  const [editedField, setEditedField] = useState(field)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Edit Field</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Label</label>
              <input
                type="text"
                value={editedField.label}
                onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Field Type</label>
              <select
                value={editedField.type}
                onChange={(e) => setEditedField({ ...editedField, type: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="textarea">Text Area</option>
                <option value="select">Dropdown</option>
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio Buttons</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Placeholder</label>
              <input
                type="text"
                value={editedField.placeholder || ''}
                onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Help Text</label>
              <input
                type="text"
                value={editedField.helpText || ''}
                onChange={(e) => setEditedField({ ...editedField, helpText: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editedField.required}
                  onChange={(e) => setEditedField({ ...editedField, required: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Required field</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editedField.visible}
                  onChange={(e) => setEditedField({ ...editedField, visible: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Visible in form</span>
                <span className="text-xs text-gray-400">(Uncheck for admin-only fields)</span>
              </label>
            </div>

            {['text', 'textarea', 'email'].includes(editedField.type) && (
              <div className="space-y-3">
                <h4 className="font-medium">Text Validation</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Min Length</label>
                    <input
                      type="number"
                      value={editedField.validation?.minLength || ''}
                      onChange={(e) => setEditedField({
                        ...editedField,
                        validation: {
                          ...editedField.validation,
                          minLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                      className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Max Length</label>
                    <input
                      type="number"
                      value={editedField.validation?.maxLength || ''}
                      onChange={(e) => setEditedField({
                        ...editedField,
                        validation: {
                          ...editedField.validation,
                          maxLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                      className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {editedField.type === 'email' && (
                  <p className="text-sm text-gray-400">Email validation is automatically applied</p>
                )}

                <div>
                  <label className="block text-sm mb-1">Pattern (Regex)</label>
                  <input
                    type="text"
                    value={editedField.validation?.pattern || ''}
                    onChange={(e) => setEditedField({
                      ...editedField,
                      validation: {
                        ...editedField.validation,
                        pattern: e.target.value
                      }
                    })}
                    className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., ^[A-Z]{2}[0-9]{4}$"
                  />
                </div>
              </div>
            )}

            {editedField.type === 'number' && (
              <div className="space-y-3">
                <h4 className="font-medium">Number Validation</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Min Value</label>
                    <input
                      type="number"
                      value={editedField.validation?.min || ''}
                      onChange={(e) => setEditedField({
                        ...editedField,
                        validation: {
                          ...editedField.validation,
                          min: e.target.value ? parseFloat(e.target.value) : undefined
                        }
                      })}
                      className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Max Value</label>
                    <input
                      type="number"
                      value={editedField.validation?.max || ''}
                      onChange={(e) => setEditedField({
                        ...editedField,
                        validation: {
                          ...editedField.validation,
                          max: e.target.value ? parseFloat(e.target.value) : undefined
                        }
                      })}
                      className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {['select', 'radio'].includes(editedField.type) && (
              <div className="space-y-3">
                <h4 className="font-medium">Options</h4>
                <div className="space-y-2">
                  {editedField.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => {
                          const newOptions = [...(editedField.options || [])]
                          newOptions[index] = { ...option, value: e.target.value }
                          setEditedField({ ...editedField, options: newOptions })
                        }}
                        className="flex-1 px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Value"
                      />
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...(editedField.options || [])]
                          newOptions[index] = { ...option, label: e.target.value }
                          setEditedField({ ...editedField, options: newOptions })
                        }}
                        className="flex-1 px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Label"
                      />
                      <button
                        onClick={() => {
                          const newOptions = editedField.options?.filter((_, i) => i !== index)
                          setEditedField({ ...editedField, options: newOptions })
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(editedField.options || []), { value: '', label: '' }]
                      setEditedField({ ...editedField, options: newOptions })
                    }}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onSave(editedField)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}