const mongoose = require('mongoose')

const ObjId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model(
    'cart',

    new mongoose.Schema({

        userId: { 
            type: ObjId,
            ref: 'user',
            required: true,
            unique: true,
            trim: true 
        },
        items: [{
            productId: {
                type: ObjId,
                ref: 'product',
                required: true,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                trim: true
            }
        }],
        totalPrice: { 
            type: Number,
            required: true,
            trim: true 
            //todo comment: "Holds total price of all the items in the cart" 
        },
        totalItems: { 
            type: Number,
            required: true,
            trim: true 
            //todo comment: "Holds total number of items in the cart" 
        }

    }, { timestamps: true })
)


