const { fileLoader, mergeResolvers } = require('merge-graphql-schemas');

const resolversArray = fileLoader(__dirname);

module.exports = mergeResolvers(resolversArray, { all: true });
