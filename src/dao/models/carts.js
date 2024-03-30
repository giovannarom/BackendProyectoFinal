import mongoose from 'mongoose';

const { Schema } = mongoose;

const collection = 'Carts';

const schema = new Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        quantity: { type: Number, required: true }
    }]
});

const cartModel = mongoose.model(collection, schema);

export { cartModel };