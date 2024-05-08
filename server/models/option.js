const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const optionSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Schema.Types.Decimal128 }
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;