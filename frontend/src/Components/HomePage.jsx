// src/LoginPage.js

import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect, useRef } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPen,faTrash} from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  const qrCodeRef = useRef();
  const navigate = useNavigate();
  const [val,setVal] = useState([]);
  const [token,setToken] = useState();
  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    const fetchData = async () => {
      const data = await getdata();
      console.log( data);
      setVal(data);
    };

    fetchData();
  }, []);

  async function getdata(){
    const response = await axios.get('http://localhost:5000/inventorydata');
    console.log("value 1 :" +response.data.val);
    return response.data.val;
  }

  const handleDownload = () => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'qrcode.png';
    link.click();
  };
  return (
    <div class="head">
      <header class="abc">
        <div class="ff" onClick={()=>{
          navigate('/');
        }}>Inventory Management System</div>
        <div class="abc">
        <div class="qr ff" onClick={()=>{
            navigate('/generate');
  
        }}>Generate QR</div>
        <div class="ff" onClick={()=>{
          navigate('/scan');
        }}>Scan QR</div>
        </div>
        
        {(token)?(<button class="bb ff" onClick={()=>{
          localStorage.removeItem('token');
          window.location.reload();
        }}>Logout</button>):(<div ><button class="bb ff" onClick={()=>{
          navigate('/signin');
        }}>Signin</button>
        <button class="bb ff" onClick={()=>{
          navigate('/Register');
        }}>Register</button></div>)}
        
        
      </header>
      <div class="border">
      <div class="container2 abc2">
        <div>Name</div>
        <div>Date Received/Quantity</div>
        <div>Date Dispatched/Quantity</div>
        <div>Pending Items</div>
        <div>Status</div>
        <div>QR Code(Click to download)</div>
        <div>Admin Panel</div>
        </div> 
        {val.map((items,index)=>(
          <div class="container2 abc3">
            <div class="alone1">{items.name}</div>
            <div class="alone2">{items.DateReceived}/{items.BalanceItems}</div>
            <div class="alone3">{(items.DateDispatched)?items.DateDispatched: " --- " }</div>
            <div class="alone4 al">{items.BalanceItems}</div>
            <div class="alone5">{items.status}</div>
            <div ref={qrCodeRef}>
            <QRCode value={items.QRcode} size={130} level="H" onClick={handleDownload}/>
            </div>
            <div class="icons">
            <div class="alone7" onClick={async()=>{
              const id = items._id;
              if(token){
                console.log(id);
                navigate(`/edit/${id}`);
              }
              else{
                alert("Login to Edit");
              }
            }}><FontAwesomeIcon icon={faPen} /></div>
            <div class="alone7" onClick={async()=>{

              const id = items._id;
              if(token){
                try {
                  const response = await axios.delete(`http://localhost:5000/deleteitem/${id}`);
                  console.log(response.data); // Handle success response
                  window.location.reload();
                } catch (error) {
                  console.error('Error deleting item:', error); // Handle error response
                }
              }
              else{
                alert("Login to Edit");
              }
            }}><FontAwesomeIcon icon={faTrash} /></div>
            </div>
          </div>
          ))}
          
        
        
      </div>
    </div>
  );
};

export default HomePage;
