require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Product, Transaction } = require("./Models/user.js");
const connection = require("./db.js");
const userRoutes = require("./routes/users.js");
const authRoutes = require("./routes/auth.js");

const app = express();
const port = process.env.PORT || 3200;

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Home route
app.get('/', (req, res) => {
  res.send('<h1 style="color:red">Product Sale</h1>');
});

// User and Auth routes
app.use("/api/register", userRoutes);
app.use("/api/login", authRoutes);

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Transactions API
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/transactions', async (req, res) => {
  const { name, quantity, rate, taxPercentage, taxAmount, grossTotal } = req.body;

  const transaction = new Transaction({
    name,
    quantity,
    rate,
    taxPercentage,
    taxAmount,
    grossTotal,
  });

  try {
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  console.log('PUT request received for ID:', req.params.id);
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      console.log('Transaction not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    Object.assign(transaction, req.body);
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.log('Error during transaction update:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));