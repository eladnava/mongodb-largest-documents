// Change to 'mongodb-largest-documents' to use this code outside of the package
const mongodbLargestDocs = require('../');

const config = {
    url: 'mongodb://localhost:27017', // MongoDB connection string
    dbName: 'test',                   // MongoDB Database name
    collectionName: 'users',          // MongoDB Collection name
    batchSize: 100,                   // Process X items every iteration
    outputTopXLargest: 100,           // Limit output to Y largest documents
    skip: 0,                          // Skip the firsts Z documents
};

function formatOutput (documents) {
  return documents.map(doc => `- ObjectId("${doc.id}"): ${doc.prettySize}`).join('\n');
}

mongodbLargestDocs(config)
  .then(docs => console.log('[System]', 'Largest documents:\n' + formatOutput(docs)))
  .catch(err => console.error(err));
