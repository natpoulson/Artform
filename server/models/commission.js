const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const { statuses } = require('../config/settings');

const commissionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    // To Add: Balance Schema
    status: {
        type: String,
        required: true,
        enum: [...statuses]
    },
    anonymous: { type: Boolean },
    references: [ { type: Types.ObjectId, ref: 'Media' } ],
    final: { type: Types.ObjectId, ref: 'Media' }
}, { timestamps: true });

const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;