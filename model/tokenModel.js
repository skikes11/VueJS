const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true

    }
});

let TokenModel = mongoose.model("TokenModel", TokenSchema);

module.exports = TokenModel