const mongoose = require('mongoose')

module.exports = mongoose.model(
    'user',

    new mongoose.Schema({

        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
            //! valid email 
        },
        profileImage: {
            type: String,
            required: true
        }, // s3 link
        phone: {
            type: String,
            required: true,
            unique: true
            //! valid Indian mobile number 
        },
        password: {
            type: String,
            required: true,
            minLen: 8,
            maxLen: 15
        }, // encrypted password
        address: {
            shipping: {
                street: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                pincode: {
                    type: String,
                    required: true
                }
            },
            billing: {
                street: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                pincode: {
                    type: Number,
                    required: true
                }
            }
        }

    }, { timestamps: true })
)