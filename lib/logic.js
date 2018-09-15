const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const BSON = require('bson-ext');
const bson = new BSON([BSON.Binary, BSON.Code, BSON.DBRef, BSON.Decimal128, BSON.Double, BSON.Int32, BSON.Long, BSON.Map, BSON.MaxKey, BSON.MinKey, BSON.ObjectId, BSON.BSONRegExp, BSON.Symbol, BSON.Timestamp]);

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

exports.findLargestDocuments = async function (config) {
    // Initialize DB connection
    const client = await MongoClient.connect(config.url); //, {useNewUrlParser: true});
    const col = client.db(config.dbName).collection(config.collectionName);

    let count = 0; // Keep track of processed documents for progress log
    let documents = []; // Array that will contain all documents and their sizes
    let whereClause = {}; // Default query where clause is blank, populate it with last document ID later on
    let results;

    if (config.skip) {
      doc = await col.findOne(whereClause, {skip: config.skip - 1, sort: {_id: 1}});
      whereClause._id = { $gt: doc._id };
      count = config.skip;
    }

    while (true) {
        // Get batch of documents
        try {
          results = await col.find(whereClause, {limit: config.batchSize, sort: {_id: 1}}).toArray();
        } catch (e) {
          console.error('[System]', `Error fetching ${config.batchSize} documents with clause`, whereClause, `skipping these ${config.batchSize} documents`, e);
          results = await col.find(whereClause, {limit: config.batchSize, skip: config.batchSize, sort: {_id: 1}}).toArray();
        }
        // Reached end of collection?
        if (results.length === 0) {
            break;
        }

        // Traverse documents
        for (let doc of results) {
            // Use 'bson' library to calculate document size (in bytes)
            let size = bson.calculateObjectSize(doc);

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

        // Leave first X elements in the array
        documents = documents.slice(0, config.outputTopXLargest);

        // Log script progress
        console.log('[System]', `Processed ${count} documents. Highest: ${documents[0].id} => ${formatBytes(documents[0].size)}`);
    }

    return documents.map(doc => {
      doc.pretty = formatBytes(doc.size);
      return doc;
    });
};
