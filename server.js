const express = require("express");
const app = express();
const { resolve } = require("path");
const port = process.env.PORT || 3000;

// importing the dotenv module to use environment variables:
require("dotenv").config();

const api_key = process.env.SECRET_KEY;
const stripe = require("stripe")(api_key);

// ------------ Imports & necessary things here ------------

// Setting up the static folder:
app.use(express.static(resolve(__dirname, process.env.STATIC_DIR)));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route to serve index.html
app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

// Routes for success and cancel pages
app.get("/success", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/success.html");
  res.sendFile(path);
});

app.get("/cancel", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/cancel.html");
  res.sendFile(path);
});

// Workshop pages
app.get("/workshop1", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/workshops/workshop1.html");
  res.sendFile(path);
});
app.get("/workshop2", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/workshops/workshop2.html");
  res.sendFile(path);
});
app.get("/workshop3", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/workshops/workshop3.html");
  res.sendFile(path);
});

// Creating a checkout session
const domainURL = process.env.DOMAIN;
app.post("/create-checkout-session/:pid", async (req, res) => {
  const priceId = req.params.pid;
  
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${domainURL}/success?id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/cancel`,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    // allowing the use of promo-codes:
    allow_promotion_codes: true,
  });

  res.json({
    id: session.id,
  });
});

// Server listening:
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port: ${port}`);
  console.log(`You may access your app at: ${domainURL}`);
});

