//___________________
//Dependencies
//___________________
//require express so we can use router
const express = require("express");
const products = express.Router();

//___________________
//Models
//___________________
//get access to the Product model
const Product = require("../models/products");

//___________________
//See json Route
//___________________
products.get("/json", (req, res) => {
  Product.find()
    .then((products) => {
      res.send(products);
    })
    .catch((error) => {
      console.log(error);
    });
});

//___________________
//7 Restful Routes
//___________________
// Index  : GET    '/products'          1/7
// Show   : GET    '/products/:id'      2/7
// New    : GET    '/prodcuts/new'      3/7
// Create : POST   '/products'          4/7
// Edit   : GET    '/products/:id/edit' 5/7
// Update : PUT    '/products/:id'      6/7
// Delete : DELETE '/products/:id'      7/7

// Index  : GET    '/products'          1/7
products.get("/", (req, res) => {
  Product.find()
    .then((products) => {
      res.render("./products/index.ejs", { products });
    })
    .catch((error) => {
      console.log(error);
    });
});

// New    : GET    '/products/new'      3/7
// Order matters! must be above /prodcuts/:id or else this route will never get hit
products.get("/new", (req, res) => {
  res.render("./products/new.ejs");
});

// Show   : GET    '/products/:id'      2/7
products.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.render("./products/show.ejs", { product: product });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Create : POST   '/products'          4/7
products.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      res.redirect("/products/" + product.id);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Edit   : GET    '/products/:id/edit' 5/7
products.get("/:id/edit", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.render("./products/edit.ejs", { product: product });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Update : PUT    '/products/:id'      6/7
products.put("/:id", (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((product) => {
      res.redirect("/products/" + product.id);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Delete : DELETE '/products/:id'      7/7
products.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      res.redirect("/products");
    })
    .catch((error) => {
      console.log(error);
    });
});

//___________________
//Buy Route
//___________________

products.put("/:id/buy", (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { $inc: { qty: -1 } })
    .then((product) => {
      res.redirect("back");
    })
    .catch((error) => {
      console.log(error);
    });
});

//___________________
//ALTERNATE Seed Route - Vist ONCE to populate database
//___________________
const productSeeds = require("../models/seed.js");
products.get("/seed/newproducts/viaseedfile", (req, res) => {
  Product.insertMany(productSeeds)
    .then((products) => {
      res.send(products);
    })
    .catch((error) => {
      console.log(error);
    });
});

//___________________
//Mistakes happen! Drop Database - Vist ONCE to drop your database. WARNING! YOU CANNOT UNDO THIS!
//___________________
products.get(
  "/dropdatabase/cannotundo/areyoursure/reallysure/okthen",
  (req, res) => {
    Product.collection.drop();
    res.send("You did it! You dropped the database!");
  }
);

//___________________
//Module Exports - access this file in server.js
//___________________
//Export router AND require it in server.js Step 3/3
//Note all three need to be working in order to get server runnning
module.exports = products;
