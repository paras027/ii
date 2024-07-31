import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './Components/Signin';
import Register from './Components/Register';
import HomePage from './Components/HomePage';
import GenerateQR from './Components/GenerateQR';
import Scanqr from './Components/Scanqr';
import Edit from './Components/Edit';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/generate" element={<GenerateQR />} />
          <Route path="/scan" element={<Scanqr />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
