import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Save, Download, Share2, Lock, Unlock } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface Cell {
  id: string
  value: string
  locked: boolean
  type: 'text' | 'number' | 'date' | 'formula'
}

interface Column {
  id: string
  name: string
  width: number
  editable: boolean
}

const mockColumns: Column[] = [
  { id: 'id', name: 'ID', width: 80, editable: false },
  { id: 'name', name: 'Name', width: 200, editable: true },
  { id: 'email', name: 'Email', width: 250, editable: true },
  { id: 'department', name: 'Department', width: 150, editable: true },
  { id: 'salary', name: 'Salary', width: 120, editable: true },
  { id: 'status', name: 'Status', width: 120, editable: true },
  { id: 'joinDate', name: 'Join Date', width: 150, editable: true },
]

const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: `EMP${String(i + 1).padStart(3, '0')}`,
  name: `Employee ${i + 1}`,
  email: `employee${i + 1}@company.com`,
  department: ['Engineering', 'Sales', 'HR', 'Marketing'][i % 4],
  salary: `$${(50000 + Math.random() * 50000).toFixed(0)}`,
  status: ['Active', 'On Leave', 'Remote'][i % 3],
  joinDate: new Date(2020 + Math.floor(i / 10), i % 12, 1).toLocaleDateString(),
}))

export default function Spreadsheet() {
  const { id } = useParams()
  const [data, setData] = useState(mockData)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleCellClick = useCallback((row: number, col: string) => {
    setSelectedCell({ row, col })
    const column = mockColumns.find(c => c.id === col)
    if (column?.editable) {
      setEditingCell({ row, col })
      setEditValue(data[row][col as keyof typeof data[0]] as string)
    }
  }, [data])

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
      toast.success('Cell updated')
    }
  }, [editingCell, editValue, data])

  const handleAddRow = useCallback(() => {
    const newRow = {
      id: `EMP${String(data.length + 1).padStart(3, '0')}`,
      name: 'New Employee',
      email: 'new@company.com',
      department: 'Unassigned',
      salary: '$0',
      status: 'Active',
      joinDate: new Date().toLocaleDateString(),
    }
    setData([...data, newRow])
    toast.success('New row added')
  }, [data])

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {id === 'new' ? 'New Spreadsheet' : 'Employee Database'}
            </h2>
            <span className="text-sm text-gray-400">{data.length} rows</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddRow}
              className="flex items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded-lg">
              <Save className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          <table className="min-w-full">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {mockColumns.map((column) => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700"
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.name}</span>
                      {column.editable ? (
                        <Unlock className="w-3 h-3 text-gray-500" />
                      ) : (
                        <Lock className="w-3 h-3 text-gray-500" />
                      )}
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
                  {mockColumns.map((column) => (
                    <td
                      key={column.id}
                      className={`px-4 py-2 text-sm border-r border-gray-700 cursor-pointer ${
                        selectedCell?.row === rowIndex && selectedCell?.col === column.id
                          ? 'bg-primary-600/20 ring-1 ring-primary-600'
                          : ''
                      } ${!column.editable ? 'bg-gray-800/30' : ''}`}
                      onClick={() => handleCellClick(rowIndex, column.id)}
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
                          }}
                          className="w-full bg-gray-700 border border-primary-600 rounded px-1 py-0.5 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span>{row[column.id as keyof typeof row]}</span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            {selectedCell && (
              <span>
                Selected: {mockColumns.find(c => c.id === selectedCell.col)?.name} - Row {selectedCell.row + 1}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>Auto-save: On</span>
            <span>Last saved: 2 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}