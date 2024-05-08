const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const { transactionSchema } = require('./transaction');
const { lineitemSchema } = require(('./lineitem'));
const { Commission } = require('./commission');

const balanceSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    commissionId: { type: Types.ObjectId, ref: 'Commission', required: true },
    lineitems: [ lineitemSchema ],
    total: { type: Types.Decimal128, required: true },
    deposit: { type: Types.Decimal128 },
    paid: { type: Types.Decimal128 },
    transactions: [ transactionSchema ]
}, { virtuals: true, timestamps: true });

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

balanceSchema.pre('save', async function (next) {
    if (this.isNew) {
        const comm = await Commission.findById(this.commissionId);

        for (const option of comm.options) {
            this.lineitems.addToSet({
                name: option.name,
                type: 'Option',
                price: option.price
            });
        }

        for (const addon of comm.addons) {
            this.lineitems.addToSet({
                name: addon.name,
                type: 'Addon',
                price: addon.price,
                quantity: addon.quantity
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