import "./GenerateQR.css";
import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function GenerateQR() {
  const navigate = useNavigate();
  const [name, setName] = useState('C1-C5');
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [token, setToken] = useState();
  const [errors, setErrors] = useState({}); // For storing validation errors

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

  const handleItemClick = (itemName) => {
    setName(itemName);
    setShowDropdown(false);
  };

  const validateInputs = () => {
    const errors = {};
    if (!name || name === 'C1-C5') errors.name = "Please select a valid name.";
    if (!date) errors.date = "Date is required.";
    if (date && new Date(date) > new Date()) errors.date = "Date cannot exceed today's date.";
    if (!quantity || isNaN(quantity) || quantity <= 0) errors.quantity = "Please enter a valid quantity.";
    return errors;
  };

  const registerqr = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Combine the data to generate the QR code
    const qr = `${name}${date}${quantity}`;
    try {
      const resp = await axios.post("http://localhost:5000/inventory", { name, date, quantity, qr });
      console.log(resp);
      if (resp) {
        navigate('/');
        console.log("added");
      } else {
        alert("Wrong");
      }
    } catch (error) {
      console.error("Error registering QR:", error);
      alert("An error occurred while registering the QR.");
    }
  };

  return (
    <div className="head">
      <header className="abc">
        <div className="ff" onClick={()=>{
          navigate('/');
        }}>Inventory Management System</div>
        <div className="abc">
          <div className="qr ff">Generate QR</div>
          <div className="ff" onClick={()=>{
            navigate('/scan')
          }}>Scan QR</div>
        </div>
        {token ? (
          <button
            className="bb ff"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            Logout
          </button>
        ) : (
          <div>
            <button className="bb ff" onClick={() => navigate('/signin')}>
              Signin
            </button>
            <button className="bb ff" onClick={() => navigate('/Register')}>
              Register
            </button>
          </div>
        )}
      </header>
      <div className="container">
        <div className="heading">Generate QR</div>
        <div className="dropdown">
          <div
            className="dropbtn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {name}
          </div>
          {showDropdown && (
            <div className="dropdown-content">
              <a href="#" onClick={() => handleItemClick("C1")}>C1</a>
              <a href="#" onClick={() => handleItemClick("C2")}>C2</a>
              <a href="#" onClick={() => handleItemClick("C3")}>C3</a>
              <a href="#" onClick={() => handleItemClick("C4")}>C4</a>
              <a href="#" onClick={() => handleItemClick("C5")}>C5</a>
            </div>
          )}
        </div>
        <input
          type="date"
          placeholder="Select Date"
          className="input2"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, date: '' })); // Clear date error
          }}
        />
        {errors.date && <div className="error">{errors.date}</div>}
        
        <input
          type="number"
          placeholder="Enter Quantity"
          className="input2"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, quantity: '' })); // Clear quantity error
          }}
        />
        {errors.quantity && <div className="error">{errors.quantity}</div>}
        
        <button className="btn" onClick={registerqr}>Generate QR</button>
      </div>
    </div>
  );
}
