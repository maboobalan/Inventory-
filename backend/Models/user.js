const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

// Transaction schema
const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  quantity: { type: Number, required: true },
  taxPercentage: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  grossTotal: { type: Number, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// User schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

// Validation function for user registration
const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { Product, Transaction, User, validate };