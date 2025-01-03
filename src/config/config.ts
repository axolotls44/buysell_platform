import { Dialect } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

interface Config {
  username: string | undefined;
  password: string| undefined;
  database: string| undefined;
  host: string| undefined;
  port:string| undefined;
  dialect: Dialect;
}

const config: { [environment: string]: Config } = {
  "development": {
    "username": process.env.DEV_DB_USERNAME,
    "password": process.env.DEV_DB_PASSWORD,
    "database": process.env.DEV_DB_NAME,
    "host": process.env.DEV_DB_HOSTNAME,
    "port": process.env.DEV_DB_PORT,
    "dialect": "mysql"
  },
   "production": {
    "username": process.env.PROD_DB_USERNAME,
    "password": process.env.PROD_DB_PASSWORD,
    "database": process.env.PROD_DB_NAME,
    "host": process.env.PROD_DB_HOSTNAME,
    "port": process.env.PROD_DB_PORT,
    "dialect": "mysql"
  }
}
module.exports = config;
