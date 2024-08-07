import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import "../Styles/AddProduct.css"; 

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3200/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find(p => p._id === productId);
    setSelectedProduct(product);
    setQuantity(0); // Reset quantity when product changes
    setTaxPercentage(0); // Reset tax percentage when product changes
    setTaxAmount(0); // Reset tax amount when product changes
    setGrossTotal(0); // Reset gross total when product changes
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleTaxPercentageChange = (event) => {
    setTaxPercentage(Number(event.target.value));
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

    const rate = selectedProduct.rate;
    const taxAmt = (quantity * rate) * (taxPercentage / 100);
    const grossAmt = (quantity * rate) + taxAmt;
    setTaxAmount(taxAmt);
    setGrossTotal(grossAmt);
    setErrorMessage(''); // Clear any previous errors
  };

  const handleAddProduct = () => {
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

    const newProduct = {
      productCode: selectedProduct.code,
      name: selectedProduct.name,
      quantity,
      rate: selectedProduct.rate,
      taxPercentage,
      taxAmount,
      grossTotal
    };

    console.log('Payload to be sent:', newProduct);

    axios.post('http://localhost:3200/api/transactions', newProduct)
      .then(response => {
        setProductList([...productList, newProduct]);
        // Reset form
        setQuantity(0);
        setTaxPercentage(0);
        setTaxAmount(0);
        setGrossTotal(0);
        setSelectedProduct(null);
        setSuccessMessage('Product Added Successfully!');
        setErrorMessage(''); // Clear any previous errors
        setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
      })
      .catch(error => {
        console.error('Error adding product:', error.response ? error.response.data : error.message);
        setErrorMessage('Error adding product. Please try again.');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  return (
    <div className="container">
      <h1 className="page-title">Add Product</h1>
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
      <form className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ProdName"><strong>Product Name:</strong></label>
            <select className="form-control" id="ProdName" onChange={handleProductChange} value={selectedProduct ? selectedProduct._id : ''}>
              <option value="">Select a Product Name</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="Qty"><strong>Qty:</strong></label>
            <input type="number" className="form-control" id="Qty" value={quantity} onChange={handleQuantityChange} placeholder="Enter quantity" />
          </div>
          <div className="form-group">
            <label htmlFor="Rate"><strong>Rate:</strong></label>
            <input type="number" className="form-control" id="Rate" value={selectedProduct ? selectedProduct.rate : ''} readOnly placeholder="Rate will appear automatically" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="TaxPercentage"><strong>Tax Percentage:</strong></label>
            <input type="number" className="form-control" id="TaxPercentage" value={taxPercentage} onChange={handleTaxPercentageChange} placeholder="Enter tax percentage" />
          </div>
          <div className="form-group">
            <label htmlFor="TaxAmount"><strong>Tax Amount:</strong></label>
            <input type="number" className="form-control" id="TaxAmount" value={taxAmount} readOnly placeholder="Tax amount" />
          </div>
          <div className="form-group">
            <label htmlFor="GrossTotal"><strong>Gross Total:</strong></label>
            <input type="number" className="form-control" id="GrossTotal" value={grossTotal} readOnly placeholder="Gross total" />
          </div>
        </div>
        <div className="form-buttons">
          <button type="button" className="btn btn-outline-secondary" onClick={calculateValues}>Calculate</button>
          <button type="button" className="btn btn-outline-success" onClick={handleAddProduct}>Add Product</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
