# mongodb-largest-documents
[![npm version](https://badge.fury.io/js/mongodb-largest-documents.svg)](https://www.npmjs.com/package/mongodb-largest-documents)

A simple Node.js script that finds the top X largest documents in a given MongoDB collection.

## Requirements

* A MongoDB database
* Node.js v4.x+ for ES6 generators support

## Usage

First, install the package using npm:

```shell
npm install mongodb-largest-documents --save
```

Then, use the following code to find the top 100 largest documents in a given collection, modifying the `config` variable accordingly:

```js
var mongodbLargestDocuments = require('mongodb-largest-documents');

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
```

Run the script and watch the console for progress - it will invoke your callback when it traverses the entire collection.

## License

Apache 2.0
