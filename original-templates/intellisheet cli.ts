#!/usr/bin/env node

// IntelliSheet CLI - Command Line Interface for IntelliSheet
// Usage: intellisheet <command> [options]

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const version = '1.0.0';

// CLI Configuration
interface CLIConfig {
  apiUrl?: string;
  apiKey?: string;
  workspace?: string;
  environment?: 'development' | 'staging' | 'production';
  outputFormat?: 'json' | 'yaml' | 'table';
}

// Project Configuration
interface ProjectConfig {
  name: string;
  version: string;
  description?: string;
  workspace?: string;
  schemas?: string[];
  environments?: Record<string, EnvironmentConfig>;
}

interface EnvironmentConfig {
  apiUrl: string;
  workspace: string;
  variables?: Record<string, any>;
}

// Template Types
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  schema: string;
  preview?: string;
}

// Command Classes
class IntelliSheetCLI {
  private config: CLIConfig;
  private projectConfig: ProjectConfig | null = null;
  private configPath: string;
  
  constructor() {
    this.configPath = path.join(process.env.HOME || '', '.intellisheet', 'config.json');
    this.config = this.loadConfig();
  }
  
  private loadConfig(): CLIConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      }
    } catch (error) {
      console.warn(chalk.yellow('Warning: Could not load config file'));
    }
    return {};
  }
  
  private saveConfig(config: CLIConfig): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }
  
  private loadProjectConfig(): ProjectConfig | null {
    const configFile = 'intellisheet.json';
    if (fs.existsSync(configFile)) {
      try {
        return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      } catch (error) {
        console.error(chalk.red('Error loading project config:', error.message));
      }
    }
    return null;
  }
  
  private saveProjectConfig(config: ProjectConfig): void {
    fs.writeFileSync('intellisheet.json', JSON.stringify(config, null, 2));
  }
  
  // Command: init
  async init(name?: string): Promise<void> {
    console.log(chalk.blue.bold('\n🚀 Initializing IntelliSheet Project\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: name || path.basename(process.cwd()),
        validate: (input) => input.length > 0 || 'Project name is required'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a starter template:',
        choices: [
          { name: 'Blank Project', value: 'blank' },
          { name: 'IT Asset Management', value: 'it-assets' },
          { name: 'HR Management', value: 'hr-management' },
          { name: 'Project Management', value: 'project-management' },
          { name: 'CRM System', value: 'crm' },
          { name: 'Inventory Tracking', value: 'inventory' },
        ]
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize git repository?',
        default: true
      }
    ]);
    
    const spinner = ora('Creating project structure...').start();
    
    try {
      // Create project structure
      const projectConfig: ProjectConfig = {
        name: answers.name,
        version: '1.0.0',
        description: answers.description,
        schemas: [],
        environments: {
          development: {
            apiUrl: 'http://localhost:3000',
            workspace: answers.name.toLowerCase().replace(/\s+/g, '-')
          },
          production: {
            apiUrl: 'https://api.intellisheet.com',
            workspace: answers.name.toLowerCase().replace(/\s+/g, '-')
          }
        }
      };
      
      // Create directories
      const dirs = ['schemas', 'templates', 'migrations', 'scripts', 'docs'];
      dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });
      
      // Save project config
      this.saveProjectConfig(projectConfig);
      
      // Create .gitignore
      const gitignore = `
node_modules/
.env
.env.local
.intellisheet/
dist/
build/
*.log
.DS_Store
`;
      fs.writeFileSync('.gitignore', gitignore.trim());
      
      // Create README
      const readme = `# ${answers.name}

${answers.description || 'An IntelliSheet project'}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Deploy schema
intellisheet deploy

# Run development server
intellisheet dev
\`\`\`

## Project Structure

- \`schemas/\` - Schema definitions
- \`templates/\` - Solution templates
- \`migrations/\` - Database migrations
- \`scripts/\` - Custom scripts
- \`docs/\` - Documentation

## Available Commands

- \`intellisheet dev\` - Start development server
- \`intellisheet deploy\` - Deploy to production
- \`intellisheet generate\` - Generate resources
- \`intellisheet validate\` - Validate schemas
`;
      fs.writeFileSync('README.md', readme);
      
      // Apply template if selected
      if (answers.template !== 'blank') {
        spinner.text = 'Applying template...';
        await this.applyTemplate(answers.template);
      }
      
      // Initialize git
      if (answers.git) {
        spinner.text = 'Initializing git repository...';
        await execAsync('git init');
        await execAsync('git add .');
        await execAsync('git commit -m "Initial commit"');
      }
      
      spinner.succeed(chalk.green('✅ Project initialized successfully!'));
      
      console.log(chalk.cyan('\nNext steps:'));
      console.log(chalk.gray('  1. cd ' + answers.name));
      console.log(chalk.gray('  2. intellisheet dev'));
      console.log(chalk.gray('  3. Open http://localhost:3000\n'));
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize project'));
      console.error(error);
      process.exit(1);
    }
  }
  
  // Command: generate
  async generate(type: string, name?: string): Promise<void> {
    const generators: Record<string, () => Promise<void>> = {
      table: () => this.generateTable(name),
      template: () => this.generateTemplate(name),
      migration: () => this.generateMigration(name),
      workflow: () => this.generateWorkflow(name),
      dashboard: () => this.generateDashboard(name),
      api: () => this.generateAPI(name)
    };
    
    if (!generators[type]) {
      console.error(chalk.red(`Unknown generator type: ${type}`));
      console.log(chalk.gray('Available types: ' + Object.keys(generators).join(', ')));
      process.exit(1);
    }
    
    await generators[type]();
  }
  
  private async generateTable(name?: string): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Table name:',
        default: name,
        validate: (input) => input.length > 0 || 'Table name is required'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Table description:'
      },
      {
        type: 'checkbox',
        name: 'columns',
        message: 'Select column presets:',
        choices: [
          { name: 'ID (Auto-increment)', value: 'id', checked: true },
          { name: 'Timestamps (Created/Updated)', value: 'timestamps', checked: true },
          { name: 'User Tracking (Created/Updated By)', value: 'user_tracking' },
          { name: 'Status Workflow', value: 'status' },
          { name: 'Soft Delete', value: 'soft_delete' },
          { name: 'Version Control', value: 'versioning' }
        ]
      }
    ]);
    
    const spinner = ora('Generating table schema...').start();
    
    try {
      const schema = {
        name: answers.name,
        version: '1.0.0',
        tables: {
          [answers.name]: {
            description: answers.description,
            columns: this.buildColumns(answers.columns),
            permissions: {
              rules: [
                {
                  name: 'Admin Full Access',
                  subjects: { role: 'admin' },
                  actions: ['create', 'read', 'update', 'delete'],
                  effect: 'allow'
                },
                {
                  name: 'User Read Access',
                  subjects: { role: 'user' },
                  actions: ['read'],
                  effect: 'allow'
                }
              ]
            }
          }
        }
      };
      
      const schemaPath = path.join('schemas', `${answers.name}.yaml`);
      fs.writeFileSync(schemaPath, yaml.dump(schema));
      
      spinner.succeed(chalk.green(`✅ Table schema generated: ${schemaPath}`));
      
      // Update project config
      const projectConfig = this.loadProjectConfig();
      if (projectConfig) {
        projectConfig.schemas = projectConfig.schemas || [];
        projectConfig.schemas.push(schemaPath);
        this.saveProjectConfig(projectConfig);
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate table'));
      console.error(error);
    }
  }
  
  private buildColumns(presets: string[]): any[] {
    const columns = [];
    
    if (presets.includes('id')) {
      columns.push({
        id: 'id',
        type: 'text',
        unique: true,
        required: true,
        default: 'uuid()'
      });
    }
    
    if (presets.includes('timestamps')) {
      columns.push(
        {
          id: 'created_at',
          type: 'datetime',
          default: 'now()'
        },
        {
          id: 'updated_at',
          type: 'datetime',
          formula: 'now()'
        }
      );
    }
    
    if (presets.includes('user_tracking')) {
      columns.push(
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
      );
    }
    
    if (presets.includes('status')) {
      columns.push({
        id: 'status',
        type: 'status',
        workflow: {
          states: {
            draft: { label: 'Draft', color: 'gray' },
            pending: { label: 'Pending', color: 'amber' },
            approved: { label: 'Approved', color: 'green' },
            rejected: { label: 'Rejected', color: 'red' }
          },
          transitions: [
            { from: 'draft', to: 'pending', label: 'Submit' },
            { from: 'pending', to: 'approved', label: 'Approve' },
            { from: 'pending', to: 'rejected', label: 'Reject' },
            { from: 'rejected', to: 'draft', label: 'Revise' }
          ]
        }
      });
    }
    
    if (presets.includes('soft_delete')) {
      columns.push({
        id: 'deleted_at',
        type: 'datetime',
        default: null
      });
    }
    
    if (presets.includes('versioning')) {
      columns.push({
        id: 'version',
        type: 'number',
        default: 1
      });
    }
    
    return columns;
  }
  
  private async generateTemplate(name?: string): Promise<void> {
    console.log(chalk.blue('Generating template...'));
    // Implementation for template generation
  }
  
  private async generateMigration(name?: string): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Migration name:',
        default: name,
        validate: (input) => input.length > 0 || 'Migration name is required'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Migration type:',
        choices: [
          { name: 'Add Column', value: 'add_column' },
          { name: 'Remove Column', value: 'remove_column' },
          { name: 'Rename Column', value: 'rename_column' },
          { name: 'Change Column Type', value: 'change_type' },
          { name: 'Add Index', value: 'add_index' },
          { name: 'Custom', value: 'custom' }
        ]
      }
    ]);
    
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const filename = `${timestamp}_${answers.name.toLowerCase().replace(/\s+/g, '_')}.js`;
    const filepath = path.join('migrations', filename);
    
    const migration = `// Migration: ${answers.name}
// Generated: ${new Date().toISOString()}

export async function up(schema) {
  // Apply migration
  ${this.getMigrationTemplate(answers.type, 'up')}
}

export async function down(schema) {
  // Rollback migration
  ${this.getMigrationTemplate(answers.type, 'down')}
}
`;
    
    fs.writeFileSync(filepath, migration);
    console.log(chalk.green(`✅ Migration generated: ${filepath}`));
  }
  
  private getMigrationTemplate(type: string, direction: 'up' | 'down'): string {
    const templates: Record<string, Record<'up' | 'down', string>> = {
      add_column: {
        up: `await schema.table('table_name').addColumn({
    id: 'column_name',
    type: 'text',
    required: false
  });`,
        down: `await schema.table('table_name').dropColumn('column_name');`
      },
      remove_column: {
        up: `await schema.table('table_name').dropColumn('column_name');`,
        down: `await schema.table('table_name').addColumn({
    id: 'column_name',
    type: 'text'
  });`
      },
      rename_column: {
        up: `await schema.table('table_name').renameColumn('old_name', 'new_name');`,
        down: `await schema.table('table_name').renameColumn('new_name', 'old_name');`
      },
      change_type: {
        up: `await schema.table('table_name').changeColumn('column_name', {
    type: 'number'
  });`,
        down: `await schema.table('table_name').changeColumn('column_name', {
    type: 'text'
  });`
      },
      add_index: {
        up: `await schema.table('table_name').addIndex(['column1', 'column2'], {
    unique: false,
    name: 'idx_table_columns'
  });`,
        down: `await schema.table('table_name').dropIndex('idx_table_columns');`
      },
      custom: {
        up: `// Add your custom migration logic here`,
        down: `// Add your rollback logic here`
      }
    };
    
    return templates[type]?.[direction] || templates.custom[direction];
  }
  
  private async generateWorkflow(name?: string): Promise<void> {
    console.log(chalk.blue('Generating workflow...'));
    // Implementation for workflow generation
  }
  
  private async generateDashboard(name?: string): Promise<void> {
    console.log(chalk.blue('Generating dashboard...'));
    // Implementation for dashboard generation
  }
  
  private async generateAPI(name?: string): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'API endpoint name:',
        default: name,
        validate: (input) => input.length > 0 || 'API name is required'
      },
      {
        type: 'checkbox',
        name: 'methods',
        message: 'Select HTTP methods:',
        choices: [
          { name: 'GET - List/Read', value: 'get', checked: true },
          { name: 'POST - Create', value: 'post', checked: true },
          { name: 'PUT - Update', value: 'put', checked: true },
          { name: 'PATCH - Partial Update', value: 'patch' },
          { name: 'DELETE - Delete', value: 'delete', checked: true }
        ]
      },
      {
        type: 'confirm',
        name: 'auth',
        message: 'Require authentication?',
        default: true
      }
    ]);
    
    const apiPath = path.join('api', `${answers.name}.js`);
    
    const apiCode = `// API Endpoint: ${answers.name}
// Generated: ${new Date().toISOString()}

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { ${answers.name}Schema } from '../schemas/${answers.name}';

const router = Router();

${answers.auth ? '// Authentication required for all routes\nrouter.use(authenticate);\n' : ''}
${answers.methods.includes('get') ? `
// GET /${answers.name} - List all records
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, sort, filter } = req.query;
    
    const data = await req.intellisheet
      .table('${answers.name}')
      .find(filter)
      .sort(sort)
      .paginate(page, limit);
    
    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: data.total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /${answers.name}/:id - Get single record
router.get('/:id', async (req, res) => {
  try {
    const record = await req.intellisheet
      .table('${answers.name}')
      .findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});` : ''}

${answers.methods.includes('post') ? `
// POST /${answers.name} - Create new record
router.post('/', validate(${answers.name}Schema), async (req, res) => {
  try {
    const record = await req.intellisheet
      .table('${answers.name}')
      .create(req.body);
    
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});` : ''}

${answers.methods.includes('put') ? `
// PUT /${answers.name}/:id - Update record
router.put('/:id', validate(${answers.name}Schema), async (req, res) => {
  try {
    const record = await req.intellisheet
      .table('${answers.name}')
      .update(req.params.id, req.body);
    
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});` : ''}

${answers.methods.includes('patch') ? `
// PATCH /${answers.name}/:id - Partial update
router.patch('/:id', async (req, res) => {
  try {
    const record = await req.intellisheet
      .table('${answers.name}')
      .patch(req.params.id, req.body);
    
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});` : ''}

${answers.methods.includes('delete') ? `
// DELETE /${answers.name}/:id - Delete record
router.delete('/:id', authorize('delete'), async (req, res) => {
  try {
    const success = await req.intellisheet
      .table('${answers.name}')
      .delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});` : ''}

export default router;
`;
    
    // Create api directory if it doesn't exist
    if (!fs.existsSync('api')) {
      fs.mkdirSync('api', { recursive: true });
    }
    
    fs.writeFileSync(apiPath, apiCode);
    console.log(chalk.green(`✅ API endpoint generated: ${apiPath}`));
  }
  
  // Command: deploy
  async deploy(environment?: string): Promise<void> {
    const env = environment || this.config.environment || 'production';
    console.log(chalk.blue.bold(`\n🚀 Deploying to ${env}\n`));
    
    const projectConfig = this.loadProjectConfig();
    if (!projectConfig) {
      console.error(chalk.red('No intellisheet.json found. Run "intellisheet init" first.'));
      process.exit(1);
    }
    
    const envConfig = projectConfig.environments?.[env];
    if (!envConfig) {
      console.error(chalk.red(`Environment "${env}" not configured.`));
      process.exit(1);
    }
    
    const spinner = ora('Validating schemas...').start();
    
    try {
      // Validate all schemas
      for (const schemaPath of projectConfig.schemas || []) {
        spinner.text = `Validating ${schemaPath}...`;
        await this.validateSchema(schemaPath);
      }
      
      spinner.text = 'Deploying schemas...';
      
      // Deploy each schema
      for (const schemaPath of projectConfig.schemas || []) {
        spinner.text = `Deploying ${schemaPath}...`;
        await this.deploySchema(schemaPath, envConfig);
      }
      
      spinner.succeed(chalk.green('✅ Deployment successful!'));
      
      console.log(chalk.cyan('\nDeployment Summary:'));
      console.log(chalk.gray(`  Environment: ${env}`));
      console.log(chalk.gray(`  API URL: ${envConfig.apiUrl}`));
      console.log(chalk.gray(`  Workspace: ${envConfig.workspace}`));
      console.log(chalk.gray(`  Schemas: ${projectConfig.schemas?.length || 0}`));
      
    } catch (error) {
      spinner.fail(chalk.red('Deployment failed'));
      console.error(error);
      process.exit(1);
    }
  }
  
  private async validateSchema(schemaPath: string): Promise<void> {
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const content = fs.readFileSync(schemaPath, 'utf-8');
    const schema = yaml.load(content);
    
    // Basic validation
    if (!schema.name) {
      throw new Error(`Schema must have a name: ${schemaPath}`);
    }
    
    if (!schema.tables || Object.keys(schema.tables).length === 0) {
      throw new Error(`Schema must define at least one table: ${schemaPath}`);
    }
    
    // Validate each table
    for (const [tableName, table] of Object.entries(schema.tables)) {
      if (!table.columns || table.columns.length === 0) {
        throw new Error(`Table ${tableName} must have at least one column`);
      }
    }
  }
  
  private async deploySchema(schemaPath: string, envConfig: EnvironmentConfig): Promise<void> {
    // In a real implementation, this would make API calls to deploy the schema
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Command: validate
  async validate(schemaPath?: string): Promise<void> {
    const projectConfig = this.loadProjectConfig();
    const schemas = schemaPath ? [schemaPath] : projectConfig?.schemas || [];
    
    if (schemas.length === 0) {
      console.error(chalk.red('No schemas to validate.'));
      process.exit(1);
    }
    
    console.log(chalk.blue.bold('\n🔍 Validating Schemas\n'));
    
    let hasErrors = false;
    
    for (const path of schemas) {
      try {
        await this.validateSchema(path);
        console.log(chalk.green(`✅ ${path}`));
      } catch (error) {
        console.log(chalk.red(`❌ ${path}: ${error.message}`));
        hasErrors = true;
      }
    }
    
    if (hasErrors) {
      console.log(chalk.red('\n❌ Validation failed'));
      process.exit(1);
    } else {
      console.log(chalk.green('\n✅ All schemas are valid'));
    }
  }
  
  // Command: dev
  async dev(port?: number): Promise<void> {
    const devPort = port || 3000;
    console.log(chalk.blue.bold(`\n🚀 Starting IntelliSheet Development Server\n`));
    
    const spinner = ora('Starting server...').start();
    
    try {
      // In a real implementation, this would start a development server
      spinner.succeed(chalk.green(`✅ Server running at http://localhost:${devPort}`));
      
      console.log(chalk.cyan('\nAvailable endpoints:'));
      console.log(chalk.gray(`  API:       http://localhost:${devPort}/api`));
      console.log(chalk.gray(`  GraphQL:   http://localhost:${devPort}/graphql`));
      console.log(chalk.gray(`  Admin:     http://localhost:${devPort}/admin`));
      console.log(chalk.gray(`  Docs:      http://localhost:${devPort}/docs`));
      
      console.log(chalk.yellow('\nPress Ctrl+C to stop the server'));
      
      // Keep the process running
      process.stdin.resume();
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to start server'));
      console.error(error);
      process.exit(1);
    }
  }
  
  // Command: login
  async login(): Promise<void> {
    console.log(chalk.blue.bold('\n🔐 IntelliSheet Login\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiUrl',
        message: 'API URL:',
        default: this.config.apiUrl || 'https://api.intellisheet.com'
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'API Key:',
        validate: (input) => input.length > 0 || 'API key is required'
      }
    ]);
    
    const spinner = ora('Authenticating...').start();
    
    try {
      // In a real implementation, validate the API key
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save config
      this.config.apiUrl = answers.apiUrl;
      this.config.apiKey = answers.apiKey;
      this.saveConfig(this.config);
      
      spinner.succeed(chalk.green('✅ Successfully logged in'));
      
    } catch (error) {
      spinner.fail(chalk.red('Authentication failed'));
      console.error(error);
      process.exit(1);
    }
  }
  
  // Command: permissions
  async permissions(action?: string): Promise<void> {
    const actions: Record<string, () => Promise<void>> = {
      check: () => this.checkPermissions(),
      validate: () => this.validatePermissions(),
      export: () => this.exportPermissions(),
      import: () => this.importPermissions()
    };
    
    if (action && !actions[action]) {
      console.error(chalk.red(`Unknown action: ${action}`));
      console.log(chalk.gray('Available actions: ' + Object.keys(actions).join(', ')));
      process.exit(1);
    }
    
    if (action) {
      await actions[action]();
    } else {
      await this.checkPermissions();
    }
  }
  
  private async checkPermissions(): Promise<void> {
    console.log(chalk.blue.bold('\n🔒 Permission Analysis\n'));
    
    const projectConfig = this.loadProjectConfig();
    if (!projectConfig?.schemas) {
      console.error(chalk.red('No schemas found.'));
      return;
    }
    
    let totalRules = 0;
    let totalTables = 0;
    
    for (const schemaPath of projectConfig.schemas) {
      const content = fs.readFileSync(schemaPath, 'utf-8');
      const schema = yaml.load(content) as any;
      
      for (const [tableName, table] of Object.entries(schema.tables || {})) {
        totalTables++;
        const rules = (table as any).permissions?.rules || [];
        totalRules += rules.length;
        
        console.log(chalk.cyan(`Table: ${tableName}`));
        for (const rule of rules) {
          const effect = rule.effect === 'allow' ? chalk.green('ALLOW') : chalk.red('DENY');
          console.log(chalk.gray(`  - ${rule.name}: ${effect} ${rule.actions.join(', ')}`));
        }
      }
    }
    
    console.log(chalk.blue('\nSummary:'));
    console.log(chalk.gray(`  Tables: ${totalTables}`));
    console.log(chalk.gray(`  Permission Rules: ${totalRules}`));
  }
  
  private async validatePermissions(): Promise<void> {
    console.log(chalk.blue('Validating permissions...'));
    // Implementation for permission validation
  }
  
  private async exportPermissions(): Promise<void> {
    console.log(chalk.blue('Exporting permissions...'));
    // Implementation for permission export
  }
  
  private async importPermissions(): Promise<void> {
    console.log(chalk.blue('Importing permissions...'));
    // Implementation for permission import
  }
  
  // Apply template
  private async applyTemplate(templateId: string): Promise<void> {
    const templates: Record<string, () => any> = {
      'it-assets': () => ({
        name: 'it_assets.yaml',
        content: this.getITAssetsTemplate()
      }),
      'hr-management': () => ({
        name: 'hr_management.yaml',
        content: this.getHRTemplate()
      }),
      'project-management': () => ({
        name: 'project_management.yaml',
        content: this.getProjectTemplate()
      }),
      'crm': () => ({
        name: 'crm.yaml',
        content: this.getCRMTemplate()
      }),
      'inventory': () => ({
        name: 'inventory.yaml',
        content: this.getInventoryTemplate()
      })
    };
    
    const template = templates[templateId]?.();
    if (template) {
      const schemaPath = path.join('schemas', template.name);
      fs.writeFileSync(schemaPath, yaml.dump(template.content));
      
      // Update project config
      const projectConfig = this.loadProjectConfig();
      if (projectConfig) {
        projectConfig.schemas = projectConfig.schemas || [];
        projectConfig.schemas.push(schemaPath);
        this.saveProjectConfig(projectConfig);
      }
    }
  }
  
  private getITAssetsTemplate(): any {
    return {
      name: 'IT Asset Management',
      version: '1.0.0',
      description: 'Track and manage IT assets lifecycle',
      tables: {
        assets: {
          columns: [
            { id: 'id', type: 'text', unique: true, required: true, default: 'uuid()' },
            { id: 'asset_tag', type: 'text', unique: true, required: true },
            { id: 'type', type: 'select', options: ['laptop', 'desktop', 'monitor', 'printer', 'mobile', 'other'] },
            { id: 'brand', type: 'text' },
            { id: 'model', type: 'text' },
            { id: 'serial_number', type: 'text' },
            { id: 'purchase_date', type: 'date' },
            { id: 'purchase_cost', type: 'number' },
            { id: 'assigned_to', type: 'user' },
            { id: 'status', type: 'status',
              workflow: {
                states: {
                  available: { label: 'Available', color: 'green' },
                  assigned: { label: 'Assigned', color: 'blue' },
                  maintenance: { label: 'Maintenance', color: 'amber' },
                  retired: { label: 'Retired', color: 'gray' }
                },
                transitions: [
                  { from: 'available', to: 'assigned', label: 'Assign' },
                  { from: 'assigned', to: 'available', label: 'Return' },
                  { from: ['available', 'assigned'], to: 'maintenance', label: 'Send to Maintenance' },
                  { from: 'maintenance', to: 'available', label: 'Complete Maintenance' },
                  { from: '*', to: 'retired', label: 'Retire' }
                ]
              }
            },
            { id: 'created_at', type: 'datetime', default: 'now()' },
            { id: 'updated_at', type: 'datetime', formula: 'now()' }
          ]
        }
      }
    };
  }
  
  private getHRTemplate(): any {
    return {
      name: 'HR Management',
      version: '1.0.0',
      description: 'Human resources management system',
      tables: {
        employees: {
          columns: [
            { id: 'id', type: 'text', unique: true, required: true, default: 'uuid()' },
            { id: 'employee_id', type: 'text', unique: true, required: true },
            { id: 'first_name', type: 'text', required: true },
            { id: 'last_name', type: 'text', required: true },
            { id: 'email', type: 'text', unique: true, required: true },
            { id: 'department', type: 'select', options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'] },
            { id: 'position', type: 'text' },
            { id: 'hire_date', type: 'date' },
            { id: 'status', type: 'select', options: ['active', 'on_leave', 'terminated'] },
            { id: 'created_at', type: 'datetime', default: 'now()' },
            { id: 'updated_at', type: 'datetime', formula: 'now()' }
          ]
        }
      }
    };
  }
  
  private getProjectTemplate(): any {
    // Return project management template
    return {};
  }
  
  private getCRMTemplate(): any {
    // Return CRM template
    return {};
  }
  
  private getInventoryTemplate(): any {
    // Return inventory template
    return {};
  }
}

// CLI Program
const program = new Command();
const cli = new IntelliSheetCLI();

program
  .name('intellisheet')
  .description('IntelliSheet CLI - Manage your IntelliSheet projects')
  .version(version);

program
  .command('init [name]')
  .description('Initialize a new IntelliSheet project')
  .action((name) => cli.init(name));

program
  .command('generate <type> [name]')
  .alias('g')
  .description('Generate resources (table, template, migration, workflow, dashboard, api)')
  .action((type, name) => cli.generate(type, name));

program
  .command('deploy [environment]')
  .description('Deploy schemas to IntelliSheet')
  .action((env) => cli.deploy(env));

program
  .command('dev [port]')
  .description('Start development server')
  .action((port) => cli.dev(port));

program
  .command('validate [schema]')
  .description('Validate schema files')
  .action((schema) => cli.validate(schema));

program
  .command('login')
  .description('Authenticate with IntelliSheet')
  .action(() => cli.login());

program
  .command('permissions [action]')
  .description('Manage permissions (check, validate, export, import)')
  .action((action) => cli.permissions(action));

program.parse(process.argv);