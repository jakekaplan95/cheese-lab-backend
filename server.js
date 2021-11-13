// DEPENDENCIES
require("dotenv").config();
const { PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");


// DATABASE CONNECTION
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// connection events
mongoose.connection
    .on("open", () => console.log("Mongoose connected"))
    .on("close", () => console.log("Mongoose disconnected"))
    .on("error", (error) => console.log("error"));

// MODELS
const cheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", cheeseSchema);

// MIDDLEWARE
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());



// ROUTES

// Test Route
app.get("/", (req, res) => {
    res.send("hello world")
});

// Index
app.get("/cheese", async (req, res) => {
    try {
      res.json(await Cheese.find({}));
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // Create
  app.post("/cheese", async (req, res) => {
    try {
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // Update
  app.put("/cheese/:id", async (req, res) => {
    try {
      res.json(
        await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // Delete
  app.delete("/cheese/:id", async (req, res) => {
    try {
      res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json({ error });
    }
  });



// LISTENER

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
