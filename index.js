const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dkuqjjn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const categoriesCollection = client
            .db("resellerHub")
            .collection("categories");

        const productsCollection = client
            .db("resellerHub")
            .collection("products");

        const usersCollection = client
            .db("resellerHub")
            .collection("users");

        const bookingsCollection = client
            .db("resellerHub")
            .collection("bookings");

        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })

        // get all products

        app.get("/products", async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });
        // get products by category

        app.get("/products/:category", async (req, res) => {
            const query = { category: req.params.category };
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // get users

        app.get("/users", async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        //  delete users

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            //console.log(id);
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });

        // single product

        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        });
        // booking post

        app.post("/bookings", async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        // post product

        app.post("/add-a-product", async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        // get my products api

        app.get("/my-products/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const result = await productsCollection.find(filter).toArray();
            res.send(result);
        });

        // delete product api

        app.delete("/my-products/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        });

        // get my order api

        app.get("/my-orders/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const result = await bookingsCollection
                .find(filter)
                .sort({ _id: -1 })
                .toArray();
            res.send(result);
        });


    } finally { }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});