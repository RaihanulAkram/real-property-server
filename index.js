const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rb0vh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    const apartmentsCollection = client.db("realProperties").collection("apartments");

    const ordersCollection = client.db("realProperties").collection("orders");

    const reviewCollection = client.db("realProperties").collection("review");

    const usersCollection = client.db("realProperties").collection("users");

    //add apartmentsCollection
    app.post("/addApartments", async (req, res) => {
        console.log(req.body);
        const result = await apartmentsCollection.insertOne(req.body);
        res.send(result);
    });

    // get all apartments
    app.get("/allApartments", async (req, res) => {
        const result = await apartmentsCollection.find({}).toArray();
        res.send(result);
    });

    app.get("/singleApartments/:id", async (req, res) => {
        console.log(req.params.id);
        const result = await apartmentsCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray();
        res.send(result[0]);
        console.log(result);
    });

    // insert order in database

    app.post("/addOrders", async (req, res) => {
        const result = await ordersCollection.insertOne(req.body);
        res.send(result);
    });

    //  my orders

    app.get("/myOrders/:email", async (req, res) => {
        console.log(req.params.email);
        const result = await ordersCollection
            .find({ email: req.params.email })
            .toArray();
        res.send(result);
    });

    // delete order
    app.delete("/deleteOrder/:id", async (req, res) => {
        console.log(req.params.id)
        const result = await ordersCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
        console.log(result)
    });

    // add a review

    app.post("/addReview", async (req, res) => {
        const result = await reviewCollection.insertOne(req.body);
        res.send(result);
    });

    // get all review
    app.get("/allReview", async (req, res) => {
        const result = await reviewCollection.find({}).toArray();
        console.log(result)
        res.send(result);
    });


    // add a user
    app.post("/addUserInfo", async (req, res) => {
        console.log("req.body");
        const result = await usersCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
    });
    // //  make admin

    app.put("/makeAdmin", async (req, res) => {
        const filter = { email: req.body.email };
        const result = await usersCollection.find(filter).toArray();
        if (result) {
            const documents = await usersCollection.updateOne(filter, {
                $set: { role: "admin" },
            });
            console.log(documents);
        }
    });

    // check admin or not
    app.get("/isAdmin/:email", async (req, res) => {
        const result = await usersCollection
            .find({ email: req.params.email })
            .toArray();
        console.log(result);
        res.send(result);
    });

    // all order
    app.get("/allOrders", async (req, res) => {
        const result = await ordersCollection.find({}).toArray();
        res.send(result);
    });

    // status update

    app.put("/statusUpdate/:id", async (req, res) => {
        const filter = { _id: ObjectId(req.params.id) };
        console.log(req.params.id);
        const result = await ordersCollection.updateOne(filter, {
            $set: {
                status: req.body.status,
            },
        });
        res.send(result);
        console.log(result);
    });
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})