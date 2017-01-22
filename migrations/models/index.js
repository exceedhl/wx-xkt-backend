'use strict';

const Sequelize = require('sequelize');
const api = require('../../src/app');
const models = api.get('models');
const sequelize = api.get('sequelize');

// The db object must be a dictionary of model names to models
// It must also include sequelize (instance) and Sequelize (ctor) properties
const db = Object.assign({
	Sequelize,
	sequelize
}, models);

module.exports = db;
