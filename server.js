//Serverinställningar
const express = require ("express");                 
const bodyParser = require("body-parser");                          //Formulärhantering
const cors = require("cors");                                       //Korsdomänförfrågningar
const authRoutes = require("./routes/authRoutes");                  //Autentiseringsrutter
const jwt = require("jsonwebtoken");                                //JSON Webtokenhantering
require ("dotenv").config();                                        //Kopplar till .env                                 

const app = express();                                              //Instans av express
const port = process.env.PORT || 3000;                                  
app.use(bodyParser.json());                                         //Tolkar inkommande JSON-anrop
app.use(cors());
app.use(express.static("src"));                                     //Åtkomst av statiska filer

//Routes

app.use("/api", authRoutes)                                       //

//Skyddad route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({message: "Skyddad route"});
});

//Validera token
function authenticateToken(req, res, next) {                        //Middleware som kontroll ifall token är korrekt
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];           //Raderar token och mellanrum

    if(token == null) res.status(401).json({message: "Nekan åtkomst - token saknas"});

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {      //Token verifieras mot JWT_SECRET_KEY
        if(err) return res.status(403).json({message: "Ogiltig JWT"});

        req.username = username;
        next();                                                             //Om verifiering godkänd, skicka användaren till /api/protected
    });
}


//Starta applikationen
app.listen(port, () => {
    console.log(`Server körs på http://localhost:${port}`);
})