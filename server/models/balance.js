const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const { transactionSchema } = require('./transaction');

const balanceSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    commissionId: { type: Types.ObjectId, ref: 'Commission', required: true },
    total: { type: Types.Decimal128, required: true },
    deposit: { type: Types.Decimal128 },
    paid: { type: Types.Decimal128 },
    transactions: [ transactionSchema ]
}, { virtuals: true });

balanceSchema.virtual('owing')
    .get(function () {
        return this.total - this.paid;
    });

balanceSchema.virtual('isDepositPaid')
    .get(function () {
        return this.paid >= this.deposit;
    });

balanceSchema.virtual('isFullyPaid')
    .get(function() {
        return this.total === this.paid;
    });

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;