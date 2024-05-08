const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const { STATUSES } = require('../config/settings');
const { Option } = require('./option');
const { Addon } = require('./addon');

const commissionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    balance: { type: Schema.Types.ObjectId, ref: 'Balance' },
    status: {
        type: String,
        required: true,
        enum: [...STATUSES]
    },
    options: [ Option ],
    addons: [ Addon ],
    anonymous: { type: Boolean },
    references: [ { type: Schema.Types.ObjectId, ref: 'Media' } ],
    final: { type: Schema.Types.ObjectId, ref: 'Media' }
}, { timestamps: true });

const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;