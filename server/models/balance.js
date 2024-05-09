const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const transactionSchema = require('./transaction');
const lineitemSchema = require('./lineitem');
const Commission = require('./commission');
const { DEFAULT_DEPOSIT } = require('../config/settings');

const balanceSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    commission: { type: Types.ObjectId, ref: 'Commission', required: true },
    lineitems: [ lineitemSchema ],
    total: { type: Types.Decimal128, required: true },
    depositPercentage: { type: Number, default: DEFAULT_DEPOSIT },
    // Our first payment will be handled after creation, so this will always be zero
    paidAmount: { type: Types.Decimal128, default: 0 }, 
    transactions: [ transactionSchema ]
}, { virtuals: true, timestamps: true });

balanceSchema.virtual('owing')
    .get(function () {
        return this.total - this.paid;
    });

balanceSchema.virtual('deposit')
    .get(function () {
        return Number.parseFloat((this.total / this.depositPercentage).toFixed(2));
    });

balanceSchema.virtual('isDepositPaid')
    .get(function () {
        return this.paid >= this.deposit;
    });

balanceSchema.virtual('isFullyPaid')
    .get(function() {
        return this.total === this.paid;
    });

balanceSchema.pre('save', async function (next) {
    if (this.isNew) {
        const comm = await Commission.findById(this.commission);

        for (const option of comm.options) {
            this.lineitems.push({
                name: option.name,
                type: 'Option',
                price: option.price
            });
        }

        for (const addon of comm.addons) {
            this.lineitems.push({
                name: addon.name,
                type: 'Addon',
                price: addon.price,
                quantity: addon.quantity || 0
            });
        }
    }

    if (this.isNew || this.isModified('lineitems')) {
        this.total = this.lineitems.reduce((runningTotal, item) => runningTotal += item.price);
    }

    next();
});

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;