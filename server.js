const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
//import {MONGO_URL,PORT} from './routes/'
const path = require("path")


//dotenv config
dotenv.config();

//mongoDB connecion
connectDB();

//rest Objects
const app=express();


//middleware

app.use(express.json());
app.use(cors())
app.use(morgan("dev"))
//Route
//1 test Route
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use('/api/v1/auth',require("./routes/authRoutes"));
app.use('/api/v1/inventory',require("./routes/inventoryRoute"));
app.use('/api/v1/analytics',require("./routes/analyticsRoute"));
app.use('/api/v1/admin',require("./routes/adminRoutes"))

//Static Folder
app.use(express.static(path.join(__dirname,"./client/build")));

//Static Routes
app.get("*",function(req,res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"));
})
//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
    console.log(
      `Node Server Running In ${process.env.DEV_MODE} ModeOn Port ${process.env.PORT}`
        .bgBlue.white
    );
  });
