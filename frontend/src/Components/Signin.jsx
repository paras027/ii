// src/LoginPage.js

import React from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');

  return (
    <div class="head">
      <header class="abc">
        <div class="ff">Inventory Management System</div>
        <div class="abc">
        <div class="qr ff">Generate QR</div>
        <div class="ff">Scan QR</div>
        </div>
        <div >
        <button class="bb ff" onClick={()=>{
          navigate('/Register');
        }}>Register</button>
        </div>
      </header>
      <div class="container">
        <div class="heading">Signin</div>
        <div>Welcome! Signin to Continue</div>
        <input type="text" placeholder="Email" class="input" onChange={e => {
          setEmail(e.target.value);
        }}/>
        <input type="password" placeholder="Password" class="input" onChange={e => {
          setPass(e.target.value);
        }}/>
        <button class="btn" onClick={async()=>{
          const resp = await axios.post("http://localhost:5000/signin",{email,password});
          if(resp){
          localStorage.setItem("token", resp.data.token);
          navigate('/');
          console.log("logged in successfully");
          }
          else{
            alert("Wrong Username or Password");
          }
        }}>Signin</button>
        <div class="font">Already Have an Account? <span onClick={()=>{
          navigate('/Register');
        }}>Register</span></div>
      </div>
    </div>
  );
};

export default Signin;
