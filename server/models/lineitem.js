const { Schema } = require('mongoose');

const lineitemSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String },
    quantity: { type: Number },
    price: { type: Schema.Types.Decimal128 },
    currency: { type: String }
});

module.exports = lineitemSchema;