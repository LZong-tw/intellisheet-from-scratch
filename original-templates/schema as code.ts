// Schema-as-Code Implementation
// YAML-based schema definition and runtime parser

import * as yaml from 'js-yaml';

// Schema Definition Types
export interface SchemaDefinition {
  name: string;
  version: string;
  description?: string;
  author?: string;
  tags?: string[];
  
  // Environment variables
  env?: Record<string, {
    type: 'string' | 'number' | 'boolean';
    required?: boolean;
    default?: any;
    description?: string;
  }>;
  
  // Tables definition
  tables: Record<string, TableSchema>;
  
  // Global permissions
  permissions?: GlobalPermissions;
  
  // Workflows
  workflows?: Record<string, WorkflowSchema>;
  
  // Dashboards
  dashboards?: Record<string, DashboardSchema>;
  
  // Integrations
  integrations?: Record<string, IntegrationSchema>;
}

export interface TableSchema {
  description?: string;
  icon?: string;
  color?: string;
  
  columns: ColumnSchema[];
  
  indexes?: IndexSchema[];
  
  permissions?: TablePermissions;
  
  validations?: ValidationSchema[];
  
  automations?: AutomationSchema[];
  
  views?: ViewSchema[];
}

export interface ColumnSchema {
  id: string;
  name?: string;
  type: string;
  description?: string;
  required?: boolean;
  unique?: boolean;
  default?: any;
  
  // Type-specific options
  options?: any;
  
  // Validation
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
    message?: string;
  };
  
  // Formula
  formula?: string;
  
  // Relation
  relation?: {
    table: string;
    column: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    cascade?: boolean;
  };
  
  // Status workflow
  workflow?: {
    states: Record<string, StateConfig>;
    transitions: TransitionConfig[];
  };
}

export interface StateConfig {
  label: string;
  color: string;
  icon?: string;
  permissions?: Record<string, string[]>; // role -> actions
}

export interface TransitionConfig {
  from: string | string[];
  to: string;
  label?: string;
  roles?: string[];
  condition?: string;
  actions?: ActionConfig[];
}

export interface ActionConfig {
  type: string;
  config: Record<string, any>;
}

export interface IndexSchema {
  columns: string[];
  unique?: boolean;
  type?: 'btree' | 'hash' | 'gin' | 'gist';
}

export interface TablePermissions {
  default?: 'allow' | 'deny';
  rules?: PermissionRuleSchema[];
}

export interface PermissionRuleSchema {
  name?: string;
  description?: string;
  subjects?: Record<string, any>;
  resources?: Record<string, any>;
  actions: string[];
  effect: 'allow' | 'deny';
  condition?: string;
  priority?: number;
}

export interface GlobalPermissions {
  roles: Record<string, RoleSchema>;
  defaultRole?: string;
}

export interface RoleSchema {
  name: string;
  description?: string;
  parent?: string; // Inherit from another role
  permissions: Record<string, string[]>; // resource -> actions
}

export interface ValidationSchema {
  name: string;
  description?: string;
  type: 'row' | 'table';
  condition: string;
  message: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface AutomationSchema {
  name: string;
  description?: string;
  trigger: TriggerSchema;
  conditions?: ConditionSchema[];
  actions: ActionSchema[];
  active?: boolean;
}

export interface TriggerSchema {
  type: string;
  config?: Record<string, any>;
}

export interface ConditionSchema {
  type: string;
  config: Record<string, any>;
}

export interface ActionSchema {
  type: string;
  config: Record<string, any>;
}

export interface ViewSchema {
  name: string;
  type: 'grid' | 'kanban' | 'calendar' | 'gallery' | 'gantt';
  config: Record<string, any>;
  filters?: FilterSchema[];
  sorts?: SortSchema[];
  permissions?: PermissionRuleSchema[];
}

export interface FilterSchema {
  column: string;
  operator: string;
  value: any;
}

export interface SortSchema {
  column: string;
  direction: 'asc' | 'desc';
}

export interface WorkflowSchema {
  name: string;
  description?: string;
  steps: WorkflowStepSchema[];
  errorHandling?: 'stop' | 'continue' | 'retry';
}

export interface WorkflowStepSchema {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  next?: string | ConditionalNext[];
  retry?: RetryConfig;
}

export interface ConditionalNext {
  condition: string;
  step: string;
}

export interface RetryConfig {
  maxAttempts: number;
  backoff?: 'linear' | 'exponential';
  delay?: number;
}

export interface DashboardSchema {
  name: string;
  description?: string;
  layout: 'grid' | 'flex';
  widgets: WidgetSchema[];
  refresh?: number; // seconds
  permissions?: PermissionRuleSchema[];
}

export interface WidgetSchema {
  id: string;
  type: 'chart' | 'stat' | 'table' | 'text' | 'custom';
  title?: string;
  config: Record<string, any>;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface IntegrationSchema {
  type: 'webhook' | 'api' | 'database' | 'storage';
  config: Record<string, any>;
  auth?: AuthSchema;
}

export interface AuthSchema {
  type: 'none' | 'api_key' | 'bearer' | 'oauth2' | 'basic';
  config?: Record<string, any>;
}

// Schema Parser and Validator
export class SchemaParser {
  private schema: SchemaDefinition | null = null;
  private variables: Map<string, any> = new Map();
  
  async loadFromYaml(yamlContent: string): Promise<SchemaDefinition> {
    try {
      const rawSchema = yaml.load(yamlContent) as any;
      this.schema = this.processSchema(rawSchema);
      this.validateSchema(this.schema);
      return this.schema;
    } catch (error) {
      throw new Error(`Failed to parse schema: ${error.message}`);
    }
  }
  
  async loadFromFile(filePath: string): Promise<SchemaDefinition> {
    // In a real implementation, this would read from file system
    const content = await this.readFile(filePath);
    return this.loadFromYaml(content);
  }
  
  private async readFile(filePath: string): Promise<string> {
    // Mock implementation
    return '';
  }
  
  private processSchema(raw: any): SchemaDefinition {
    // Process environment variables
    if (raw.env) {
      this.processEnvironmentVariables(raw.env);
    }
    
    // Replace variables in the schema
    const processed = this.replaceVariables(raw);
    
    // Expand shortcuts and syntactic sugar
    return this.expandSchema(processed);
  }
  
  private processEnvironmentVariables(envDef: Record<string, any>) {
    for (const [key, config] of Object.entries(envDef)) {
      const value = process.env[key] || config.default;
      if (config.required && !value) {
        throw new Error(`Required environment variable ${key} is not set`);
      }
      this.variables.set(key, value);
    }
  }
  
  private replaceVariables(obj: any): any {
    if (typeof obj === 'string') {
      // Replace ${VAR_NAME} with actual values
      return obj.replace(/\$\{(\w+)\}/g, (match, varName) => {
        if (this.variables.has(varName)) {
          return this.variables.get(varName);
        }
        return match;
      });
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceVariables(item));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceVariables(value);
      }
      return result;
    }
    
    return obj;
  }
  
  private expandSchema(schema: any): SchemaDefinition {
    // Expand column type shortcuts
    if (schema.tables) {
      for (const table of Object.values(schema.tables) as any[]) {
        if (table.columns) {
          table.columns = table.columns.map((col: any) => 
            this.expandColumnDefinition(col)
          );
        }
      }
    }
    
    // Expand permission shortcuts
    if (schema.permissions?.roles) {
      schema.permissions.roles = this.expandRoles(schema.permissions.roles);
    }
    
    return schema as SchemaDefinition;
  }
  
  private expandColumnDefinition(col: any): ColumnSchema {
    // Handle shorthand notations
    if (typeof col === 'string') {
      const [name, type] = col.split(':');
      return {
        id: name.trim(),
        name: name.trim(),
        type: type?.trim() || 'text'
      };
    }
    
    // Expand type-specific defaults
    switch (col.type) {
      case 'id':
        return {
          ...col,
          type: 'text',
          unique: true,
          required: true,
          default: 'uuid()'
        };
        
      case 'timestamps':
        return [
          {
            id: 'created_at',
            type: 'datetime',
            default: 'now()'
          },
          {
            id: 'updated_at',
            type: 'datetime',
            default: 'now()',
            formula: 'now()'
          }
        ];
        
      case 'user_tracking':
        return [
          {
            id: 'created_by',
            type: 'user',
            default: 'current_user()'
          },
          {
            id: 'updated_by',
            type: 'user',
            formula: 'current_user()'
          }
        ];
        
      default:
        return col;
    }
  }
  
  private expandRoles(roles: Record<string, any>): Record<string, RoleSchema> {
    const expanded: Record<string, RoleSchema> = {};
    
    for (const [roleId, roleDef] of Object.entries(roles)) {
      if (typeof roleDef === 'string') {
        // Simple inheritance: "editor: admin"
        expanded[roleId] = {
          name: roleId,
          parent: roleDef,
          permissions: {}
        };
      } else {
        expanded[roleId] = roleDef as RoleSchema;
      }
    }
    
    // Resolve inheritance
    for (const role of Object.values(expanded)) {
      if (role.parent) {
        const parent = expanded[role.parent];
        if (parent) {
          role.permissions = {
            ...parent.permissions,
            ...role.permissions
          };
        }
      }
    }
    
    return expanded;
  }
  
  private validateSchema(schema: SchemaDefinition) {
    // Validate required fields
    if (!schema.name) {
      throw new Error('Schema name is required');
    }
    
    if (!schema.version) {
      throw new Error('Schema version is required');
    }
    
    if (!schema.tables || Object.keys(schema.tables).length === 0) {
      throw new Error('At least one table must be defined');
    }
    
    // Validate table definitions
    for (const [tableName, table] of Object.entries(schema.tables)) {
      this.validateTable(tableName, table);
    }
    
    // Validate cross-references
    this.validateReferences(schema);
  }
  
  private validateTable(name: string, table: TableSchema) {
    if (!table.columns || table.columns.length === 0) {
      throw new Error(`Table ${name} must have at least one column`);
    }
    
    const columnIds = new Set<string>();
    
    for (const column of table.columns) {
      if (!column.id) {
        throw new Error(`Column in table ${name} must have an id`);
      }
      
      if (columnIds.has(column.id)) {
        throw new Error(`Duplicate column id ${column.id} in table ${name}`);
      }
      
      columnIds.add(column.id);
      
      // Validate column type
      this.validateColumnType(column);
    }
  }
  
  private validateColumnType(column: ColumnSchema) {
    const validTypes = [
      'text', 'number', 'select', 'multi_select', 'date', 'datetime',
      'checkbox', 'relation', 'formula', 'attachment', 'user', 'status'
    ];
    
    if (!validTypes.includes(column.type)) {
      throw new Error(`Invalid column type: ${column.type}`);
    }
    
    // Type-specific validation
    switch (column.type) {
      case 'select':
      case 'multi_select':
        if (!column.options || !Array.isArray(column.options)) {
          throw new Error(`Column ${column.id} of type ${column.type} must have options`);
        }
        break;
        
      case 'relation':
        if (!column.relation?.table || !column.relation?.column) {
          throw new Error(`Column ${column.id} of type relation must specify table and column`);
        }
        break;
        
      case 'formula':
        if (!column.formula) {
          throw new Error(`Column ${column.id} of type formula must have a formula expression`);
        }
        break;
    }
  }
  
  private validateReferences(schema: SchemaDefinition) {
    // Validate relation references
    for (const table of Object.values(schema.tables)) {
      for (const column of table.columns) {
        if (column.type === 'relation' && column.relation) {
          const targetTable = schema.tables[column.relation.table];
          if (!targetTable) {
            throw new Error(`Relation references non-existent table: ${column.relation.table}`);
          }
          
          const targetColumn = targetTable.columns.find(
            c => c.id === column.relation!.column
          );
          if (!targetColumn) {
            throw new Error(`Relation references non-existent column: ${column.relation.column}`);
          }
        }
      }
    }
  }
}

// Schema Runtime Engine
export class SchemaRuntime {
  private schema: SchemaDefinition;
  private tables: Map<string, RuntimeTable> = new Map();
  
  constructor(schema: SchemaDefinition) {
    this.schema = schema;
    this.initialize();
  }
  
  private initialize() {
    // Create runtime tables
    for (const [tableName, tableSchema] of Object.entries(this.schema.tables)) {
      this.tables.set(tableName, new RuntimeTable(tableName, tableSchema));
    }
    
    // Setup relations
    this.setupRelations();
    
    // Setup automations
    this.setupAutomations();
  }
  
  private setupRelations() {
    // Configure bidirectional relations
    for (const [tableName, table] of this.tables) {
      const tableSchema = this.schema.tables[tableName];
      
      for (const column of tableSchema.columns) {
        if (column.type === 'relation' && column.relation) {
          const targetTable = this.tables.get(column.relation.table);
          if (targetTable) {
            // Setup relation handlers
            table.addRelation(column.id, targetTable, column.relation);
          }
        }
      }
    }
  }
  
  private setupAutomations() {
    // Register automation triggers
    for (const [tableName, tableSchema] of Object.entries(this.schema.tables)) {
      if (tableSchema.automations) {
        const table = this.tables.get(tableName);
        if (table) {
          for (const automation of tableSchema.automations) {
            table.addAutomation(automation);
          }
        }
      }
    }
  }
  
  getTable(name: string): RuntimeTable | undefined {
    return this.tables.get(name);
  }
  
  async executeWorkflow(name: string, context: Record<string, any>): Promise<any> {
    const workflow = this.schema.workflows?.[name];
    if (!workflow) {
      throw new Error(`Workflow ${name} not found`);
    }
    
    const executor = new WorkflowExecutor(workflow);
    return executor.execute(context);
  }
}

// Runtime Table Implementation
export class RuntimeTable {
  private name: string;
  private schema: TableSchema;
  private data: Map<string, any> = new Map();
  private relations: Map<string, RelationHandler> = new Map();
  private automations: AutomationHandler[] = [];
  
  constructor(name: string, schema: TableSchema) {
    this.name = name;
    this.schema = schema;
  }
  
  addRelation(columnId: string, targetTable: RuntimeTable, config: any) {
    this.relations.set(columnId, new RelationHandler(targetTable, config));
  }
  
  addAutomation(automation: AutomationSchema) {
    this.automations.push(new AutomationHandler(automation));
  }
  
  async insert(data: Record<string, any>): Promise<string> {
    // Generate ID
    const id = this.generateId();
    
    // Validate data
    await this.validate(data);
    
    // Apply defaults
    const record = this.applyDefaults(data);
    
    // Store
    this.data.set(id, { id, ...record });
    
    // Trigger automations
    await this.triggerAutomations('row_created', { id, ...record });
    
    return id;
  }
  
  async update(id: string, updates: Record<string, any>): Promise<void> {
    const existing = this.data.get(id);
    if (!existing) {
      throw new Error(`Record ${id} not found`);
    }
    
    // Validate updates
    await this.validate(updates, existing);
    
    // Apply updates
    const updated = { ...existing, ...updates };
    this.data.set(id, updated);
    
    // Trigger automations
    await this.triggerAutomations('row_updated', updated, existing);
  }
  
  async delete(id: string): Promise<void> {
    const record = this.data.get(id);
    if (!record) {
      throw new Error(`Record ${id} not found`);
    }
    
    // Check cascade deletes
    await this.handleCascadeDeletes(id);
    
    // Delete record
    this.data.delete(id);
    
    // Trigger automations
    await this.triggerAutomations('row_deleted', record);
  }
  
  private generateId(): string {
    return `${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async validate(data: Record<string, any>, existing?: Record<string, any>): Promise<void> {
    // Column validations
    for (const column of this.schema.columns) {
      const value = data[column.id];
      
      // Required check
      if (column.required && !existing && value == null) {
        throw new Error(`Column ${column.id} is required`);
      }
      
      // Type validation
      if (value != null) {
        this.validateColumnValue(column, value);
      }
      
      // Custom validation
      if (column.validation?.custom) {
        const isValid = await this.evaluateExpression(
          column.validation.custom,
          { value, row: { ...existing, ...data } }
        );
        
        if (!isValid) {
          throw new Error(
            column.validation.message || 
            `Validation failed for column ${column.id}`
          );
        }
      }
    }
    
    // Row validations
    if (this.schema.validations) {
      for (const validation of this.schema.validations) {
        if (validation.type === 'row') {
          const isValid = await this.evaluateExpression(
            validation.condition,
            { row: { ...existing, ...data } }
          );
          
          if (!isValid) {
            throw new Error(validation.message);
          }
        }
      }
    }
  }
  
  private validateColumnValue(column: ColumnSchema, value: any): void {
    switch (column.type) {
      case 'number':
        if (typeof value !== 'number') {
          throw new Error(`Column ${column.id} must be a number`);
        }
        if (column.validation?.min != null && value < column.validation.min) {
          throw new Error(`Column ${column.id} must be >= ${column.validation.min}`);
        }
        if (column.validation?.max != null && value > column.validation.max) {
          throw new Error(`Column ${column.id} must be <= ${column.validation.max}`);
        }
        break;
        
      case 'text':
        if (typeof value !== 'string') {
          throw new Error(`Column ${column.id} must be a string`);
        }
        if (column.validation?.pattern) {
          const regex = new RegExp(column.validation.pattern);
          if (!regex.test(value)) {
            throw new Error(
              column.validation.message || 
              `Column ${column.id} does not match pattern`
            );
          }
        }
        break;
        
      case 'select':
        if (!column.options?.includes(value)) {
          throw new Error(`Invalid option for column ${column.id}`);
        }
        break;
        
      case 'multi_select':
        if (!Array.isArray(value)) {
          throw new Error(`Column ${column.id} must be an array`);
        }
        for (const item of value) {
          if (!column.options?.includes(item)) {
            throw new Error(`Invalid option ${item} for column ${column.id}`);
          }
        }
        break;
    }
  }
  
  private applyDefaults(data: Record<string, any>): Record<string, any> {
    const result = { ...data };
    
    for (const column of this.schema.columns) {
      if (result[column.id] == null && column.default != null) {
        result[column.id] = this.evaluateDefault(column.default);
      }
    }
    
    return result;
  }
  
  private evaluateDefault(defaultValue: any): any {
    if (typeof defaultValue === 'string') {
      // Handle function calls
      if (defaultValue === 'uuid()') {
        return this.generateUuid();
      }
      if (defaultValue === 'now()') {
        return new Date();
      }
      if (defaultValue === 'current_user()') {
        return this.getCurrentUser();
      }
    }
    return defaultValue;
  }
  
  private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  private getCurrentUser(): string {
    // In real implementation, this would get from context
    return 'current_user';
  }
  
  private async handleCascadeDeletes(id: string): Promise<void> {
    // Handle cascade deletes for relations
    for (const [columnId, handler] of this.relations) {
      const column = this.schema.columns.find(c => c.id === columnId);
      if (column?.relation?.cascade) {
        await handler.handleCascadeDelete(id);
      }
    }
  }
  
  private async triggerAutomations(
    event: string, 
    data: any, 
    previousData?: any
  ): Promise<void> {
    for (const automation of this.automations) {
      await automation.trigger(event, data, previousData);
    }
  }
  
  private async evaluateExpression(
    expression: string, 
    context: Record<string, any>
  ): Promise<any> {
    try {
      const fn = new Function('context', `with(context) { return ${expression} }`);
      return fn(context);
    } catch (e) {
      console.error('Expression evaluation error:', e);
      return false;
    }
  }
}

// Helper Classes
class RelationHandler {
  constructor(
    private targetTable: RuntimeTable,
    private config: any
  ) {}
  
  async handleCascadeDelete(id: string): Promise<void> {
    // Implementation would handle cascade deletes
  }
}

class AutomationHandler {
  constructor(private automation: AutomationSchema) {}
  
  async trigger(event: string, data: any, previousData?: any): Promise<void> {
    // Implementation would handle automation triggers
  }
}

class WorkflowExecutor {
  constructor(private workflow: WorkflowSchema) {}
  
  async execute(context: Record<string, any>): Promise<any> {
    // Implementation would execute workflow steps
  }
}