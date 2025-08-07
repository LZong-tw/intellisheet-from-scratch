import { useState, useCallback, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Save, Download, Share2, Lock, Unlock, Copy, Clipboard, Undo, Redo, Filter, SortAsc, SortDesc, FunctionSquare, FileDown, Upload, FileInput } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FormBuilder from '../components/FormBuilder'
import FormSubmissionsView from '../components/FormSubmissionsView'
import { useFormStore } from '../stores/formStore'
import { FormSubmission } from '../types/form'

interface Cell {
  id: string
  value: string
  formula?: string
  locked: boolean
  type: 'text' | 'number' | 'date' | 'formula'
}

interface Column {
  id: string
  name: string
  width: number
  editable: boolean
  type?: 'text' | 'number' | 'date'
}

const mockColumns: Column[] = [
  { id: 'id', name: 'ID', width: 80, editable: false },
  { id: 'name', name: 'Name', width: 200, editable: true, type: 'text' },
  { id: 'email', name: 'Email', width: 250, editable: true, type: 'text' },
  { id: 'department', name: 'Department', width: 150, editable: true, type: 'text' },
  { id: 'salary', name: 'Salary', width: 120, editable: true, type: 'number' },
  { id: 'bonus', name: 'Bonus', width: 120, editable: true, type: 'number' },
  { id: 'total', name: 'Total Comp', width: 120, editable: true, type: 'number' },
  { id: 'status', name: 'Status', width: 120, editable: true, type: 'text' },
  { id: 'joinDate', name: 'Join Date', width: 150, editable: true, type: 'date' },
]

const mockData = Array.from({ length: 50 }, (_, i) => {
  const salary = 50000 + Math.random() * 50000
  const bonus = salary * 0.1
  return {
    id: `EMP${String(i + 1).padStart(3, '0')}`,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: ['Engineering', 'Sales', 'HR', 'Marketing'][i % 4],
    salary: salary.toFixed(0),
    bonus: bonus.toFixed(0),
    total: `=E${i + 2}+F${i + 2}`, // Formula example
    status: ['Active', 'On Leave', 'Remote'][i % 3],
    joinDate: new Date(2020 + Math.floor(i / 10), i % 12, 1).toLocaleDateString(),
  }
})

export default function Spreadsheet() {
  const { id } = useParams()
  const [data, setData] = useState(mockData)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null)
  const [selectedRange, setSelectedRange] = useState<{ start: { row: number; col: string }, end: { row: number; col: string } } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [copiedCell, setCopiedCell] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showFormulaBar, setShowFormulaBar] = useState(true)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [showSubmissions, setShowSubmissions] = useState(false)
  const formulaBarRef = useRef<HTMLInputElement>(null)
  const { getFormBySpreadsheetId, submissions, createForm, forms } = useFormStore()

  // Create a demo form on first load if none exists
  useEffect(() => {
    if (id && !getFormBySpreadsheetId(id) && forms.length === 0) {
      // Create a demo form for testing
      createForm(id, mockColumns)
    }
  }, [id])

  // Calculate formula values
  const calculateFormula = (formula: string, rowIndex: number) => {
    if (!formula.startsWith('=')) return formula
    
    try {
      // Simple formula parser - supports basic operations and cell references
      let expression = formula.substring(1)
      
      // Replace cell references with values
      expression = expression.replace(/([A-Z])(\d+)/g, (match, col, row) => {
        const colIndex = col.charCodeAt(0) - 65 // A=0, B=1, etc
        const rowIdx = parseInt(row) - 2 // Adjust for header and 0-based index
        const columnId = mockColumns[colIndex]?.id
        if (columnId && data[rowIdx]) {
          const value = data[rowIdx][columnId as keyof typeof data[0]]
          return String(value).replace(/[^0-9.-]/g, '') || '0'
        }
        return '0'
      })
      
      // Evaluate the expression (in production, use a proper formula parser)
      const result = Function('"use strict"; return (' + expression + ')')()
      return result.toFixed(2)
    } catch (error) {
      return '#ERROR'
    }
  }

  const getCellValue = (row: any, colId: string, rowIndex: number) => {
    const value = row[colId as keyof typeof row]
    if (typeof value === 'string' && value.startsWith('=')) {
      return calculateFormula(value, rowIndex)
    }
    return value
  }

  const handleCellClick = useCallback((e: React.MouseEvent, row: number, col: string) => {
    if (e.shiftKey && selectedCell) {
      // Range selection
      setSelectedRange({
        start: selectedCell,
        end: { row, col }
      })
    } else {
      setSelectedCell({ row, col })
      setSelectedRange(null)
    }
    const column = mockColumns.find(c => c.id === col)
    if (column?.editable && !e.shiftKey) {
      setEditingCell({ row, col })
      setEditValue(String(data[row][col as keyof typeof data[0]]))
    }
  }, [data, selectedCell])

  const handleCellChange = useCallback((value: string) => {
    setEditValue(value)
  }, [])

  const handleCellBlur = useCallback(() => {
    if (editingCell) {
      const newData = [...data]
      newData[editingCell.row] = {
        ...newData[editingCell.row],
        [editingCell.col]: editValue,
      }
      setData(newData)
      setEditingCell(null)
      
      // Add to history
      setHistory([...history.slice(0, historyIndex + 1), newData])
      setHistoryIndex(historyIndex + 1)
      
      toast.success('Cell updated')
    }
  }, [editingCell, editValue, data, history, historyIndex])

  const handleAddRow = useCallback(() => {
    const newRow = {
      id: `EMP${String(data.length + 1).padStart(3, '0')}`,
      name: 'New Employee',
      email: 'new@company.com',
      department: 'Unassigned',
      salary: '0',
      bonus: '0',
      total: '=E' + (data.length + 2) + '+F' + (data.length + 2),
      status: 'Active',
      joinDate: new Date().toLocaleDateString(),
    }
    setData([...data, newRow])
    toast.success('New row added')
  }, [data])

  const handleCopy = useCallback(() => {
    if (selectedCell) {
      setCopiedCell({
        value: data[selectedCell.row][selectedCell.col as keyof typeof data[0]],
        row: selectedCell.row,
        col: selectedCell.col
      })
      toast.success('Cell copied')
    }
  }, [selectedCell, data])

  const handlePaste = useCallback(() => {
    if (selectedCell && copiedCell) {
      const newData = [...data]
      newData[selectedCell.row] = {
        ...newData[selectedCell.row],
        [selectedCell.col]: copiedCell.value,
      }
      setData(newData)
      toast.success('Cell pasted')
    }
  }, [selectedCell, copiedCell, data])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setData(history[historyIndex - 1])
      toast.success('Undone')
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setData(history[historyIndex + 1])
      toast.success('Redone')
    }
  }, [history, historyIndex])

  const handleSort = useCallback((columnId: string) => {
    const newDirection = sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(columnId)
    setSortDirection(newDirection)
    
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[columnId as keyof typeof a]
      const bVal = b[columnId as keyof typeof b]
      
      if (newDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    
    setData(sortedData)
  }, [data, sortColumn, sortDirection])

  const handleExport = useCallback(() => {
    // Convert data to CSV
    const headers = mockColumns.map(col => col.name).join(',')
    const rows = data.map(row => 
      mockColumns.map(col => getCellValue(row, col.id, data.indexOf(row))).join(',')
    ).join('\n')
    
    const csv = headers + '\n' + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spreadsheet.csv'
    a.click()
    
    toast.success('Exported to CSV')
  }, [data])

  const handleAddSubmissionsToSpreadsheet = (formSubmissions: FormSubmission[]) => {
    const newRows = formSubmissions.map((submission, index) => {
      const row: any = {}
      mockColumns.forEach(col => {
        if (submission.data[col.id] !== undefined) {
          row[col.id] = submission.data[col.id]
        } else if (col.id === 'id') {
          row[col.id] = `FORM${String(data.length + index + 1).padStart(3, '0')}`
        } else {
          row[col.id] = ''
        }
      })
      return row
    })
    
    setData(prevData => [...prevData, ...newRows])
    recordHistory()
    toast.success(`Added ${formSubmissions.length} form submissions`)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            e.preventDefault()
            handleCopy()
            break
          case 'v':
            e.preventDefault()
            handlePaste()
            break
          case 'z':
            e.preventDefault()
            handleUndo()
            break
          case 'y':
            e.preventDefault()
            handleRedo()
            break
          case 's':
            e.preventDefault()
            toast.success('Spreadsheet saved')
            break
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCopy, handlePaste, handleUndo, handleRedo])

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {id === 'new' ? 'New Spreadsheet' : 'Employee Database'}
            </h2>
            <span className="text-sm text-gray-400">{data.length} rows × {mockColumns.length} columns</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddRow}
              className="flex items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </button>
            <div className="border-l border-gray-700 h-6 mx-2" />
            <button onClick={handleUndo} className="p-1.5 hover:bg-gray-700 rounded-lg" title="Undo (Ctrl+Z)">
              <Undo className="w-5 h-5" />
            </button>
            <button onClick={handleRedo} className="p-1.5 hover:bg-gray-700 rounded-lg" title="Redo (Ctrl+Y)">
              <Redo className="w-5 h-5" />
            </button>
            <button onClick={handleCopy} className="p-1.5 hover:bg-gray-700 rounded-lg" title="Copy (Ctrl+C)">
              <Copy className="w-5 h-5" />
            </button>
            <button onClick={handlePaste} className="p-1.5 hover:bg-gray-700 rounded-lg" title="Paste (Ctrl+V)">
              <Clipboard className="w-5 h-5" />
            </button>
            <div className="border-l border-gray-700 h-6 mx-2" />
            <button 
              onClick={() => setShowFormulaBar(!showFormulaBar)}
              className="p-1.5 hover:bg-gray-700 rounded-lg" 
              title="Toggle Formula Bar"
            >
              <FunctionSquare className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded-lg" title="Save (Ctrl+S)">
              <Save className="w-5 h-5" />
            </button>
            <button onClick={handleExport} className="p-1.5 hover:bg-gray-700 rounded-lg" title="Export">
              <Download className="w-5 h-5" />
            </button>
            <div className="border-l border-gray-700 h-6 mx-2" />
            <button 
              onClick={() => setShowFormBuilder(true)}
              className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
              title="Generate Form"
            >
              <FileInput className="w-4 h-4 mr-1" />
              Generate Form
            </button>
            {getFormBySpreadsheetId(id || 'default') && (
              <button 
                onClick={() => setShowSubmissions(true)}
                className="flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium"
                title="View Submissions"
              >
                <FileDown className="w-4 h-4 mr-1" />
                View Submissions
              </button>
            )}
            <button className="p-1.5 hover:bg-gray-700 rounded-lg" title="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Formula Bar */}
      {showFormulaBar && selectedCell && (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-2 flex items-center space-x-4">
          <span className="text-sm text-gray-400 font-mono">
            {mockColumns.find(c => c.id === selectedCell.col)?.name[0]}{selectedCell.row + 2}
          </span>
          <input
            ref={formulaBarRef}
            type="text"
            value={editingCell ? editValue : String(data[selectedCell.row][selectedCell.col as keyof typeof data[0]])}
            onChange={(e) => handleCellChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellBlur()
              }
            }}
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 font-mono text-sm focus:outline-none focus:border-primary-500"
            placeholder="Enter value or formula (e.g., =A1+B1)"
          />
        </div>
      )}

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          <table className="min-w-full">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="w-12 px-2 py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-700">
                  #
                </th>
                {mockColumns.map((column, colIndex) => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700 cursor-pointer hover:bg-gray-700"
                    style={{ width: column.width, minWidth: column.width }}
                    onClick={() => handleSort(column.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{String.fromCharCode(65 + colIndex)} - {column.name}</span>
                      <div className="flex items-center gap-1">
                        {sortColumn === column.id && (
                          sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                        {column.editable ? (
                          <Unlock className="w-3 h-3 text-gray-500" />
                        ) : (
                          <Lock className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {data.map((row, rowIndex) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.01 }}
                  className="hover:bg-gray-800/50"
                >
                  <td className="px-2 py-2 text-center text-xs text-gray-500 border-r border-gray-700">
                    {rowIndex + 2}
                  </td>
                  {mockColumns.map((column) => {
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === column.id
                    const isInRange = selectedRange && 
                      rowIndex >= Math.min(selectedRange.start.row, selectedRange.end.row) &&
                      rowIndex <= Math.max(selectedRange.start.row, selectedRange.end.row)
                    
                    return (
                      <td
                        key={column.id}
                        className={`px-4 py-2 text-sm border-r border-gray-700 cursor-pointer ${
                          isSelected ? 'bg-primary-600/20 ring-1 ring-primary-600' : ''
                        } ${isInRange ? 'bg-primary-600/10' : ''} ${
                          !column.editable ? 'bg-gray-800/30' : ''
                        } ${copiedCell?.row === rowIndex && copiedCell?.col === column.id ? 'ring-1 ring-dashed ring-gray-500' : ''}`}
                        onClick={(e) => handleCellClick(e, rowIndex, column.id)}
                      >
                        {editingCell?.row === rowIndex && editingCell?.col === column.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => handleCellChange(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCellBlur()
                              if (e.key === 'Escape') {
                                setEditingCell(null)
                                setEditValue('')
                              }
                              if (e.key === 'Tab') {
                                e.preventDefault()
                                handleCellBlur()
                                // Move to next cell
                                const nextColIndex = mockColumns.findIndex(c => c.id === column.id) + 1
                                if (nextColIndex < mockColumns.length) {
                                  handleCellClick(e as any, rowIndex, mockColumns[nextColIndex].id)
                                }
                              }
                            }}
                            className="w-full bg-gray-700 border border-primary-600 rounded px-1 py-0.5 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className={column.type === 'number' ? 'font-mono' : ''}>
                            {getCellValue(row, column.id, rowIndex)}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            {selectedCell && (
              <span>
                Cell: {mockColumns.find(c => c.id === selectedCell.col)?.name[0]}{selectedCell.row + 2}
              </span>
            )}
            {selectedRange && (
              <span>
                Range: {Math.abs(selectedRange.end.row - selectedRange.start.row) + 1} rows selected
              </span>
            )}
            <span>Functions: SUM, AVG, MIN, MAX, COUNT</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Auto-save: On
            </span>
            <span>Last saved: Just now</span>
          </div>
        </div>
      </div>

      {/* Form Builder Modal */}
      {showFormBuilder && (
        <FormBuilder
          spreadsheetId={id || 'default'}
          columns={mockColumns}
          onClose={() => setShowFormBuilder(false)}
        />
      )}

      {/* Form Submissions Modal */}
      {showSubmissions && (
        <FormSubmissionsView
          spreadsheetId={id || 'default'}
          onClose={() => setShowSubmissions(false)}
          onAddToSpreadsheet={handleAddSubmissionsToSpreadsheet}
        />
      )}
    </div>
  )
}