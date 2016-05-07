var monk = require('monk');
var bson = require('bson');
var wrap = require('co-monk');
var BSON = new bson.BSONPure.BSON();

exports.findLargestDocuments = function* (config) {
    // Initialize DB connection
    var db = monk(config.db);
    var collection = wrap(db.get(config.collectionName));

    // Keep track of processed documents for progress log
    var count = 0;
    
    // Array that will contain all documents and their sizes
    var documents = [];

    // Default query where clause is blank, populate it with last document ID later on
    var whereClause = {};

    // Run forever, until no more documents are returned
    while (true) {
        // Get batch of documents
        var results = yield collection.find(whereClause, { limit: config.batchSize, sort: { _id: 1 } });

        // Reached end of collection?
        if (results.length === 0) {
            break;
        }

        // Traverse documents
        for (var doc of results) {
            // Use 'bson' library to calculate document size (in bytes)
            var size = BSON.calculateObjectSize(doc);

            // Add to documents array
            documents.push({ id: doc._id.toString(), size: size });

            // Update where clause to find items with a larger ID than the current item
            whereClause._id = { $gt: doc._id };
        }

        // Log processed documents
        count += results.length;
            
        // Sort the documents array by size DESC
        documents.sort(function (first, second) {
            return second.size - first.size;
        });

        // Leave first 100 elements in the array
        documents.splice(100);

        // Log script progress
        console.log('[System]', 'Processed ' + count + ' documents');
    }

    // Return result
    return documents;
};