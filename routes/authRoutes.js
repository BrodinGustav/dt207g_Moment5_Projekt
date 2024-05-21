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


//Skapa meny
router.post("/createMenu", async (req, res) => {
    try{
        console.log("Inkommande data:", req.body);       //Loggar input
        const { name, description, price } = req.body         //Läser in input från användare
    
        //Validera input
        if(!name || !description || !price) {
            return res.status(400).json({error: "Felaktigt input, skicka namn, beskrivning och pris"});
        }

        //Kontroll om meny redan finns
        const existingMenu = await Menu.findOne({ name });
        if(existingMenu) {
            return res.status(400).json({ error: "Namn för maträtt finns redan"});
        }

            //Korrekt input - skapa ny maträtt
            const menu = new Menu({ name, description, price });    
            await menu.save();

            res.status(200).json({message: "Meny skapad"});
        
    }catch (error){
        console.error("Server error", error);
        res.status(500).json({error: "Server error"} + error);
    }
});

//Hämta maträtter
router.get("/menu", async (req, res) => {
    try{
        console.log("Fetching menyer");                                                              //Loggar för att se ifall kod nås pga server-error
        const menus = await Menu.find();
        console.log("Menyer fetched:", menus);                                                       // Logga resultatet pga server-error
        res.status(200).json(menus);
    }catch (error){
        console.error("Server fel" + error);
        res.status(500).json({ error: "Server fel"});
    }
    });


//Hämta specifik maträtt
router.get("/menu/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const menu = await Menu.findById(id);
        if(!menu) {
            return res.status(404).json({ error: "Meny hittades ej"});
        }                                                    
        res.status(200).json(menu);
    }catch (error){
        console.error("Server fel" + error);
        res.status(500).json({ error: "Server fel"});
    }
    });



//Uppdatera maträtt
router.put("/menu/:id", async (req, res) => {
    try {
        const id = req.params.id;                                       //Hämtar ID från URL-parametern

         // Kontrollera om id är ett giltigt ObjectId
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Ogiltigt ID-format" });
        }


        const { name, description, price } = req.body;                  //Hämtar data från fronten
        
        //Kontroll-loggar
        console.log("ID från URL-parametern:", id);
        console.log("Uppdateringsdata:", { name, description, price });

        //Skapar uppdateringsobjekt
        const updateData = { name, description, price };
        
        //Uppdaterar maträtt i databasen
        const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, { new: true});
        
        //Kontroll-logg
        console.log("Uppdaterad meny:", updatedMenu);


        //Kontrollera uppdatering
        if (!updatedMenu) {
            console.log("Maträtt finns ej.");
            return res.status(404).json({ error: "Maträtt finns ej"});
        }

        res.status(200).json({ message: "Meny uppdaterad", menu: updatedMenu});
    }catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error"});
    }
});

//Radera maträtt
router.delete("/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;

        //Radera meny
        await Menu.findByIdAndDelete(id);

        res.status(200).json({ message: "Meny raderad"});
    }catch (error) {
        console.error("Server error", error);
        res.status(500).json({ error: "Server error"});
    }
});


//Exporterar all kod till app.use i server.js
module.exports = router;