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
});

//Staff model
const Staff = require("../models/staff.js");
//Menu model
const Menu = require("../models/menu.js");

//Skapa användare
router.post("/register", async (req, res) => {
    try{
        console.log("Inkommande data:", req.body);       //Loggar input
        const { username, password } = req.body         //Läser in input från användare
    
        //Validera input
        if(!username || !password) {
            return res.status(400).json({error: "Felaktigt input, skicka användarnamn och lösenord"});
        }

        //Kontroll om användare redan finns
        const existingStaff = await Staff.findOne({ username });
        if(existingStaff) {
            return res.status(400).json({ error: "Användarnamn finns redan"});
        }

            //Korrekt input - skapa ny anvädare
            const staff = new Staff({ username, password });    //Använder staffSchema från staff.js för lagring av ny användare
            await staff.save();

            res.status(200).json({message: "Användare skapad"});
        
    }catch (error){
        console.error("Server error", error);
        res.status(500).json({error: "Server error"} + error);
    }
});

//Logga in 
router.post("/login", async (req, res) => {
    try{
        const {username, password} = req.body;

        console.log("Inloggningsförsök med:", username, password);                                              //Loggar inkommande data pga server-error

        //Validera
        if(!username||!password) {
            console.log("Valideringsfel: Saknar användarnamn eller lösenord");                                  //Loggar data
            return res.status(400).json({error: "Ej korrekt input, skicka användarnamn och lösenord"});
        }

        //Finns användare?
        const staff = await Staff.findOne({ username: username });
        console.log("Hittad användare:", staff);                                                                //Loggar data

        if(!staff) {
            console.log("Fel: Användaren finns inte");                                                          //Loggar data
            return res.status(401).json({ error: "Inkorrect användarnamn/lösenord"});
        }

        //Kontroll lösenord
        const isPasswordMatched = await staff.comparePassword(password);
        console.log("Lösenord matchat:", isPasswordMatched);                                                    //Loggar data
                if(!isPasswordMatched) {
                    console.log("Fel: Lösenord matchar inte");                                                  //Loggar data
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord"});
        }else {
            //Skapa JWT
            const payload = {username: username};                                                           //Användare lagras i JWT
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '8h'});
            console.log("JWT skapat:", token);                                                                  //Loggar data
            res.status(200).json({message: "Inloggad!", token});
        }
    }catch(error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server fel"});
    }
});

//Hämta all personal
router.get("/staff", async (req, res) => {
    try{
        console.log("Fetching staff members");                                                              //Loggar för att se ifall kod nås pga server-error
        const employees = await Staff.find();
        console.log("Employees fetched:", employees);                                                       // Logga resultatet pga server-error
        res.status(200).json(employees);
    }catch (error){
        console.error("Server fel" + error);
        res.status(500).json({ error: "Server fel"});
    }
    });

//Uppdatera anställds lösenord
router.put("/staff/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        //Validera input
        if (!password) {
            return res.status(400).json({ error: "Felaktig input, skicka lösenord"});
        }

        //Hasha nytt lösenord
        const hashedPassword = await bcrypt.hash(password, 10);

        //Uppdatera lösen
        await Staff.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({ message: "Användares lösenord uppdaterat"});
    }catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error"});
    }
});

//Ta bort användare
router.delete("/staff/:id", async (req, res) => {
    try {
        const { id } = req.params;

        //Radera användare
        await Staff.findByIdAndDelete(id);

        res.status(200).json({ message: "Användare raderad"});
    }catch (error) {
        console.error("Server error", error);
        res.status(500).json({ error: "Server error"});
    }
});


/*******ROUTES för menu ****************/


//Exporterar all kod till app.use i server.js
module.exports = router;