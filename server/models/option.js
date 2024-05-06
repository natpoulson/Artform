const { Schema } = require('mongoose');
const { skuSchema } = require('./sku');

const optionSchema = new Schema({
    label: { type: String, required: true },
    isAddon: { type: Boolean },
    availableSKUs: [ skuSchema ],
    selectedSKU: skuSchema
});

module.exports = optionSchema;