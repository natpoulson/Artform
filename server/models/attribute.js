const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const attributeSchema = new Schema({
    name: { type: String, required: true },
    options: [ { type: Schema.Types.ObjectId, ref: 'Option' } ]
});

const Attribute = mongoose.model('Attribute', attributeSchema);

module.exports = Attribute;