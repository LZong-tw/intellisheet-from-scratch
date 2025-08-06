// IntelliSheet Core Type System
// 完整的類型定義系統，支援動態權限和公式計算

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'multi_select'
  | 'date' 
  | 'datetime'
  | 'checkbox'
  | 'relation' 
  | 'formula'
  | 'attachment'
  | 'user'
  | 'status';

export interface ValidationRule {
  type: 'required' | 'unique' | 'regex' | 'range' | 'custom';
  value?: any;
  message?: string;
  condition?: string; // JavaScript expression
}

export interface ColumnPermission {
  read: PermissionRule[];
  write: PermissionRule[];
  formula?: string; // For computed columns
}

export interface PermissionRule {
  subject: Record<string, any>; // User attributes
  resource?: Record<string, any>; // Row attributes
  condition?: string; // JavaScript expression
  effect: 'allow' | 'deny';
  priority: number;
}

export interface Column {
  id: string;
  name: string;
  type: FieldType;
  description?: string;
  required?: boolean;
  unique?: boolean;
  indexed?: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  permissions?: ColumnPermission;
  
  // For select/multi_select
  options?: SelectOption[];
  
  // For relation
  relatedTable?: string;
  relatedColumn?: string;
  relationType?: 'one-to-one' | 'one-to-many' | 'many-to-many';
  
  // For formula
  formula?: {
    expression: string;
    dependencies: string[]; // Column IDs this formula depends on
    returnType: FieldType;
  };
  
  // For status (workflow)
  statusConfig?: {
    transitions: StatusTransition[];
    colors: Record<string, string>;
    icons: Record<string, string>;
  };
  
  // UI hints
  width?: number;
  hidden?: boolean;
  frozen?: boolean;
  format?: string; // For numbers, dates
}

export interface SelectOption {
  id: string;
  label: string;
  color?: string;
  icon?: string;
  archived?: boolean;
}

export interface StatusTransition {
  from: string;
  to: string;
  label?: string;
  requiredRole?: string;
  condition?: string;
  actions?: WorkflowAction[];
}

export interface WorkflowAction {
  type: 'webhook' | 'email' | 'update_field' | 'create_row' | 'script';
  config: Record<string, any>;
}

export interface Row {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  version: number;
  locked?: boolean;
  lockedBy?: string;
  lockedAt?: Date;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface Table {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  columns: Column[];
  primaryKey?: string;
  
  // Permissions
  permissions: {
    table: PermissionRule[];
    row: PermissionRule[];
    column: Record<string, PermissionRule[]>;
  };
  
  // Versioning
  versioning?: {
    enabled: boolean;
    maxVersions: number;
    strategy: 'all' | 'major' | 'none';
  };
  
  // Audit
  audit?: {
    enabled: boolean;
    fields: ('create' | 'update' | 'delete' | 'view')[];
    retention: number; // days
  };
  
  // Webhooks
  webhooks?: Webhook[];
  
  // Views
  views?: View[];
  
  // Automations
  automations?: Automation[];
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers?: Record<string, string>;
  secret?: string;
  active: boolean;
  retries?: number;
}

export interface View {
  id: string;
  name: string;
  type: 'grid' | 'kanban' | 'calendar' | 'gallery' | 'gantt' | 'form';
  config: ViewConfig;
  filters?: Filter[];
  sorts?: Sort[];
  groups?: Group[];
  permissions?: PermissionRule[];
}

export interface ViewConfig {
  // Grid specific
  frozenColumns?: string[];
  columnWidths?: Record<string, number>;
  rowHeight?: 'compact' | 'normal' | 'comfortable';
  
  // Kanban specific
  kanbanColumn?: string;
  kanbanSwimlanes?: string;
  cardFields?: string[];
  
  // Calendar specific
  dateField?: string;
  endDateField?: string;
  colorField?: string;
  
  // Gallery specific
  imageField?: string;
  titleField?: string;
  descriptionFields?: string[];
  
  // Gantt specific
  startField?: string;
  endField?: string;
  progressField?: string;
  dependencyField?: string;
}

export interface Filter {
  id: string;
  column: string;
  operator: FilterOperator;
  value: any;
  conjunction?: 'and' | 'or';
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals'
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'in'
  | 'not_in';

export interface Sort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface Group {
  column: string;
  collapsed?: string[];
  aggregations?: Aggregation[];
}

export interface Aggregation {
  column: string;
  function: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'unique';
  label?: string;
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  active: boolean;
  runAs?: string; // User ID to run automation as
}

export interface AutomationTrigger {
  type: 'row_created' | 'row_updated' | 'row_deleted' | 'field_changed' | 'schedule' | 'webhook';
  config: {
    fields?: string[];
    schedule?: string; // Cron expression
    webhookId?: string;
  };
}

export interface AutomationCondition {
  type: 'field_equals' | 'field_contains' | 'expression';
  config: {
    field?: string;
    value?: any;
    expression?: string;
  };
}

export interface AutomationAction {
  type: 'update_field' | 'create_row' | 'delete_row' | 'send_email' | 'call_webhook' | 'run_script';
  config: Record<string, any>;
}

// Permission Evaluation Engine
export class PermissionEngine {
  private rules: PermissionRule[] = [];
  
  constructor(rules: PermissionRule[]) {
    this.rules = rules.sort((a, b) => a.priority - b.priority);
  }
  
  evaluate(
    action: 'read' | 'write' | 'delete',
    subject: Record<string, any>,
    resource?: Record<string, any>
  ): boolean {
    for (const rule of this.rules) {
      if (this.matchesRule(rule, subject, resource)) {
        if (rule.condition) {
          const conditionMet = this.evaluateCondition(rule.condition, subject, resource);
          if (!conditionMet) continue;
        }
        return rule.effect === 'allow';
      }
    }
    return false; // Default deny
  }
  
  private matchesRule(
    rule: PermissionRule,
    subject: Record<string, any>,
    resource?: Record<string, any>
  ): boolean {
    // Match subject attributes
    for (const [key, value] of Object.entries(rule.subject)) {
      if (subject[key] !== value) return false;
    }
    
    // Match resource attributes if specified
    if (rule.resource && resource) {
      for (const [key, value] of Object.entries(rule.resource)) {
        if (resource[key] !== value) return false;
      }
    }
    
    return true;
  }
  
  private evaluateCondition(
    condition: string,
    subject: Record<string, any>,
    resource?: Record<string, any>
  ): boolean {
    try {
      // Create safe evaluation context
      const context = {
        subject,
        resource: resource || {},
        now: () => new Date(),
        dayOfWeek: () => new Date().getDay(),
        hourOfDay: () => new Date().getHours()
      };
      
      // Use Function constructor for safe evaluation
      const fn = new Function('context', `with(context) { return ${condition} }`);
      return fn(context);
    } catch (e) {
      console.error('Error evaluating condition:', e);
      return false;
    }
  }
}

// Formula Engine
export class FormulaEngine {
  private formulas: Map<string, Formula> = new Map();
  private cache: Map<string, any> = new Map();
  
  registerFormula(columnId: string, formula: Formula) {
    this.formulas.set(columnId, formula);
  }
  
  evaluate(columnId: string, row: Row, allRows?: Row[]): any {
    const cacheKey = `${columnId}:${row.id}:${row.version}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const formula = this.formulas.get(columnId);
    if (!formula) return null;
    
    try {
      const result = this.evaluateFormula(formula.expression, row, allRows);
      this.cache.set(cacheKey, result);
      return result;
    } catch (e) {
      console.error('Formula evaluation error:', e);
      return null;
    }
  }
  
  private evaluateFormula(expression: string, row: Row, allRows?: Row[]): any {
    // Provide formula functions
    const functions = {
      SUM: (field: string) => this.aggregateFunction('sum', field, allRows),
      AVG: (field: string) => this.aggregateFunction('avg', field, allRows),
      COUNT: (field: string) => this.aggregateFunction('count', field, allRows),
      MAX: (field: string) => this.aggregateFunction('max', field, allRows),
      MIN: (field: string) => this.aggregateFunction('min', field, allRows),
      IF: (condition: boolean, trueValue: any, falseValue: any) => 
        condition ? trueValue : falseValue,
      CONCAT: (...args: any[]) => args.join(''),
      NOW: () => new Date(),
      DAYS_BETWEEN: (date1: Date, date2: Date) => 
        Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
    };
    
    const context = {
      ...row.data,
      ...functions,
      ROW: row,
      ALL_ROWS: allRows
    };
    
    const fn = new Function('context', `with(context) { return ${expression} }`);
    return fn(context);
  }
  
  private aggregateFunction(
    func: 'sum' | 'avg' | 'count' | 'max' | 'min',
    field: string,
    rows?: Row[]
  ): number {
    if (!rows || rows.length === 0) return 0;
    
    const values = rows.map(r => r.data[field]).filter(v => v != null);
    
    switch (func) {
      case 'sum':
        return values.reduce((a, b) => a + Number(b), 0);
      case 'avg':
        return values.length > 0 ? 
          values.reduce((a, b) => a + Number(b), 0) / values.length : 0;
      case 'count':
        return values.length;
      case 'max':
        return Math.max(...values.map(Number));
      case 'min':
        return Math.min(...values.map(Number));
    }
  }
  
  clearCache() {
    this.cache.clear();
  }
}

export interface Formula {
  expression: string;
  dependencies: string[];
  returnType: FieldType;
}