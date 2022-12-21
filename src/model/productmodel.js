const mongoose = require('mongoose')

module.exports = mongoose.model(
    'product',

    new mongoose.Schema({

        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            trim: true
            //! valid number/ decimal
        },
        currencyId: { 
            type: String,
            required: true, 
            default: "INR",
            trim: true 
        },
        currencyFormat: { 
            type: String,
            required: true,
            default: '₹',
            trim: true 
            //! Rupee symbol 
        },
        isFreeShipping: { 
            type: Boolean,
            default: false,
            trim: true 
        },
        productImage: { 
            type: String,
            required: true,
            trim: true 
        },  // s3 link
        style: { 
            type: String,
            trim: true
        },
        availableSizes: { 
            type: String, 
            enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
            required: true,
            trim: true
            //! at least one size
        },
        installments: { 
            type: Number,
            trim: true
        },
        deletedAt: { 
            type: Date,
            trim: true
            //! when the document is deleted 
        },
        isDeleted: { 
            type: Boolean, 
            default: false,
            trim: true
        }

    }, { timestamps: true })
)

