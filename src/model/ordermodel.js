const mongoose = require('mongoose')

const ObjId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model(
    'order',

    new mongoose.Schema({

        userId: {
            type: ObjId,
            ref: 'user',
            required: true,
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
        },
        totalQuantity: {
            type: Number,
            required: true,
            trim: true
            //todo comment: "Holds total number of quantity in the cart" 
        },
        cancellable: {
            type: Boolean,
            default: true,
            trim: true
        },
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'completed', 'canceled'],
            trim: true
        },
        deletedAt: {
            type: Date,
            trim: true
            //todo when the document is deleted 
        },
        isDeleted: {
            type: Boolean,
            default: false,
            trim: true
        }

    }, { timestamps: true })
)


