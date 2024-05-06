const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');

const mediaSchema = new Schema({
    name: { type: String, required: true },
    extension: { type: String, required: true },
    original: { type: Types.Buffer, maxlength: 8 * 1024 * 1024 },
    compressed: { type: Types.Buffer, maxlength: 6 * 1024 * 1024 }
}, { virtuals: true });

mediaSchema.virtual('fullName')
    .get(function () {
        return `${this.name}.${this.extension}`
    });

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;