const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const { STATUSES } = require('../config/settings');
const { User, Balance } = require('./index.js');

const commAddonSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Schema.Types.Decimal128 },
    quantity: { type: Number }
});

const commOptionSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Schema.Types.Decimal128 }
});

const commissionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    commissioner: { type: Schema.Types.ObjectId, ref: 'User' },
    balance: { type: Schema.Types.ObjectId, ref: 'Balance' },
    status: {
        type: String,
        required: true,
        enum: [...STATUSES],
        default: "New"
    },
    options: [ commOptionSchema ],
    addons: [ commAddonSchema ],
    anonymous: { type: Boolean },
    references: [ { type: Schema.Types.ObjectId, ref: 'Media' } ],
    final: { type: Schema.Types.ObjectId, ref: 'Media' }
}, { timestamps: true });

commissionSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            const user = await User.findById(this.commissioner);
            if (user) {
                user.commissions.addToSet(this._id);
                await user.save();
            }
        }
    } catch (error) {
        next(error);
    }

    next();
});

commissionSchema.post('save', async function() {
    try {
        if (this.isNew) {
            const newBalance = await Balance.create({
                userId: this.commissioner,
                commissionId: this._id,
                lineitems: [], // lineitems will automatically populate on save as it has dependency on the commission
                transactions: [] // Making sure it's there by declaring an empty array
                // total is calculated from the sum of lineitems on save
                // everything else is a virtual field, or handled separately.
            });

            // Set the ID to the new Balance instance via update operation to avoid triggering a recursive loop
            await Commission.findByIdAndUpdate(this._id, { $set: { balance: newBalance._id } });
        }
    } catch (error) {
        console.error("Error while creating a new balance: ", error);
    }
});

commissionSchema.method.addOption(function (option) {
    if (!this.options.filter(opt => opt.name === option.name)) {
        this.options.push( {...option } );
        return this.save();
    }
});

commissionSchema.method.removeOption(function (optionId) {
    this.options = this.options.filter(opt => !opt._id === optionId);
    return this.save();
});

commissionSchema.method.addAddon(function (addon, qty = 0) {
    if (!this.addons.filter(add => add.name === addon.name)) {
        this.addons.push( {...addon, quantity: qty} );
        return this.save();
    }
});

commissionSchema.method.removeAddon(function (addonId) {
    this.addons = this.addons.filter(add => !add._id === addonId);
    return this.save();
});

const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;