const Sequelize = require("sequelize");

const connection = new Sequelize("projetoblog", 'root', 'umburana2011', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;