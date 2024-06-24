const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5dbzkti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//"mongodb+srv://<username>:<password>@cluster0.5dbzkti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    // await client.connect();

    const users = client.db("usersDB").collection("users");
    const arts = client.db("artsDB").collection("arts");

    // arts api

    app.get("/arts", async (req, res) => {
      const results = await arts.find().toArray();
      res.send(results);
    });

    app.get("/arts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await arts.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/arts/filter/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const results = await arts.find(query).toArray();
      res.send(results);
    });

    app.post("/arts/new", async (req, res) => {
      const newArt = req.body;
      const result = await arts.insertOne(newArt);
      res.send(result);
    });

    // end of arts api

    // users api
    app.get("/users", async (req, res) => {
      const results = await users.find().toArray();
      res.send(results);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const results = await users.findOne({ email: email });
      res.send(results);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await users.findOne(query);
      res.send(user);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await users.findOne(query);
      res.send(user);
    });

    app.put("/users/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = req.body;
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
          gender: user.gender,
          status: user.status,
        },
      };
      const options = { upsert: true };
      const result = await users.updateOne(query, updatedUser, options);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await users.insertOne(user);
      res.send(result);
    });

    app.delete("users/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await users.deleteOne(query);
      res.send(result);
    });
    // end of users api
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${port}`);
});
