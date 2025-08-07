import { useState, useEffect } from 'react'
import { X, Download, Eye, Trash2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { FormSubmission } from '../types/form'
import { useFormStore } from '../stores/formStore'
import toast from 'react-hot-toast'

interface FormSubmissionsViewProps {
  spreadsheetId: string
  onClose: () => void
  onAddToSpreadsheet: (submissions: FormSubmission[]) => void
}

export default function FormSubmissionsView({ 
  spreadsheetId, 
  onClose, 
  onAddToSpreadsheet 
}: FormSubmissionsViewProps) {
  const { getFormBySpreadsheetId, getSubmissions } = useFormStore()
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  
  const form = getFormBySpreadsheetId(spreadsheetId)
  const submissions = form ? getSubmissions(form.id) : []
  
  const filteredSubmissions = submissions.filter(sub => {
    if (!filter) return true
    const searchText = filter.toLowerCase()
    return Object.values(sub.data).some(value => 
      String(value).toLowerCase().includes(searchText)
    )
  })

  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([])
    } else {
      setSelectedSubmissions(filteredSubmissions.map(sub => sub.id))
    }
  }

  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissions(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    )
  }

  const handleAddSelected = () => {
    const submissionsToAdd = filteredSubmissions.filter(sub => 
      selectedSubmissions.includes(sub.id)
    )
    
    if (submissionsToAdd.length === 0) {
      toast.error('Please select submissions to add')
      return
    }
    
    onAddToSpreadsheet(submissionsToAdd)
    toast.success(`Added ${submissionsToAdd.length} submissions to spreadsheet`)
    onClose()
  }

  const handleExport = () => {
    if (!form) return
    
    // Create CSV content
    const headers = form.fields.map(f => f.label).join(',')
    const rows = filteredSubmissions.map(sub => 
      form.fields.map(f => {
        const value = sub.data[f.columnId]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
    
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.name}-submissions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Submissions exported')
  }

  if (!form) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <p className="text-gray-400">No form found for this spreadsheet</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

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
            <h2 className="text-2xl font-bold">Form Submissions</h2>
            <p className="text-gray-400 mt-1">
              {submissions.length} total submissions for "{form.name}"
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selectedSubmissions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Add Selected to Sheet ({selectedSubmissions.length})
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="px-6 py-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search submissions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submissions Table */}
        <div className="flex-1 overflow-auto">
          {filteredSubmissions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No submissions yet</p>
                <p className="text-gray-500 mt-2">Share your form to start collecting responses</p>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.length === filteredSubmissions.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Submitted At
                  </th>
                  {form.fields.map(field => (
                    <th key={field.id} className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                      {field.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.includes(submission.id)}
                        onChange={() => handleSelectSubmission(submission.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                    {form.fields.map(field => (
                      <td key={field.id} className="px-4 py-3 text-sm">
                        {field.type === 'checkbox' 
                          ? submission.data[field.columnId] ? '✓' : '✗'
                          : submission.data[field.columnId] || '-'
                        }
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          // In a real app, this would open a detailed view
                          console.log('View submission:', submission)
                        }}
                        className="text-gray-400 hover:text-gray-300 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-850">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </span>
            <span>
              Form URL: {window.location.origin}{form.shareUrl}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}