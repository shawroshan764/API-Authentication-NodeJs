const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
exports.connection = mongoose
    .connect("mongodb+srv://shawroshan764:Roshan2021@authentication.z2an8j7.mongodb.net/auth", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    .then(() => {
        console.log("Connection Successfull");
    })
    .catch((error) => {
        console.log("No Connection");
    });
