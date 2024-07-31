import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/browser";
import axios from "axios";
import './Scanqr.css';
import jsqr from "jsqr";

export default function Scanqr() {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [token, setToken] = useState();
  const videoRef = useRef(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const currentDate = getCurrentDate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(0, 0, img.width, img.height);

          const code = jsqr(imageData.data, img.width, img.height);
          if (code) {
            setQrData(code.data);
          } else {
            setQrData('No QR code found');
          }
        };
      };
      reader.readAsDataURL(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleScanButtonClick = () => {
    if (videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          setQrData(result.getText());
          console.log('QR data from video:', result.getText());
          codeReader.reset(); // Stop scanning after successful read
        }
        if (err) {
          console.error(err);
        }
      });
    }
  };

  useEffect(() => {
    if (qrData && qrData !== 'No QR code found') {
      const updateData = async () => {
        try {
          console.log('QR data to update:', qrData);
          const resp = await axios.put("http://localhost:5000/changestatus", { qrData, currentDate });
          console.log('Update response:', resp);
          if (resp.status === 200) {
            navigate('/');
          } else {
            alert("Not Updated");
          }
        } catch (error) {
          console.error("Error updating status:", error);
          alert("Error updating status");
        }
      };
      updateData();
    }
  }, [qrData]);

  return (
    <div className="head">
      <header className="abc">
        <div className="ff" onClick={()=>{
          navigate('/');
        }}>Inventory Management System</div>
        <div className="abc">
          <div className="qr ff" onClick={() => navigate('/generate')}>Generate QR</div>
          <div className="ff">Scan QR</div>
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
      <div className="boxes">
        <div className="boxh">
          <div className="dd">Scan QR</div>
          <div className="ddf">
            <video ref={videoRef} style={{ width: '100%' }} />
          </div>
          <button onClick={handleScanButtonClick}>
            Scan the Code
          </button>
        </div>
        <div className="boxh">
          <div className="dd">Upload QR</div>
          <div className="ddf">
            {imageSrc && <img src={imageSrc} alt="Selected QR code" style={{ maxWidth: '100%' }} />}
          </div>
          <div className="dd">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
