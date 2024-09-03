const express = require("express")
const dotenv = require("dotenv");
const app = express();
const cors = require('cors');
const mainRouting = require("./Routes/mainroute");
dotenv.config();
const DBconnection =require( "./Config/DBconnect");
DBconnection();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use( "/api",mainRouting )

const port = process.env.PORT || 2000;

app.listen(port ,()=>{
    console.log(`Successfully run on port NO ${port}`)
}) 