import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Form, FormSubmission } from '../types/form'
import { useFormStore } from '../stores/formStore'
import toast from 'react-hot-toast'
import { Loader2, Power } from 'lucide-react'

export default function FormViewer() {
  const { formId } = useParams()
  const { forms, submitForm } = useFormStore()
  const [form, setForm] = useState<Form | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    // Set a timeout to show error if form doesn't load
    const loadTimeout = setTimeout(() => {
      if (!form) {
        setLoadError(true)
        setIsLoading(false)
      }
    }, 5000) // 5 second timeout

    // In a real app, this would fetch the form from an API
    console.log('FormViewer: Looking for form with ID:', formId)
    console.log('FormViewer: Available forms:', forms.map(f => ({ id: f.id, shareUrl: f.shareUrl })))
    
    const foundForm = forms.find(f => f.shareUrl?.includes(formId || ''))
    if (foundForm) {
      console.log('FormViewer: Found form:', foundForm.name)
      setForm(foundForm)
      setIsLoading(false)
      // Initialize form data with default values
      const initialData: Record<string, any> = {}
      foundForm.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.columnId] = field.defaultValue
        }
      })
      setFormData(initialData)
    }

    return () => clearTimeout(loadTimeout)
  }, [formId, forms, form])

  const validateField = (fieldId: string, value: any): string | null => {
    const field = form?.fields.find(f => f.columnId === fieldId)
    if (!field) return null

    if (field.required && !value) {
      return `${field.label} is required`
    }

    if (field.validation) {
      const { minLength, maxLength, min, max, pattern, patternMessage } = field.validation

      if (typeof value === 'string') {
        if (minLength && value.length < minLength) {
          return `Minimum length is ${minLength} characters`
        }
        if (maxLength && value.length > maxLength) {
          return `Maximum length is ${maxLength} characters`
        }
        if (pattern && !new RegExp(pattern).test(value)) {
          return patternMessage || 'Invalid format'
        }
      }

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `Minimum value is ${min}`
        }
        if (max !== undefined && value > max) {
          return `Maximum value is ${max}`
        }
      }
    }

    return null
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value })
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      const newErrors = { ...errors }
      delete newErrors[fieldId]
      setErrors(newErrors)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form) return

    // Validate all visible fields
    const newErrors: Record<string, string> = {}
    form.fields.filter(field => field.visible).forEach(field => {
      const error = validateField(field.columnId, formData[field.columnId])
      if (error) {
        newErrors[field.columnId] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fix the errors before submitting')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Submit the form
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      const submission = submitForm(form.id, formData)
      
      if (!form.settings.allowMultipleSubmissions) {
        setIsSubmitted(true)
      } else {
        // Reset form for multiple submissions
        const resetData: Record<string, any> = {}
        form.fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            resetData[field.columnId] = field.defaultValue
          } else if (field.type === 'checkbox') {
            resetData[field.columnId] = false
          } else {
            resetData[field.columnId] = ''
          }
        })
        setFormData(resetData)
      }
      
      toast.success(form.settings.successMessage)
    } catch (error) {
      toast.error('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!form || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {loadError ? (
            <>
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
              <p className="text-gray-600 mb-4">The form you're looking for doesn't exist or has been removed.</p>
              <p className="text-sm text-gray-500">Form ID: {formId}</p>
            </>
          ) : (
            <>
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Loading form...</p>
            </>
          )}
        </div>
      </div>
    )
  }

  if (form.status === 'disabled') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: form.settings.theme?.backgroundColor || '#f9fafb' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Power className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Form Disabled</h2>
          <p className="text-gray-600">This form is currently disabled and not accepting submissions.</p>
        </motion.div>
      </div>
    )
  }

  if (isSubmitted && !form.settings.allowMultipleSubmissions) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: form.settings.theme?.backgroundColor || '#f9fafb' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600">{form.settings.successMessage}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: form.settings.theme?.backgroundColor || '#f9fafb' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div 
          className="bg-white rounded-lg shadow-lg p-8"
          style={{
            borderRadius: form.settings.theme?.borderRadius || '0.5rem',
          }}
        >
          <h1 className="text-3xl font-bold mb-2">{form.name}</h1>
          {form.description && (
            <p className="text-gray-600 mb-8">{form.description}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.filter(field => field.visible).map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.columnId] || ''}
                    onChange={(e) => handleFieldChange(field.columnId, e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 resize-none ${
                      errors[field.columnId] 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    rows={4}
                    style={{
                      borderRadius: form.settings.theme?.borderRadius || '0.5rem',
                    }}
                  />
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={formData[field.columnId] || ''}
                    onChange={(e) => handleFieldChange(field.columnId, e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                      errors[field.columnId] 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    style={{
                      borderRadius: form.settings.theme?.borderRadius || '0.5rem',
                    }}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={field.columnId}
                      checked={formData[field.columnId] || false}
                      onChange={(e) => handleFieldChange(field.columnId, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={field.columnId} className="ml-2 text-sm text-gray-700">
                      {field.placeholder || 'Check to confirm'}
                    </label>
                  </div>
                ) : field.type === 'radio' && field.options ? (
                  <div className="space-y-2">
                    {field.options.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name={field.columnId}
                          value={option.value}
                          checked={formData[field.columnId] === option.value}
                          onChange={(e) => handleFieldChange(field.columnId, e.target.value)}
                          required={field.required}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.columnId] || ''}
                    onChange={(e) => handleFieldChange(field.columnId, e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                      errors[field.columnId] 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    style={{
                      borderRadius: form.settings.theme?.borderRadius || '0.5rem',
                    }}
                    {...(field.validation && {
                      minLength: field.validation.minLength,
                      maxLength: field.validation.maxLength,
                      min: field.validation.min,
                      max: field.validation.max,
                      pattern: field.validation.pattern,
                    })}
                  />
                )}
                
                {field.helpText && !errors[field.columnId] && (
                  <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
                )}
                
                {errors[field.columnId] && (
                  <p className="text-sm text-red-600 mt-1">{errors[field.columnId]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              style={{
                backgroundColor: form.settings.theme?.primaryColor || '#3b82f6',
                color: '#ffffff',
                borderRadius: form.settings.theme?.borderRadius || '0.5rem',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                form.settings.submitButtonText
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Powered by IntelliSheet
        </p>
      </motion.div>
    </div>
  )
}