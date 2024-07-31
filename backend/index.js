const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var cors = require('cors');
const jwtpass = "123"
 app.use(cors());
 async function poo(){
    await mongoose.connect('mongodb+srv://paras027:paras1032@cluster0.s2rwujw.mongodb.net/Inventory');
    console.log("connected")
 }
 poo();

const data = mongoose.model('users', { name: String, email: String, password: String });
const account = mongoose.model('Inventory',{Serial: String, name: String, DateReceived:String,status:String, DateDispatched:String, BalanceItems:Number, QRcode:String});

app.post("/signup", async function (req, res) {
    const {name,email,password} = req.body;
    console.log("w1");
    
    const val = new data({ name: name, email: email, password: password })
    console.log("w2");
    const check = await data.findOne({ email: email });
    console.log("w3");
    if(check)
    {
        return res.status(411).json({
            message:"Already there"
        })
    }
    console.log("w4");
    val.save();
    res.json({
        message: "User Created",
    });
});


app.post("/signin", async (req, res) => {
    const user = await data.findOne({
        email:req.body.email,
        password: req.body.password
    });

    if (user) {
        const idd = user._id
        const token = jwt.sign({
            idd
        }, jwtpass);
  
        return res.json({
            token: token
        })
        
    }
    return res.status(411).json({
        message: "Error while logging in"
    })
})

app.post("/signin", async (req, res) => {
    const user = await data.findOne({
        email:req.body.email,
        password: req.body.password
    });

    if (user) {
        const idd = user._id
        const token = jwt.sign({
            idd
        }, jwtpass);
  
        return res.json({
            token: token
        })
        
    }
    return res.status(411).json({
        message: "Error while logging in"
    })
})

app.post("/inventory", async (req, res) => {
    const name = req.body.name;
    const date = req.body.date;
    const quantity = req.body.quantity;
    const qr = req.body.qr;

    const newInventory = new account({name: name, DateReceived: date, BalanceItems: quantity, QRcode: qr, status:"pending" });
    await newInventory.save();
    res.json({
        message: "Item added to Inventory"
    });
});

app.get("/inventorydata", async (req, res) => {
    const val = await account.find({});
    res.json({
        val : val,
        message: "Item added to Inventory"
    });
});
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
app.put('/changestatus', async (req, res) => {
    const { qrData,currentDate } = req.body;
    console.log('QR Data:', qrData); // Debug log
  console.log('Current Date:', currentDate); // Debug log
    try {
        const acc = await account.findOne({QRcode: qrData});
        const randomNumber = getRandomNumber(1, acc.BalanceItems);
        const remaining = acc.BalanceItems - randomNumber;
        console.log(acc);
      const updatedAccount = await account.findOneAndUpdate(
        { QRcode:qrData },
        { DateDispatched: currentDate, status:"Delivered", BalanceItems: remaining },
        { new: true }
      );
      console.log("1")
      if (!updatedAccount) {
        return res.status(404).send('Account not found');
      }
      console.log("2")
      res.json({
        updatedAccount,
        message: 'Status updated',
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.put('/updatedata', async (req, res) => {
    const { name,quantity,date,id } = req.body;
    console.log(id);
    try {
      const updatedAccount = await account.findByIdAndUpdate(
        id,
        { name: name, DateReceived:date, BalanceItems: quantity },
        { new: true }
      );
      console.log("1")
      if (!updatedAccount) {
        return res.status(404).send('Account not found');
      }
      console.log("2")
      res.json({
        updatedAccount,
        message: 'Status updated',
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.delete('/deleteitem/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL parameters
  
    try {
      // Use findByIdAndDelete to find and remove the document
      const result = await account.findByIdAndDelete(id);
  
      if (!result) {
        return res.status(404).json({ message: 'Item not found' }); // Document not found
      }
  
      res.json({ message: 'Item deleted successfully', result });
    } catch (error) {
      console.error('Error deleting item:', error.message);
      res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
  });
  

app.listen(5000);
