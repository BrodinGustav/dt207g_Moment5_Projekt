const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Anslutning till databas
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Uppkopplad till MongoDB");
}).catch((error) => {
    console.error("Fel vid anslutning till databas" + error);
})

//Staff model
const Staff = require("./models/staff.js");


//Exporterar all kod till app.use i server.js
module.exports = router;