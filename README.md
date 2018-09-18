# mongodb-largest-documents
[![npm version](https://badge.fury.io/js/mongodb-largest-documents.svg)](https://www.npmjs.com/package/mongodb-largest-documents)

A simple Node.js script that finds the top X largest documents in a given MongoDB collection.

* Scalable - can work with any collection size
* Fast - utilizes [range-based pagination](https://docs.mongodb.com/manual/reference/method/cursor.skip/#cursor-skip) for fast table scanning
* Easy - simply provide the MongoDB connection string and the db and collection names

## Preview

![Preview](https://raw.github.com/eladnava/mongodb-largest-documents/master/assets/preview.png)

## Requirements

* A MongoDB database
* Node.js v8.x+ for async/await

## Usage

First, install the package using npm:

```shell
npm install mongodb-largest-documents --save
```

Then, use the following code to find the top 100 largest documents in a given collection, modifying the `config` variable accordingly:

```js
const mongodbLargestDocuments = require('mongodb-largest-documents');

const config = {
    url: 'mongodb://localhost:27017', // MongoDB connection string
    dbName: 'test',                   // MongoDB Database name
    collectionName: 'users',          // MongoDB Collection name
    batchSize: 100,                   // Process X items every iteration
    outputTopXLargest: 100,           // Limit output to Y largest documents
    skip: 0,                          // Skip the firsts Z documents
};

function formatOutput (documents) {
  return documents.map(doc => `- ObjectId("${doc.id}"): ${doc.prettySize} = ${doc.size} Bytes`).join('\n');
}

mongodbLargestDocuments(config)
  .then(docs => console.log('Largest documents:\n' + formatOutput(docs)))
  .catch(err => console.error(err));

```

Run the script and watch the console for progress - it will invoke your callback when it traverses the entire collection.

## License

Apache 2.0
