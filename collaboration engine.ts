import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Users, MousePointer, Edit3, Save, Cloud, WifiOff, Wifi, AlertCircle, Check } from 'lucide-react';

// Collaboration Engine with WebSocket simulation
class CollaborationEngine {
  constructor() {
    this.listeners = new Map();
    this.presence = new Map();
    this.operations = [];
    this.version = 0;
    this.isConnected = true;
    this.pendingChanges = [];
  }

  // Simulate WebSocket connection
  connect(userId, tableId) {
    this.userId = userId;
    this.tableId = tableId;
    this.isConnected = true;
    
    // Simulate connection
    setTimeout(() => {
      this.emit('connected', { userId, tableId });
      this.broadcastPresence('join');
    }, 100);
  }

  disconnect() {
    this.isConnected = false;
    this.broadcastPresence('leave');
    this.emit('disconnected', {});
  }

  // Presence management
  broadcastPresence(action) {
    const presence = {
      userId: this.userId,
      action,
      timestamp: Date.now(),
      cursor: null,
      selection: null
    };
    
    if (action === 'join') {
      this.presence.set(this.userId, presence);
    } else if (action === 'leave') {
      this.presence.delete(this.userId);
    }
    
    this.emit('presence', Array.from(this.presence.values()));
  }

  updateCursor(position) {
    if (!this.isConnected) return;
    
    const presence = this.presence.get(this.userId) || {};
    presence.cursor = position;
    presence.timestamp = Date.now();
    this.presence.set(this.userId, presence);
    
    this.emit('cursor', { userId: this.userId, position });
  }

  updateSelection(selection) {
    if (!this.isConnected) return;
    
    const presence = this.presence.get(this.userId) || {};
    presence.selection = selection;
    presence.timestamp = Date.now();
    this.presence.set(this.userId, presence);
    
    this.emit('selection', { userId: this.userId, selection });
  }

  // Operational Transform
  applyOperation(operation) {
    if (!this.isConnected) {
      this.pendingChanges.push(operation);
      return;
    }
    
    // Transform operation against concurrent operations
    const transformed = this.transformOperation(operation);
    
    this.operations.push(transformed);
    this.version++;
    
    // Broadcast to other users
    this.emit('operation', transformed);
    
    return transformed;
  }

  transformOperation(op) {
    // Simplified OT - in real implementation would handle conflicts
    return {
      ...op,
      version: this.version,
      userId: this.userId,
      timestamp: Date.now()
    };
  }

  // Event handling
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(handler);
  }

  off(event, handler) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        setTimeout(() => handler(data), 0);
      });
    }
  }

  // Sync pending changes when reconnected
  syncPendingChanges() {
    if (this.isConnected && this.pendingChanges.length > 0) {
      const changes = [...this.pendingChanges];
      this.pendingChanges = [];
      
      changes.forEach(change => {
        this.applyOperation(change);
      });
    }
  }
}

// Collaborative Spreadsheet Component
const CollaborativeSpreadsheet = () => {
  // User management
  const users = [
    { id: 'user1', name: 'Alice Chen', avatar: '👩', color: '#3B82F6' },
    { id: 'user2', name: 'Bob Smith', avatar: '👨', color: '#10B981' },
    { id: 'user3', name: 'Carol White', avatar: '👩‍💼', color: '#F59E0B' },
    { id: 'user4', name: 'David Lee', avatar: '👨‍💻', color: '#EF4444' }
  ];

  const [currentUser, setCurrentUser] = useState(users[0]);
  const [onlineUsers, setOnlineUsers] = useState([users[0]]);
  const [isConnected, setIsConnected] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [lastSaved, setLastSaved] = useState(new Date());
  
  // Collaboration state
  const [cursors, setCursors] = useState({});
  const [selections, setSelections] = useState({});
  const [cellLocks, setCellLocks] = useState({});
  const [editHistory, setEditHistory] = useState([]);
  
  // Table data
  const [data, setData] = useState([
    { id: 1, product: 'IntelliSheet Pro', price: 299, quantity: 45, status: 'active', owner: 'Alice Chen' },
    { id: 2, product: 'DataFlow Enterprise', price: 599, quantity: 23, status: 'pending', owner: 'Bob Smith' },
    { id: 3, product: 'Analytics Suite', price: 199, quantity: 67, status: 'active', owner: 'Carol White' },
    { id: 4, product: 'Report Builder', price: 149, quantity: 89, status: 'inactive', owner: 'David Lee' },
    { id: 5, product: 'Dashboard Plus', price: 349, quantity: 34, status: 'active', owner: 'Alice Chen' }
  ]);
  
  // UI state
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  
  // Refs
  const engineRef = useRef(null);
  const autoSaveRef = useRef(null);

  // Initialize collaboration engine
  useEffect(() => {
    const engine = new CollaborationEngine();
    engineRef.current = engine;
    
    // Connect to collaboration service
    engine.connect(currentUser.id, 'table_001');
    
    // Set up event handlers
    engine.on('connected', () => {
      setIsConnected(true);
      console.log('Connected to collaboration service');
    });
    
    engine.on('disconnected', () => {
      setIsConnected(false);
      console.log('Disconnected from collaboration service');
    });
    
    engine.on('presence', (users) => {
      // Simulate other users joining
      if (users.length === 1 && Math.random() > 0.5) {
        setTimeout(() => {
          const newUser = users[0].userId === 'user1' ? users[1] : users[2];
          if (newUser) {
            setOnlineUsers(prev => [...prev, newUser]);
          }
        }, 2000);
      }
    });
    
    engine.on('cursor', ({ userId, position }) => {
      setCursors(prev => ({
        ...prev,
        [userId]: position
      }));
    });
    
    engine.on('selection', ({ userId, selection }) => {
      setSelections(prev => ({
        ...prev,
        [userId]: selection
      }));
    });
    
    engine.on('operation', (op) => {
      handleRemoteOperation(op);
    });
    
    // Auto-save timer
    autoSaveRef.current = setInterval(() => {
      if (unsavedChanges > 0) {
        saveChanges();
      }
    }, 5000);
    
    return () => {
      engine.disconnect();
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [currentUser]);

  // Handle remote operations
  const handleRemoteOperation = useCallback((operation) => {
    switch (operation.type) {
      case 'cell_update':
        setData(prev => {
          const newData = [...prev];
          const rowIndex = newData.findIndex(row => row.id === operation.rowId);
          if (rowIndex !== -1) {
            newData[rowIndex] = {
              ...newData[rowIndex],
              [operation.field]: operation.value
            };
          }
          return newData;
        });
        
        // Add to history
        addToHistory({
          ...operation,
          user: users.find(u => u.id === operation.userId)
        });
        break;
        
      case 'row_add':
        setData(prev => [...prev, operation.row]);
        break;
        
      case 'row_delete':
        setData(prev => prev.filter(row => row.id !== operation.rowId));
        break;
    }
  }, []);

  // Add to edit history
  const addToHistory = useCallback((entry) => {
    setEditHistory(prev => [{
      ...entry,
      timestamp: new Date()
    }, ...prev].slice(0, 50)); // Keep last 50 entries
  }, []);

  // Cell editing
  const startEditing = useCallback((rowId, field) => {
    const cellKey = `${rowId}-${field}`;
    
    // Check if cell is locked by another user
    if (cellLocks[cellKey] && cellLocks[cellKey] !== currentUser.id) {
      alert(`This cell is being edited by ${cellLocks[cellKey]}`);
      return;
    }
    
    setEditingCell(cellKey);
    
    // Lock cell for current user
    setCellLocks(prev => ({
      ...prev,
      [cellKey]: currentUser.id
    }));
    
    // Broadcast lock
    if (engineRef.current) {
      engineRef.current.emit('cell_lock', {
        cellKey,
        userId: currentUser.id,
        locked: true
      });
    }
  }, [cellLocks, currentUser]);

  const finishEditing = useCallback((rowId, field, value) => {
    const cellKey = `${rowId}-${field}`;
    
    // Update data
    setData(prev => {
      const newData = [...prev];
      const rowIndex = newData.findIndex(row => row.id === rowId);
      if (rowIndex !== -1) {
        const oldValue = newData[rowIndex][field];
        if (oldValue !== value) {
          newData[rowIndex] = {
            ...newData[rowIndex],
            [field]: value
          };
          
          // Apply operation
          if (engineRef.current) {
            engineRef.current.applyOperation({
              type: 'cell_update',
              rowId,
              field,
              value,
              oldValue
            });
          }
          
          // Track unsaved changes
          setUnsavedChanges(prev => prev + 1);
          
          // Add to history
          addToHistory({
            type: 'cell_update',
            user: currentUser,
            rowId,
            field,
            oldValue,
            newValue: value
          });
        }
      }
      return newData;
    });
    
    // Release lock
    setEditingCell(null);
    setCellLocks(prev => {
      const newLocks = { ...prev };
      delete newLocks[cellKey];
      return newLocks;
    });
    
    // Broadcast unlock
    if (engineRef.current) {
      engineRef.current.emit('cell_lock', {
        cellKey,
        userId: currentUser.id,
        locked: false
      });
    }
  }, [currentUser, addToHistory]);

  // Save changes
  const saveChanges = useCallback(() => {
    // Simulate save
    setTimeout(() => {
      setUnsavedChanges(0);
      setLastSaved(new Date());
    }, 500);
  }, []);

  // Mouse tracking for cursors
  const handleMouseMove = useCallback((e, rowId, field) => {
    if (engineRef.current) {
      const cellKey = `${rowId}-${field}`;
      engineRef.current.updateCursor(cellKey);
    }
    setHoveredCell(`${rowId}-${field}`);
  }, []);

  // Selection tracking
  const handleCellSelect = useCallback((rowId, field) => {
    const cellKey = `${rowId}-${field}`;
    setSelectedCell(cellKey);
    
    if (engineRef.current) {
      engineRef.current.updateSelection(cellKey);
    }
  }, []);

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Get cell background based on state
  const getCellBackground = useCallback((rowId, field) => {
    const cellKey = `${rowId}-${field}`;
    
    // Being edited by current user
    if (editingCell === cellKey) {
      return `ring-2 ring-${currentUser.color} bg-blue-50`;
    }
    
    // Locked by another user
    if (cellLocks[cellKey] && cellLocks[cellKey] !== currentUser.id) {
      const lockUser = users.find(u => u.id === cellLocks[cellKey]);
      return `bg-red-50 cursor-not-allowed`;
    }
    
    // Selected by current user
    if (selectedCell === cellKey) {
      return 'ring-2 ring-blue-400 bg-blue-50';
    }
    
    // Selected by other users
    for (const [userId, selection] of Object.entries(selections)) {
      if (userId !== currentUser.id && selection === cellKey) {
        const user = users.find(u => u.id === userId);
        if (user) {
          return `ring-1 ring-${user.color} bg-opacity-10`;
        }
      }
    }
    
    // Hovered
    if (hoveredCell === cellKey) {
      return 'bg-slate-50';
    }
    
    return '';
  }, [editingCell, cellLocks, selectedCell, selections, hoveredCell, currentUser, users]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Collaborative Spreadsheet</h1>
            
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {isConnected ? 'Connected' : 'Offline'}
            </div>
            
            {/* Save Status */}
            {unsavedChanges > 0 ? (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{unsavedChanges} unsaved changes</span>
                <button
                  onClick={saveChanges}
                  className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                >
                  Save Now
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">Saved {timeAgo(lastSaved)}</span>
              </div>
            )}
          </div>
          
          {/* Online Users */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600" />
              <span className="text-sm text-slate-600">{onlineUsers.length} online</span>
            </div>
            <div className="flex -space-x-2">
              {onlineUsers.map(user => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-sm font-medium"
                  style={{ borderColor: user.color }}
                  title={user.name}
                >
                  {user.avatar}
                </div>
              ))}
            </div>
            
            {/* Current User Selector */}
            <select
              value={currentUser.id}
              onChange={(e) => setCurrentUser(users.find(u => u.id === e.target.value))}
              className="px-3 py-1 border border-slate-200 rounded text-sm"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600">{row.id}</td>
                      
                      {['product', 'price', 'quantity', 'status', 'owner'].map(field => {
                        const cellKey = `${row.id}-${field}`;
                        const isEditing = editingCell === cellKey;
                        const isLocked = cellLocks[cellKey] && cellLocks[cellKey] !== currentUser.id;
                        const lockUser = isLocked ? users.find(u => u.id === cellLocks[cellKey]) : null;
                        
                        return (
                          <td 
                            key={field}
                            className={`px-4 py-3 text-sm relative ${getCellBackground(row.id, field)}`}
                            onMouseMove={(e) => handleMouseMove(e, row.id, field)}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => !isLocked && handleCellSelect(row.id, field)}
                            onDoubleClick={() => !isLocked && startEditing(row.id, field)}
                          >
                            {isEditing ? (
                              <input
                                type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
                                defaultValue={row[field]}
                                className="w-full px-2 py-1 border border-blue-400 rounded"
                                autoFocus
                                onBlur={(e) => finishEditing(row.id, field, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    finishEditing(row.id, field, e.target.value);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingCell(null);
                                  }
                                }}
                              />
                            ) : (
                              <>
                                {field === 'price' && '$'}
                                {field === 'status' ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    row[field] === 'active' ? 'bg-green-100 text-green-700' :
                                    row[field] === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {row[field]}
                                  </span>
                                ) : row[field]}
                                
                                {isLocked && lockUser && (
                                  <div 
                                    className="absolute top-0 right-0 p-1"
                                    title={`${lockUser.name} is editing`}
                                  >
                                    <div 
                                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                      style={{ backgroundColor: lockUser.color, color: 'white' }}
                                    >
                                      {lockUser.avatar}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Other user cursors */}
                                {Object.entries(cursors).map(([userId, cursorCell]) => {
                                  if (userId === currentUser.id || cursorCell !== cellKey) return null;
                                  const user = users.find(u => u.id === userId);
                                  if (!user) return null;
                                  
                                  return (
                                    <div
                                      key={userId}
                                      className="absolute -top-6 left-0 flex items-center gap-1 px-2 py-1 rounded text-xs text-white pointer-events-none z-10"
                                      style={{ backgroundColor: user.color }}
                                    >
                                      <MousePointer className="w-3 h-3" />
                                      {user.name}
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Collaboration Features */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Real-time Collaboration Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="space-y-2">
                <p>🔄 <strong>Live Updates:</strong> Changes sync instantly across all users</p>
                <p>🔒 <strong>Cell Locking:</strong> Prevents editing conflicts</p>
                <p>👥 <strong>Presence Awareness:</strong> See who's online and where they're working</p>
              </div>
              <div className="space-y-2">
                <p>🖱️ <strong>Cursor Tracking:</strong> See other users' cursors in real-time</p>
                <p>💾 <strong>Auto-save:</strong> Changes saved automatically every 5 seconds</p>
                <p>📝 <strong>Edit History:</strong> Track all changes with user attribution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sticky top-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center justify-between">
              Activity Feed
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showHistory ? 'Hide' : 'Show'} History
              </button>
            </h3>
            
            {showHistory && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {editHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">No activity yet</p>
                ) : (
                  editHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded hover:bg-slate-50">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: entry.user?.color || '#ccc', color: 'white' }}
                      >
                        {entry.user?.avatar || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {entry.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-600">
                          {entry.type === 'cell_update' && (
                            <>
                              Updated <strong>{entry.field}</strong> in row {entry.rowId}
                              {entry.oldValue && entry.newValue && (
                                <>: "{entry.oldValue}" → "{entry.newValue}"</>
                              )}
                            </>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {timeAgo(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Collaboration Stats */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Session Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Edits</span>
                  <span className="font-medium text-slate-900">{editHistory.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Active Users</span>
                  <span className="font-medium text-slate-900">{onlineUsers.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Unsaved Changes</span>
                  <span className="font-medium text-slate-900">{unsavedChanges}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Connection</span>
                  <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeSpreadsheet;