import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, Options } from 'sequelize';
import process from 'process';
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const basename = path.basename(__filename);


// Define the structure of the config object.
interface Config {
  use_env_variable?: string;
  database: string;
  username: string;
  password: string ; // Allow null or undefined for the password field
  dialect: 'mysql'; // Ensure dialect is one of Sequelize's supported dialects
  host?: string;
  port?: number;
  [key: string]: any; // Allow other properties that may exist in the config.
}

// Type assertion to make sure `config` matches the expected structure
const typedConfig = config as any;

const environmentConfig = typedConfig[env]; // Environment-specific config

const db: { [key: string]: any; sequelize?: Sequelize; Sequelize?: typeof Sequelize; initializeDatabase?: () => Promise<void>; } = {};

let sequelize: Sequelize;

// Check if `use_env_variable` exists and set up the sequelize instance accordingly
if (environmentConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[environmentConfig.use_env_variable as string]!, environmentConfig);
} else {
  // Deconstruct config for clarity
  const { database, username, password, ...options } = environmentConfig;

  // Pass parameters separately to the Sequelize constructor
  sequelize = new Sequelize(database, username, password, options as Options);
}

// Read files in the current directory and dynamically import models
fs
  .readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file: string) => {
    // Dynamically import the model and associate it with the sequelize instance
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Associate models (if they have the associate method)
Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Function to initialize the database connection
async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log('Database connection error', (e as Error).message);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.initializeDatabase = initializeDatabase;

export default db;
