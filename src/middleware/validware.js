const { default: mongoose } = require("mongoose");

const isValidEmail = function (value) {
    let emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
    if (emailRegex.test(value)) return true;
};

const isValidObjectId = function(id){
    return mongoose.Types.ObjectId.isValid(id)
}

const isValidName = (name) => {

    return /^[A-Za-z\s]{1,50}$/.test(name)
}
const isValidMobile = (mobile) => {

    return /^[6-9]\d{9}$/.test(mobile);
  }

  const isValidPincode = function (pincode) {
      if (/^[1-9][0-9]{5}$/.test(pincode)){
         return true
      }
      return false
     }




module.exports = { isValidEmail , isValidObjectId,isValidName,isValidMobile,isValidPincode}
