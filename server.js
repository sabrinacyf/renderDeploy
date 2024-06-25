//___________________
//Dependencies
//___________________
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cryptojs = require('crypto-js')
const app = express();



//Load dot env files
require("dotenv").config();

//___________________
//Environment Variables
//___________________
const PORT = process.env.PORT || 3000;
const dbUser = process.env.MONGO_DB_USER;
const dbEncryptedPass = process.env.MONGO_DB_PASS;
const hostName = process.env.MONGO_DB_HOST;
const dbName = process.env.MONGO_DB_NAME;

//decrypt pass

const encryptionKey = process.env.ENCRYPTION_KEY;
const bytes = cryptojs.AES.decrypt(dbEncryptedPass, encryptionKey);
const dbPass = bytes.toString(cryptojs.enc.Utf8)
//___________________
//Database
//___________________
//Generate mongo connection URI by reading parameters from dot env
const mongoURI = `mongodb+srv://${dbUser}:${dbPass}@${hostName}/${dbName}`;
// const mongoURI = "mongodb + srv://sabrinachua:Ssab0514@mongodb-cluster.ugi1kuz.mongodb.net/mongoose_store"
console.log(mongoURI);
//connect to this database
//... and then farther down the file
// Establish a connection to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('The connection with MongoDB is established');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


//___________________
//Controllers
//___________________
//Step 1/3 require the controller to be able to use the products routes
const productsController = require("./controllers/products");

//___________________
//Middleware
//___________________
app.use(express.static("public"));

app.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings

//Step 2/3 app.use this controller and when `/products` is visted
//Note, step 3 is in controllers/products.js
app.use("/products", productsController);

//___________________
// Routes
//___________________
//localhost:3000  - this will reroute to `products`
app.get("/", (req, res) => {
  res.redirect("/products");
});

//___________________
//Listener
//___________________
app.listen(PORT, () =>
  console.log("Hurry! Last chance to buy amazing items on port", PORT)
);
