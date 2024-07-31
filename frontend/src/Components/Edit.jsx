/* eslint-disable jsx-a11y/anchor-is-valid */

import "./GenerateQR.css";
import axios from "axios";
import { useState,useEffect } from "react";
import React from "react";
import QRCode from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useParams  } from 'react-router-dom';

export default function Edit(){
  const navigate = useNavigate();
    const [name, setName] = useState('C1-C5');
    const [date, setDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const { id } = useParams();
    const [token,setToken] = useState();


    useEffect(() => {
      const t = localStorage.getItem('token');
      setToken(t);
    }, []);
    const handleItemClick = (itemName) => {
      setName(itemName);
      setShowDropdown(false);
    };

    const registerqr = async () => {
      console.log(id);
      const resp = await axios.put("http://localhost:5000/updatedata",{name,date,quantity,id});
          console.log(resp);
          if(resp){
          navigate('/');
          console.log("updated");
          }
          else{
            alert("Wrong");
          }
    };

return(
    <div class="head">
    <header class="abc">
      <div class="ff" onClick={()=>{
        navigate('/');
      }}>Inventory Management System</div>
      <div class="abc">
      <div class="qr ff" onClick={() => navigate('/generate')}>Generate QR</div>
      <div class="ff" onClick={()=>{
        navigate('/scan')
      }}>Scan QR</div>
      </div>
      <div >
      {(token)?(<button class="bb ff" onClick={()=>{
        localStorage.removeItem('token');
        window.location.reload();
      }}>Logout</button>):(<div ><button class="bb ff" onClick={()=>{
        navigate('/signin');
      }}>Signin</button>
      <button class="bb ff" onClick={()=>{
        navigate('/Register');
      }}>Register</button></div>)}
      <button class="bb ff" onClick={()=>{
        //navigate('/signin');
      }}>Signin</button>
      </div>
    </header>
    <div class="container">
      <div class="heading">Edit</div>
      <div className="dropdown">
          <div
            className="dropbtn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {name}
          </div>
          {showDropdown && (
            <div className="dropdown-content">
              <a href="#" onClick={() => handleItemClick("C1")}>
                C1
              </a>
              <a href="#" onClick={() => handleItemClick("C2")}>
                C2
              </a>
              <a href="#" onClick={() => handleItemClick("C3")}>
                C3
              </a>
              <a href="#" onClick={() => handleItemClick("C4")}>
                C4
              </a>
              <a href="#" onClick={() => handleItemClick("C5")}>
                C5
              </a>
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
        }}
      />
      <input
        type="number"
        placeholder="Enter Quantity"
        className="input2"
        onChange={(e) => {
            setQuantity(e.target.value);
        }}
      />
      <button class="btn" onClick={registerqr} >Edit</button>
      
    </div>
  </div>
    );
}