var co = require('co');
var logic = require('./lib/logic');

module.exports = function(config, callback) {
    // ES6 generator control flow
    co(function* () {
        try {
            // Log startup
            console.log('[System]', 'Finding largest documents for collection: ' + config.collectionName);
            
            // Find top X largest documents for the given collection
            var largestDocuments = yield logic.findLargestDocuments(config);
            
            // Pass task result to provided callback
            callback(null, largestDocuments);
        }
        catch (err) {
            // Pass unhandled exception to callback
            callback(err);
        }
    });
};