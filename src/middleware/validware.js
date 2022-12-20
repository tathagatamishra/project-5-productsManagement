const { default: mongoose } = require("mongoose");

const isValidEmail = function (value) {
    let emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
    if (emailRegex.test(value)) return true;
};

const isValidObjectId = function(id){
    return mongoose.Types.ObjectId.isValid(id)
}

module.exports = { isValidEmail , isValidObjectId}