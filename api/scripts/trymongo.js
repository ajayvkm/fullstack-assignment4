/* eslint linebreak-style: ["error", "windows"] */
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://admin:admin@fullstack-mongo-cluster-j0wnh.mongodb.net/inventory?authSource=admin&replicaSet=FullStack-Mongo-Cluster-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

function testWithCallBack(callback) {
    console.log('---- Test Call Backs ----');
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(function (err, client) {
        if (err) {
            callback(err);
            return;
        }
        console.log('Connected to MongoDB', url);

        const db = client.db();
        const collection = db.collection('products');

        const product = { id: 1, productName: 'A. Callback', price: 28, category: 'Shirt', imageUrl: 'http://yahoo.com/' };
        collection.insertOne(product, function (err, result) {
            if (err) {
                client.close();
                callback(err);
                return;
            }
            console.log('Result of insert:\n', result.insertedId);
            collection.find({ _id: result.insertedId }).toArray(function (err, documents) {
                if (err) {
                    client.close();
                    callback(err);
                    return;
                }

                console.log('Result of find:\n', documents);
                client.close();
                callback(err);
            });
        });
    });
}

testWithCallBack(function (err) {
    if (err) {
        console.log(err);
    }
    testWithAsync();
});


async function testWithAsync() {
    console.log("---- Test Call Backs ----");
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB', url);

        const db = client.db();
        const collection = db.collection('products');

        const product = { id: 2, productName: 'B. Callback', price: 33, category: 'Shirt', imageUrl: 'http://yahoo.com/' };
        const result = await collection.insertOne(product);
        console.log('Result of insert:\n', result.insertedId);

        const documents = await collection.find({ _id: result.insertedId }).toArray();
        console.log('Result of find \n', documents);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
