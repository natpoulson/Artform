const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const addonSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Schema.Types.Decimal128 },
    hasQuantity: { type: Boolean },
    maxQuantity: { type: Number }
});

const Addon = mongoose.model('Addon', addonSchema);

module.exports = Addon;