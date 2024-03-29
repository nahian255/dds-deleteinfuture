const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
const cors = require('cors');
require('dotenv').config();
const { ObjectId } = require('mongodb');


// this is all about exprement
// const fs = require('fs/promises');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// console.log(process.env.password);


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.gwibbgy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const properitesCollection = client.db('dreamDwell').collection('properitesInfo');
        const messageCollection = client.db('dreamDwell').collection('messageCollection');
        const bookingCollection = client.db('dreamDwell').collection('bookingProperty');


        // get all property here
        app.get('/properites', async (req, res) => {
            try {
                const items = await properitesCollection.find().toArray();
                res.send(items);
            } catch (error) {
                console.error('Error getting items:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add a property in database.
        app.post('/api/add-properties', async (req, res) => {
            try {
                const { name, email, details, image, location, price, bathrooms, rooms } = req.body;
                // Create a document to be inserted
                const propertyDocument = { name, email, details, image, location, price, bathrooms, rooms };

                // Insert a single document
                const result = await properitesCollection.insertOne(propertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add message in database.
        app.post('/api/add-message', async (req, res) => {
            try {
                const { name, email, message } = req.body;
                // Create a document to be inserted
                const propertyDocument = {
                    name,
                    email,
                    message,
                };
                // console.log(propertyDocument);
                // Insert a single document
                const result = await messageCollection.insertOne(propertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add booking data in database.
        app.post('/api/add-bookingProperty', async (req, res) => {
            try {
                const { dataId, name, details, image, email, price, bathroom, rooms, bookingConfirmed } = req.body;
                // Create a document to be inserted
                const bookingPropertyDocument = {
                    dataId, name, details, image, email, price, bathroom, rooms, bookingConfirmed
                };
                // console.log(bookingPropertyDocument);
                // Insert a single document
                const result = await bookingCollection.insertOne(bookingPropertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // get single property detials...
        app.get('/api/single-properites/:id', async (req, res) => {
            try {
                const itemId = req.params.id;
                // Check if itemId is a valid ObjectId
                if (!ObjectId.isValid(itemId)) {
                    return res.status(400).json({ error: 'Invalid ObjectID' });
                }
                const item = await properitesCollection.findOne({ _id: new ObjectId(itemId) });
                if (item) {
                    res.json(item);
                } else {
                    res.status(404).json({ error: 'Item not found' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // get booking property whith email..
        app.get('/api/booking-properites', async (req, res) => {
            try {
                const userEmail = req.query.email;

                // console.log(userEmail);
                if (!userEmail) {
                    // If email is not provided in query parameters, return a bad request response
                    return res.status(400).json({ error: 'Email parameter is missing' });
                }

                // Query the bookingProperty collection for data with the specified email
                const bookings = await bookingCollection.find({ email: userEmail }).toArray();

                res.status(200).json(bookings);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Delete add-property 
        app.delete('/api/delete-add-property/:id', async (req, res) => {
            try {
                const propertyId = req.params.id;
                console.log(propertyId);
                if (!ObjectId.isValid(propertyId)) {
                    return res.status(400).json({ error: 'Invalid ObjectID for property' });
                }
                const result = await properitesCollection.deleteOne({ _id: new ObjectId(propertyId) });
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'Property deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Property not found or deletion failed' });
                }
            } catch (error) {
                console.error('Error deleting property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Delete booking property 
        app.delete('/api/delete-booking-property/:id', async (req, res) => {
            try {
                const propertyId = req.params.id;
                console.log(propertyId);
                if (!ObjectId.isValid(propertyId)) {
                    return res.status(400).json({ error: 'Invalid ObjectID for property' });
                }
                const result = await bookingCollection.deleteOne({ _id: new ObjectId(propertyId) });
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'Property deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Property not found or deletion failed' });
                }
            } catch (error) {
                console.error('Error deleting property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // get my-property whith email..
        app.get('/api/myadded-properites', async (req, res) => {
            try {
                const userEmail = req.query.email;

                // console.log(userEmail);
                if (!userEmail) {
                    // If email is not provided in query parameters, return a bad request response
                    return res.status(400).json({ error: 'Email parameter is missing' });
                }

                // Query the bookingProperty collection for data with the specified email
                const bookings = await properitesCollection.find({ email: userEmail }).toArray();
                res.status(200).json(bookings);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);

app.get('/last', (req, res) => {
    res.send('this is another try')
})
app.get('/', (req, res) => {
    res.send('kam ar hoylo na')
})

// app.get('*', (req, res) => {
//     res.status(404).send('Not Found');
// });

app.listen(port, () => {
    console.log(`Running server well ${port}`)
})