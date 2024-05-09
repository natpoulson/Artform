const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');

const workSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    commission: { type: Types.ObjectId, ref: 'Commission' },
    commissioner: { type: String },
    private: { type: Boolean },
    paid: { type: Boolean },
    publish: { type: Boolean, default: false },
    feature: { type: Boolean, default: false },
    image: { type: Types.ObjectId, ref: 'Media' }
});

workSchema.pre('save', function () {
    if (this.private && this.paid) {
        this.publish = false;
    }
});

const Work = mongoose.model('Work', workSchema);

module.exports = Work;