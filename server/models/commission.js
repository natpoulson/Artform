const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const { STATUSES } = require('../config/settings');

const commissionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    balance: { type: Types.ObjectId, ref: 'Balance' },
    status: {
        type: String,
        required: true,
        enum: [...STATUSES]
    },
    anonymous: { type: Boolean },
    references: [ { type: Types.ObjectId, ref: 'Media' } ],
    final: { type: Types.ObjectId, ref: 'Media' }
}, { timestamps: true });

const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;