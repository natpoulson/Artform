const { Schema, Types } = require('mongoose');

const skuSchema = new Schema({
    label: { type: String, required: true },
    price: { type: Types.Decimal128 }
});

module.exports = skuSchema;