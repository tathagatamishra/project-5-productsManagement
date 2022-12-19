const mongoose = require('mongoose')

module.exports = mongoose.model(
    'user',

    new mongoose.Schema({

        fname: {
            type: String,
            required: true,
            trim: true
        },
        lname: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
            //! valid email 
        },
        profileImage: {
            type: String,
            required: true,
            trim: true
        }, // s3 link
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
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
                    required: true,
                    trim: true
                },
                city: {
                    type: String,
                    required: true,
                    trim: true
                },
                pincode: {
                    type: String,
                    required: true,
                    trim: true
                }
            },
            billing: {
                street: {
                    type: String,
                    required: true,
                    trim: true
                },
                city: {
                    type: String,
                    required: true,
                    trim: true
                },
                pincode: {
                    type: Number,
                    required: true,
                    trim: true
                }
            }
        }

    }, { timestamps: true })
)