// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiPencilLine, RiDeleteBinLine} from 'react-icons/ri';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import "../Styles/Main.css";
import "../Styles/ProList.css";

function ProductList() {
  const [transactions, setTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3200/api/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setErrorMessage('Error fetching transactions');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    };

    fetchTransactions();
  }, []);

  const handleEdit = (transaction) => {
    setSelectedProduct(transaction);
    setQuantity(transaction.quantity);
    setTaxPercentage(transaction.taxPercentage);
    setTaxAmount(transaction.taxAmount);
    setGrossTotal(transaction.grossTotal);
    setShowEditModal(true);
  };
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3200/api/transactions/${productId}`);
      setTransactions(transactions.filter(transaction => transaction._id !== productId));
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Error deleting product');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) {
      setErrorMessage('Please select a product.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (quantity <= 0) {
      setErrorMessage('Quantity must be greater than zero.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (taxPercentage < 0) {
      setErrorMessage('Tax percentage cannot be negative.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const rate = selectedProduct.rate || 0; // Ensure rate is defined or default to 0
    const taxAmt = (quantity * rate) * (taxPercentage / 100);
    const grossAmt = (quantity * rate) + taxAmt;

    const updatedProduct = {
      ...selectedProduct,
      quantity,
      taxPercentage,
      taxAmount: taxAmt,
      grossTotal: grossAmt
    };

    try {
      const response = await axios.put(`http://localhost:3200/api/transactions/${selectedProduct._id}`, updatedProduct);
      const updatedProductData = response.data;
      setTransactions(transactions.map(transaction =>
        transaction._id === updatedProductData._id ? updatedProductData : transaction
      ));
      setSuccessMessage('Product updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowEditModal(false);
      // Reset form
      setSelectedProduct(null);
      setQuantity(0);
      setTaxPercentage(0);
      setTaxAmount(0);
      setGrossTotal(0);
    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
      setErrorMessage('Error updating product. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const calculateValues = () => {
    if (!selectedProduct) {
      setErrorMessage('Please select a product.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (quantity <= 0) {
      setErrorMessage('Quantity must be greater than zero.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (taxPercentage < 0) {
      setErrorMessage('Tax percentage cannot be negative.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const rate = selectedProduct.rate || 0; // Ensure rate is defined or default to 0
    const taxAmt = (quantity * rate) * (taxPercentage / 100);
    const grossAmt = (quantity * rate) + taxAmt;
    setTaxAmount(taxAmt);
    setGrossTotal(grossAmt);
    setErrorMessage(''); // Clear any previous errors
  };

  return (
    <div className="container">
      <h1 className="page-title">Product List</h1>
      {successMessage && (
        <Alert variant="success" className="success-message">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" className="error-message">
          {errorMessage}
        </Alert>
      )}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>So.N</th>
              <th>Product Name</th>
              <th>Rate</th>
              <th>Quantity</th>
              <th>Tax Percentage</th>
              <th>Tax Amount</th>
              <th>Gross Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction._id}>
                <td>{index + 1}</td>
                <td>{transaction.name}</td>
                <td>{transaction.rate}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.taxPercentage}</td>
                <td>{transaction.taxAmount}</td>
                <td>{transaction.grossTotal}</td>
                <td>
                  <button onClick={() => handleEdit(transaction)} className="btn btn-outline-primary">
                    <RiPencilLine className="icon" /> Update
                  </button>
                  <button onClick={() => handleDelete(transaction._id)} className="btn btn-outline-danger">
                    <RiDeleteBinLine className="icon" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label><strong>Product Name:</strong></Form.Label>
              <Form.Control 
                as="select" 
                value={selectedProduct ? selectedProduct._id : ''} 
                onChange={(e) => {
                  const transaction = transactions.find(t => t._id === e.target.value);
                  setSelectedProduct(transaction);
                  setQuantity(transaction ? transaction.quantity : 0); // Reset quantity when product changes
                  setTaxPercentage(transaction ? transaction.taxPercentage : 0); // Reset tax percentage when product changes
                  setTaxAmount(transaction ? transaction.taxAmount : 0); // Reset tax amount when product changes
                  setGrossTotal(transaction ? transaction.grossTotal : 0); // Reset gross total when product changes
                }}
              >
                <option value=""><strong>Select a Product Name</strong></option>
                {transactions.map(transaction => (
                  <option key={transaction._id} value={transaction._id}>{transaction.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label><strong>Quantity:</strong></Form.Label>
              <Form.Control 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                placeholder="Enter quantity" 
              />
            </Form.Group>
            <Form.Group controlId="formRate">
              <Form.Label><strong>Rate:</strong></Form.Label>
              <Form.Control 
                type="number" 
                value={selectedProduct ? selectedProduct.rate : 0} 
                readOnly 
                placeholder="Rate will appear automatically" 
              />
            </Form.Group>
            <Form.Group controlId="formTaxPercentage">
              <Form.Label><strong>Tax Percentage:</strong></Form.Label>
              <Form.Control 
                type="number" 
                value={taxPercentage} 
                onChange={(e) => setTaxPercentage(Number(e.target.value))} 
                placeholder="Enter tax percentage" 
              />
            </Form.Group>
            <Form.Group controlId="formTaxAmount">
              <Form.Label><strong>Tax Amount:</strong></Form.Label>
              <Form.Control 
                type="number" 
                value={taxAmount} 
                readOnly 
                placeholder="Tax amount" 
              />
            </Form.Group>
            <Form.Group controlId="formGrossTotal">
              <Form.Label><strong>Gross Total:</strong></Form.Label>
              <Form.Control 
                type="number" 
                value={grossTotal} 
                readOnly 
                placeholder="Gross total" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button variant="outline-secondary" onClick={calculateValues}>Calculate</Button>
          <Button variant="outline-primary" onClick={handleUpdateProduct}>Update Product</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductList;