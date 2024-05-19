
const mongoose = require("mongoose");

//menu-schema
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

//Registrering av ny maträtt
menuSchema.statics.createMenu = async function(name, description, price) {
    try {
        const menu = new this({ name, description, price });
        await menu.save();
        return menu;
    }catch (error) {
        throw error;
    }
};

//Hämta alla maträtter
menuSchema.statics.getAllMenus = async function() {
    try{
        const menus = await find.this();
        return menus;
    }catch (error) {
        throw error;
    }
};

//Hämta specifik maträtt
menuSchema.statics.getMenuById = async function(id) {
try{
    const menu = await this.findById(id);
    return menu;
}catch(error){
    throw error;
}
};

//Uppdatera maträtt
menuSchema.statics.updateMenu = async function(id, updateData) {
    try{
        const menu = this.findByIdAndUpdate(id, updateData, { new: true });
        return menu;
    }catch (error) {
        throw error;
    }
};  

//Radera maträtt
menuSchema.statics.deleteMenu = async function(id){
    try{
        const menu = await this.findByIdAndDelete(id);
        return menu;
    }catch (error) {
        throw error;
    }
};


const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;