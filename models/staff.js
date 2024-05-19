//Schema över personal och metoder för login och verifiering av lösenord

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//staff-schema
const staffSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

//Hasha lösen
staffSchema.pre("save", async function(next) {                          //pre kör funktionen innan lagring av staffSchema
    try {
        if(this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch(error) {
        next(error);
    } 
});

//Registrera staff
staffSchema.statics.register = async function (username, password) {
    try {
        const staff = new this ({ username, password });
        await staff.save();                                             //lagrar staff i databasen
        return staff;
    }catch(error) {
        throw error;
    }
};

//Metod för att jämföra inmatat lösenord med hashat lösenord
staffSchema.methods.comparePassword = async function(password) {
    try{
        return await bcrypt.compare(password, this.password); 
    }catch (error){
        throw error;
    }
};

//Metod för inlogg
staffSchema.statics.login = async function(username, password) {
    try{
        const staff = await this.findOne({ username });             //Kontroll om användare finns
        
        if(!staff){
            throw new Error("Fel användarnamn/lösenord");
        }

        const isPasswordMatched = await staff.comparePassword(password);

        //Inkorrekt
        if(!isPasswordMatched) {
            throw new Error("Fel användarnamn/lösenord");
        }

        //Korrekt
        return staff;

    }catch(error) {
        throw error;
    }
}

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;