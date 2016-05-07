var monk = require('monk');
var bson = require('bson');
var wrap = require('co-monk');
var BSON = new bson.BSONPure.BSON();

exports.findLargestDocuments = function* (config) {
    // Initialize DB connection
    var db = monk(config.db);
    var collection = wrap(db.get(config.collectionName));

    // Collection offset
    var skip = 0;

    // Array that will contain all documents and their sizes
    var documents = [];

    // Run forever, until no more documents are returned
    while (true) {
        // Get batch of documents
        var results = yield collection.find({}, { limit: config.batchSize, skip: skip });

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
        }

        // Skip the documents that we processed in the next iteration
        skip += results.length;
        
        // Log script progress
        console.log('[System]', 'Processed ' + skip + ' documents');
    }

    // Sort the documents array by size DESC
    documents.sort(function (first, second) {
        return second.size - first.size;
    });

    // Limit output to top X largest documents
    documents.splice(0, config.outputTopXLargest);

    // Return result
    return documents;
};