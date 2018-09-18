const largest = require('./lib/logic');

module.exports = function(config) {
  console.log(`Find largest documents in ${config.db}.${config.collection}`);
  return largest.findLargestDocuments(config);
};
