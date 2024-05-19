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
const Staff = require("../models/staff.js");

//Skapa användare
router.post("/register", async (req, res) => {
    try{
        const { username, password } = req.body         //Läser in input från användare
    
        //Validera input
        if(!username || !password) {
            return res.status(400).json({error: "Felaktigt input, skicka användarnamn och lösenord"});
        }else {
            //Korrekt input
            const staff = new Staff({ username, password });    //Använder staffSchema från staff.js för lagring av ny användare
            await staff.save();

            res.status(200).json({message: "Användare skapad"});
        }
    }catch (error){
        console.error("Server error", error);
        res.status(500).json({error: "Server error"} + error);
    }
});

//Logga in 
router.post("/login", async (req, res) => {
    try{
        const {username, password} = req.body;

        //Validera
        if(!username||!passoword) {
            return res.status(400).json({error: "Ej korrekt input, skicka användarnamn och lösenord"});
        }

        //Finns användare?
        const staff = await Staff.findOne({ username: username });

        if(!staff) {
            return res.status(401).json({ error: "Inkorrect användarnamn/lösenord"});
        }

        //Kontroll lösenord
        const isPasswordMatched = await staff.comparePassword(password);
        if(!isPasswordMatched) {
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord"});
        }else {
            //Skapa JWT
            const payload = {username: username};                                                           //Användare lagras i JWT
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '8h'});
            res.status(200).json({message: "Inloggad!", token});
        }
    }catch(error) {
        res.status(500).json({ error: "Server fel"});
    }
});



//Exporterar all kod till app.use i server.js
module.exports = router;