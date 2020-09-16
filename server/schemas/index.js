const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const typesArray = fileLoader(__dirname);

module.exports = mergeTypes(typesArray, { all: true });
