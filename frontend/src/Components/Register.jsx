// src/LoginPage.js

import React from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
          navigate('/signin');
        }}>Signin</button>
        </div>
      </header>
      <div class="container">
        <div class="heading">Register</div>
        <div>Welcome! Register to Continue</div>
        <input type="text" placeholder="Name" class="input" onChange={e => {
          setName(e.target.value);
        }}/>
        <input type="text" placeholder="Email" class="input" onChange={e => {
          setEmail(e.target.value);
        }}/>
        <input type="password" placeholder="Password" class="input" onChange={e => {
          setPass(e.target.value);
        }}/>
        <button class="btn" onClick={async()=>{
          const resp = await axios.post("http://localhost:5000/signup",{name,email,password});
          console.log(resp);
          if(resp){
          localStorage.setItem("token", resp.data.token);
          navigate('/signin');
          console.log("Registered");
          }
          else{
            alert("Wrong Username or Password");
          }
        }} >Register</button>
        <div class="font">Already Have an Account? <span onClick={()=>{
          navigate('/signin');
        }}>Signin</span></div>
      </div>
    </div>
  );
};

export default Register;
