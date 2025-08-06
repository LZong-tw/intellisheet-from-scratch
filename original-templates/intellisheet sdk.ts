// IntelliSheet SDK - JavaScript/TypeScript Client Library
// npm install @intellisheet/sdk

import EventEmitter from 'events';

// Types
export interface IntelliSheetConfig {
  apiKey?: string;
  apiUrl?: string;
  workspace?: string;
  environment?: 'development' | 'staging' | 'production';
  timeout?: number;
  retries?: number;
  debug?: boolean;
}

export interface QueryOptions {
  filter?: Record<string, any>;
  sort?: string | string[] | SortConfig[];
  limit?: number;
  offset?: number;
  page?: number;
  include?: string[];
  fields?: string[];
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BatchOperation {
  operation: 'create' | 'update' | 'delete';
  table: string;
  data?: any;
  id?: string;
}

export interface TransactionResult {
  success: boolean;
  operations: number;
  results: any[];
  errors?: any[];
}

// Main SDK Class
export class IntelliSheet extends EventEmitter {
  private config: IntelliSheetConfig;
  private apiClient: APIClient;
  private cache: CacheManager;
  private websocket?: WebSocketClient;
  
  constructor(config: IntelliSheetConfig) {
    super();
    
    this.config = {
      apiUrl: config.apiUrl || 'https://api.intellisheet.com',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      debug: config.debug || false,
      ...config
    };
    
    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }
    
    this.apiClient = new APIClient(this.config);
    this.cache = new CacheManager();
  }
  
  // Table operations
  table(name: string): Table {
    return new Table(name, this.apiClient, this.cache);
  }
  
  // Schema operations
  schema(): SchemaManager {
    return new SchemaManager(this.apiClient);
  }
  
  // Permission operations
  permissions(): PermissionManager {
    return new PermissionManager(this.apiClient);
  }
  
  // Workflow operations
  workflows(): WorkflowManager {
    return new WorkflowManager(this.apiClient);
  }
  
  // Real-time operations
  realtime(): RealtimeManager {
    if (!this.websocket) {
      this.websocket = new WebSocketClient(this.config);
      this.websocket.on('connect', () => this.emit('realtime:connect'));
      this.websocket.on('disconnect', () => this.emit('realtime:disconnect'));
      this.websocket.on('error', (error) => this.emit('realtime:error', error));
    }
    return new RealtimeManager(this.websocket);
  }
  
  // Batch operations
  async batch(operations: BatchOperation[]): Promise<TransactionResult> {
    return this.apiClient.post('/batch', { operations });
  }
  
  // Transaction support
  async transaction(callback: (tx: Transaction) => Promise<void>): Promise<TransactionResult> {
    const tx = new Transaction(this.apiClient);
    
    try {
      await tx.begin();
      await callback(tx);
      return await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
  
  // Import/Export
  async import(format: 'csv' | 'excel' | 'json', data: any, options?: any): Promise<any> {
    const formData = new FormData();
    formData.append('format', format);
    formData.append('data', data);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    
    return this.apiClient.post('/import', formData);
  }
  
  async export(table: string, format: 'csv' | 'excel' | 'json' | 'pdf', options?: QueryOptions): Promise<Blob> {
    return this.apiClient.get(`/export/${table}`, {
      params: { format, ...options },
      responseType: 'blob'
    });
  }
  
  // Analytics
  analytics(): AnalyticsManager {
    return new AnalyticsManager(this.apiClient);
  }
  
  // AI Features
  ai(): AIManager {
    return new AIManager(this.apiClient);
  }
}

// Table Class
export class Table {
  constructor(
    private name: string,
    private apiClient: APIClient,
    private cache: CacheManager
  ) {}
  
  // CRUD Operations
  async find(options?: QueryOptions): Promise<PaginationResult<any>> {
    const cacheKey = this.getCacheKey('find', options);
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const result = await this.apiClient.get(`/tables/${this.name}`, { params: options });
    this.cache.set(cacheKey, result);
    
    return result;
  }
  
  async findOne(filter: Record<string, any>): Promise<any | null> {
    const result = await this.find({ filter, limit: 1 });
    return result.data[0] || null;
  }
  
  async findById(id: string, options?: { include?: string[] }): Promise<any> {
    const cacheKey = this.getCacheKey('findById', { id, ...options });
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const result = await this.apiClient.get(`/tables/${this.name}/${id}`, { params: options });
    this.cache.set(cacheKey, result);
    
    return result;
  }
  
  async create(data: any): Promise<any> {
    const result = await this.apiClient.post(`/tables/${this.name}`, data);
    this.cache.invalidate(this.name);
    return result;
  }
  
  async createMany(data: any[]): Promise<any[]> {
    const result = await this.apiClient.post(`/tables/${this.name}/bulk`, { data });
    this.cache.invalidate(this.name);
    return result;
  }
  
  async update(id: string, data: any): Promise<any> {
    const result = await this.apiClient.put(`/tables/${this.name}/${id}`, data);
    this.cache.invalidate(this.name);
    this.cache.delete(this.getCacheKey('findById', { id }));
    return result;
  }
  
  async updateMany(filter: Record<string, any>, data: any): Promise<number> {
    const result = await this.apiClient.put(`/tables/${this.name}`, { filter, data });
    this.cache.invalidate(this.name);
    return result.affected;
  }
  
  async delete(id: string): Promise<boolean> {
    await this.apiClient.delete(`/tables/${this.name}/${id}`);
    this.cache.invalidate(this.name);
    this.cache.delete(this.getCacheKey('findById', { id }));
    return true;
  }
  
  async deleteMany(filter: Record<string, any>): Promise<number> {
    const result = await this.apiClient.delete(`/tables/${this.name}`, { params: { filter } });
    this.cache.invalidate(this.name);
    return result.affected;
  }
  
  // Aggregation
  async count(filter?: Record<string, any>): Promise<number> {
    const result = await this.apiClient.get(`/tables/${this.name}/count`, { params: { filter } });
    return result.count;
  }
  
  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.apiClient.post(`/tables/${this.name}/aggregate`, { pipeline });
  }
  
  async groupBy(field: string, aggregations?: any): Promise<any[]> {
    return this.apiClient.get(`/tables/${this.name}/group`, {
      params: { field, aggregations }
    });
  }
  
  // Relations
  async loadRelations(id: string, relations: string[]): Promise<any> {
    return this.apiClient.get(`/tables/${this.name}/${id}/relations`, {
      params: { relations }
    });
  }
  
  async addRelation(id: string, relation: string, targetId: string): Promise<void> {
    await this.apiClient.post(`/tables/${this.name}/${id}/relations/${relation}`, {
      targetId
    });
    this.cache.invalidate(this.name);
  }
  
  async removeRelation(id: string, relation: string, targetId: string): Promise<void> {
    await this.apiClient.delete(`/tables/${this.name}/${id}/relations/${relation}/${targetId}`);
    this.cache.invalidate(this.name);
  }
  
  // Permissions
  async getPermissions(id?: string): Promise<any> {
    const url = id 
      ? `/tables/${this.name}/${id}/permissions`
      : `/tables/${this.name}/permissions`;
    return this.apiClient.get(url);
  }
  
  async checkPermission(action: string, id?: string): Promise<boolean> {
    const result = await this.apiClient.post(`/tables/${this.name}/permissions/check`, {
      action,
      id
    });
    return result.allowed;
  }
  
  // Versioning
  async getVersions(id: string): Promise<any[]> {
    return this.apiClient.get(`/tables/${this.name}/${id}/versions`);
  }
  
  async getVersion(id: string, version: number): Promise<any> {
    return this.apiClient.get(`/tables/${this.name}/${id}/versions/${version}`);
  }
  
  async restoreVersion(id: string, version: number): Promise<any> {
    const result = await this.apiClient.post(`/tables/${this.name}/${id}/versions/${version}/restore`);
    this.cache.invalidate(this.name);
    return result;
  }
  
  // Utilities
  private getCacheKey(operation: string, params?: any): string {
    return `${this.name}:${operation}:${JSON.stringify(params || {})}`;
  }
  
  // Query builder
  query(): QueryBuilder {
    return new QueryBuilder(this.name, this.apiClient);
  }
}

// Query Builder
export class QueryBuilder {
  private filters: Record<string, any> = {};
  private sorts: SortConfig[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private includes: string[] = [];
  private fields: string[] = [];
  
  constructor(
    private table: string,
    private apiClient: APIClient
  ) {}
  
  where(field: string, operator: string, value?: any): this {
    if (value === undefined) {
      this.filters[field] = operator;
    } else {
      this.filters[field] = { [operator]: value };
    }
    return this;
  }
  
  whereIn(field: string, values: any[]): this {
    this.filters[field] = { $in: values };
    return this;
  }
  
  whereNotIn(field: string, values: any[]): this {
    this.filters[field] = { $nin: values };
    return this;
  }
  
  whereBetween(field: string, min: any, max: any): this {
    this.filters[field] = { $gte: min, $lte: max };
    return this;
  }
  
  whereNull(field: string): this {
    this.filters[field] = null;
    return this;
  }
  
  whereNotNull(field: string): this {
    this.filters[field] = { $ne: null };
    return this;
  }
  
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.sorts.push({ field, direction });
    return this;
  }
  
  limit(value: number): this {
    this.limitValue = value;
    return this;
  }
  
  offset(value: number): this {
    this.offsetValue = value;
    return this;
  }
  
  include(...relations: string[]): this {
    this.includes.push(...relations);
    return this;
  }
  
  select(...fields: string[]): this {
    this.fields.push(...fields);
    return this;
  }
  
  async get(): Promise<any[]> {
    const result = await this.execute();
    return result.data;
  }
  
  async first(): Promise<any | null> {
    this.limit(1);
    const result = await this.get();
    return result[0] || null;
  }
  
  async paginate(page: number = 1, perPage: number = 20): Promise<PaginationResult<any>> {
    this.limit(perPage);
    this.offset((page - 1) * perPage);
    return this.execute();
  }
  
  async count(): Promise<number> {
    const result = await this.apiClient.get(`/tables/${this.table}/count`, {
      params: { filter: this.filters }
    });
    return result.count;
  }
  
  async exists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
  
  private async execute(): Promise<PaginationResult<any>> {
    return this.apiClient.get(`/tables/${this.table}`, {
      params: {
        filter: this.filters,
        sort: this.sorts,
        limit: this.limitValue,
        offset: this.offsetValue,
        include: this.includes,
        fields: this.fields
      }
    });
  }
}

// Schema Manager
export class SchemaManager {
  constructor(private apiClient: APIClient) {}
  
  async list(): Promise<any[]> {
    return this.apiClient.get('/schemas');
  }
  
  async get(name: string): Promise<any> {
    return this.apiClient.get(`/schemas/${name}`);
  }
  
  async create(schema: any): Promise<any> {
    return this.apiClient.post('/schemas', schema);
  }
  
  async update(name: string, schema: any): Promise<any> {
    return this.apiClient.put(`/schemas/${name}`, schema);
  }
  
  async delete(name: string): Promise<void> {
    await this.apiClient.delete(`/schemas/${name}`);
  }
  
  async validate(schema: any): Promise<{ valid: boolean; errors?: any[] }> {
    return this.apiClient.post('/schemas/validate', schema);
  }
  
  async migrate(from: string, to: string): Promise<any> {
    return this.apiClient.post('/schemas/migrate', { from, to });
  }
}

// Permission Manager
export class PermissionManager {
  constructor(private apiClient: APIClient) {}
  
  async getRoles(): Promise<any[]> {
    return this.apiClient.get('/permissions/roles');
  }
  
  async getRole(id: string): Promise<any> {
    return this.apiClient.get(`/permissions/roles/${id}`);
  }
  
  async createRole(role: any): Promise<any> {
    return this.apiClient.post('/permissions/roles', role);
  }
  
  async updateRole(id: string, role: any): Promise<any> {
    return this.apiClient.put(`/permissions/roles/${id}`, role);
  }
  
  async deleteRole(id: string): Promise<void> {
    await this.apiClient.delete(`/permissions/roles/${id}`);
  }
  
  async getRules(): Promise<any[]> {
    return this.apiClient.get('/permissions/rules');
  }
  
  async createRule(rule: any): Promise<any> {
    return this.apiClient.post('/permissions/rules', rule);
  }
  
  async updateRule(id: string, rule: any): Promise<any> {
    return this.apiClient.put(`/permissions/rules/${id}`, rule);
  }
  
  async deleteRule(id: string): Promise<void> {
    await this.apiClient.delete(`/permissions/rules/${id}`);
  }
  
  async check(resource: string, action: string, context?: any): Promise<boolean> {
    const result = await this.apiClient.post('/permissions/check', {
      resource,
      action,
      context
    });
    return result.allowed;
  }
  
  async evaluate(rules: any[], context: any): Promise<any> {
    return this.apiClient.post('/permissions/evaluate', { rules, context });
  }
}

// Workflow Manager
export class WorkflowManager {
  constructor(private apiClient: APIClient) {}
  
  async list(): Promise<any[]> {
    return this.apiClient.get('/workflows');
  }
  
  async get(id: string): Promise<any> {
    return this.apiClient.get(`/workflows/${id}`);
  }
  
  async create(workflow: any): Promise<any> {
    return this.apiClient.post('/workflows', workflow);
  }
  
  async update(id: string, workflow: any): Promise<any> {
    return this.apiClient.put(`/workflows/${id}`, workflow);
  }
  
  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`/workflows/${id}`);
  }
  
  async execute(id: string, context: any): Promise<any> {
    return this.apiClient.post(`/workflows/${id}/execute`, context);
  }
  
  async getExecutions(id: string): Promise<any[]> {
    return this.apiClient.get(`/workflows/${id}/executions`);
  }
  
  async getExecution(workflowId: string, executionId: string): Promise<any> {
    return this.apiClient.get(`/workflows/${workflowId}/executions/${executionId}`);
  }
}

// Realtime Manager
export class RealtimeManager {
  constructor(private websocket: WebSocketClient) {}
  
  subscribe(channel: string, callback: (data: any) => void): () => void {
    this.websocket.subscribe(channel, callback);
    
    // Return unsubscribe function
    return () => {
      this.websocket.unsubscribe(channel, callback);
    };
  }
  
  publish(channel: string, data: any): void {
    this.websocket.publish(channel, data);
  }
  
  presence(channel: string): PresenceChannel {
    return new PresenceChannel(channel, this.websocket);
  }
}

// Presence Channel
export class PresenceChannel {
  private members: Map<string, any> = new Map();
  
  constructor(
    private channel: string,
    private websocket: WebSocketClient
  ) {
    this.websocket.subscribe(`presence:${channel}`, this.handlePresenceUpdate.bind(this));
  }
  
  private handlePresenceUpdate(data: any): void {
    switch (data.action) {
      case 'join':
        this.members.set(data.userId, data.user);
        break;
      case 'leave':
        this.members.delete(data.userId);
        break;
      case 'update':
        this.members.set(data.userId, data.user);
        break;
    }
  }
  
  getMembers(): any[] {
    return Array.from(this.members.values());
  }
  
  getMember(userId: string): any | undefined {
    return this.members.get(userId);
  }
  
  updatePresence(data: any): void {
    this.websocket.publish(`presence:${this.channel}`, {
      action: 'update',
      user: data
    });
  }
}

// Analytics Manager
export class AnalyticsManager {
  constructor(private apiClient: APIClient) {}
  
  async query(query: any): Promise<any> {
    return this.apiClient.post('/analytics/query', query);
  }
  
  async getMetrics(table: string, metrics: string[], options?: any): Promise<any> {
    return this.apiClient.get(`/analytics/metrics/${table}`, {
      params: { metrics, ...options }
    });
  }
  
  async getInsights(table: string, options?: any): Promise<any> {
    return this.apiClient.get(`/analytics/insights/${table}`, { params: options });
  }
  
  async createReport(report: any): Promise<any> {
    return this.apiClient.post('/analytics/reports', report);
  }
  
  async getReport(id: string): Promise<any> {
    return this.apiClient.get(`/analytics/reports/${id}`);
  }
  
  async runReport(id: string, params?: any): Promise<any> {
    return this.apiClient.post(`/analytics/reports/${id}/run`, params);
  }
}

// AI Manager
export class AIManager {
  constructor(private apiClient: APIClient) {}
  
  async generateSchema(description: string): Promise<any> {
    return this.apiClient.post('/ai/generate-schema', { description });
  }
  
  async suggestColumns(table: string, data: any[]): Promise<any> {
    return this.apiClient.post('/ai/suggest-columns', { table, data });
  }
  
  async generateFormula(description: string, context: any): Promise<string> {
    const result = await this.apiClient.post('/ai/generate-formula', {
      description,
      context
    });
    return result.formula;
  }
  
  async detectAnomalies(table: string, options?: any): Promise<any[]> {
    return this.apiClient.post(`/ai/detect-anomalies/${table}`, options);
  }
  
  async predictValues(table: string, field: string, context: any): Promise<any> {
    return this.apiClient.post('/ai/predict', { table, field, context });
  }
  
  async classifyData(data: any[], categories: string[]): Promise<any[]> {
    return this.apiClient.post('/ai/classify', { data, categories });
  }
  
  async extractEntities(text: string): Promise<any> {
    return this.apiClient.post('/ai/extract-entities', { text });
  }
  
  async generateInsights(table: string, options?: any): Promise<any> {
    return this.apiClient.post(`/ai/insights/${table}`, options);
  }
}

// Transaction Class
export class Transaction {
  private operations: any[] = [];
  private transactionId?: string;
  
  constructor(private apiClient: APIClient) {}
  
  async begin(): Promise<void> {
    const result = await this.apiClient.post('/transactions/begin');
    this.transactionId = result.transactionId;
  }
  
  async commit(): Promise<TransactionResult> {
    if (!this.transactionId) {
      throw new Error('Transaction not started');
    }
    
    return this.apiClient.post(`/transactions/${this.transactionId}/commit`, {
      operations: this.operations
    });
  }
  
  async rollback(): Promise<void> {
    if (!this.transactionId) {
      return;
    }
    
    await this.apiClient.post(`/transactions/${this.transactionId}/rollback`);
  }
  
  table(name: string): TransactionTable {
    return new TransactionTable(name, this);
  }
  
  addOperation(operation: any): void {
    this.operations.push(operation);
  }
}

// Transaction Table
export class TransactionTable {
  constructor(
    private name: string,
    private transaction: Transaction
  ) {}
  
  create(data: any): this {
    this.transaction.addOperation({
      operation: 'create',
      table: this.name,
      data
    });
    return this;
  }
  
  update(id: string, data: any): this {
    this.transaction.addOperation({
      operation: 'update',
      table: this.name,
      id,
      data
    });
    return this;
  }
  
  delete(id: string): this {
    this.transaction.addOperation({
      operation: 'delete',
      table: this.name,
      id
    });
    return this;
  }
}

// API Client
class APIClient {
  constructor(private config: IntelliSheetConfig) {}
  
  async get(path: string, options?: any): Promise<any> {
    return this.request('GET', path, options);
  }
  
  async post(path: string, data?: any, options?: any): Promise<any> {
    return this.request('POST', path, { ...options, body: data });
  }
  
  async put(path: string, data?: any, options?: any): Promise<any> {
    return this.request('PUT', path, { ...options, body: data });
  }
  
  async delete(path: string, options?: any): Promise<any> {
    return this.request('DELETE', path, options);
  }
  
  private async request(method: string, path: string, options?: any): Promise<any> {
    const url = `${this.config.apiUrl}${path}`;
    
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...options?.headers
    };
    
    const fetchOptions: any = {
      method,
      headers,
      ...options
    };
    
    if (options?.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }
    
    if (options?.params) {
      const params = new URLSearchParams(options.params);
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    if (options?.responseType === 'blob') {
      return response.blob();
    }
    
    return response.json();
  }
}

// WebSocket Client
class WebSocketClient extends EventEmitter {
  private ws?: WebSocket;
  private subscriptions: Map<string, Set<Function>> = new Map();
  
  constructor(private config: IntelliSheetConfig) {
    super();
    this.connect();
  }
  
  private connect(): void {
    const wsUrl = this.config.apiUrl?.replace('http', 'ws') + '/ws';
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.emit('connect');
      this.authenticate();
    };
    
    this.ws.onclose = () => {
      this.emit('disconnect');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      this.emit('error', error);
    };
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
  }
  
  private authenticate(): void {
    this.send('auth', { apiKey: this.config.apiKey });
  }
  
  private reconnect(): void {
    setTimeout(() => this.connect(), 5000);
  }
  
  private handleMessage(message: any): void {
    const { channel, data } = message;
    const callbacks = this.subscriptions.get(channel);
    
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
  
  subscribe(channel: string, callback: Function): void {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
      this.send('subscribe', { channel });
    }
    
    this.subscriptions.get(channel)!.add(callback);
  }
  
  unsubscribe(channel: string, callback: Function): void {
    const callbacks = this.subscriptions.get(channel);
    
    if (callbacks) {
      callbacks.delete(callback);
      
      if (callbacks.size === 0) {
        this.subscriptions.delete(channel);
        this.send('unsubscribe', { channel });
      }
    }
  }
  
  publish(channel: string, data: any): void {
    this.send('publish', { channel, data });
  }
  
  private send(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }
}

// Cache Manager
class CacheManager {
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private ttl: number = 60000; // 1 minute default TTL
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttl || this.ttl)
    });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  invalidate(prefix: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Export default
export default IntelliSheet;