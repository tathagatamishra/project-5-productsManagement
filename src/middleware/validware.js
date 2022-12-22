const { default: mongoose } = require("mongoose");

exports.isValidEmail = (email) => {
    let emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/
    if (emailRegex.test(email)) return true
}

exports.isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}

exports.isValidName = (name) => {

    return /^[A-Za-z\s]{1,50}$/.test(name)
}
exports.isValidMobile = (mobile) => {

    return /^[6-9]\d{9}$/.test(mobile);
}

exports.isValidPincode = (pincode) => {
    if (/^[1-9][0-9]{5}$/.test(pincode)) {
        return true
    }
    return false
}

exports.isValidString = (value) => {
    if (typeof value == 'undefined' || value == null) return false;
    if (typeof value == "string" && value.trim().length == 0) return false;
    return true;
}

exports.validNum = (value) => {
    return /[0-9]\d/.test(value)
}


//Style Validation
exports.isValidStyle = (value) => {
    return /^[a-zA-Z _.-]+$/.test(value);
}

//Price Validation
exports.isValidPrice = (price) => {
    return /^[1-9]\d{0,7}(?:\.\d{1,2})?$/.test(price);
}

