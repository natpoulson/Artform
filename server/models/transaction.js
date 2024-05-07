const { Schema, Types } = require('mongoose');

const transactionSchema = new Schema({
    type: {
        type: String,
        enum: [ "Payment", "Refund", "Chargeback", "Credit", "Adjustment" ], // Move these out into configurable enums
        required: true
    },
    status: {
        type: String,
        enum: [ "Confirmed", "Pending", "Processing", "Complete", "Cancelled", "Declined" ], // Move these out into configurable enums
        required: true
    },
    amount: { type: Types.Decimal128, required: true },
    currency: { type: String, required: true },
    method: { type: String, required: true }
});

module.exports = transactionSchema;