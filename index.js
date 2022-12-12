const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
// const stripe = require("stripe")(process.env.STRIPE_SK);
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho0d8c2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const CategoryCollection = client.db('myknot').collection('categories');
        const educationsCollection = client.db('myknot').collection('educations');
        const usersCollection = client.db('myknot').collection('users');
        // const bookingsCollection = client.db('productCategory').collection('bookings');
        // const paymentsCollection = client.db('productCategory').collection('payments');
        // const advertiseCollection = client.db('productCategory').collection('advertise');
        // const reportedCollection = client.db('productCategory').collection('reported');

        app.get('/category', async (req, res) => {
            const query = {};
            const result = await CategoryCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/categoryData/:categoryID', async (req, res) => {
            const id = req.params.categoryID;
            const query = { category_id: parseInt(id) };
            const result = await educationsCollection.find(query).toArray();
            res.send(result);
        })

        
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = {
                email: user.email,
                value: user.value    
            }
            const alreadySignup = await usersCollection.find(query).toArray();
            if (alreadySignup.length) {
                return res.send({ acknowledged: false });
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        
    }
    finally {

    }
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('myknot server is running')
})

app.listen(port, () => {
    console.log(`myknot listening on port ${port}`)
});