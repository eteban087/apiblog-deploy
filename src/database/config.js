const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DB_LINK, {
  dialect: process.env.DB_DIALECT,
  host: process.env.BD_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  protocol: process.env.DB_PROTOCOL,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = { db };
