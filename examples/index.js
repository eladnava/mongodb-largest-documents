// Change to 'mongodb-largest-documents' to use this code outside of the package
var mongodbLargestDocuments = require('../');

// Configure task here
var config = {
    // MongoDB connection string
    db: 'localhost/test',
    // Name of collection to inspect
    collectionName: 'users',
    // Process X items every iteration
    batchSize: 100,
    // Limit output to X largest documents
    outputTopXLargest: 100
};

// Run the module
mongodbLargestDocuments(config, function (err, result) {
    // Handle errors
    if (err) {
        return console.log(err);
    }
    
    // Print largest documents to console
    console.log('Largest documents:', result);
});