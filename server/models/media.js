const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const sharp = require('sharp');

const mediaSchema = new Schema({
    // Because there's a 16 MB hard limit per document, we need to limit uploads to allow for headroom
    name: { type: String, required: true },
    extension: { type: String, required: true },
    original: { type: Types.Buffer, maxlength: 8 * 1024 * 1024 }, // 8 MB Limit
    compressed: { type: Types.Buffer, maxlength: 6 * 1024 * 1024 } // 6 MB Limit
}, { virtuals: true, timestamps: true });

mediaSchema.virtual('fullName')
    .get(function () {
        return `${this.name}.${this.extension}`
    });

mediaSchema.virtual('serialCompressed')
    .get(function () {
        return this.compressed.toString('base64');
    });

mediaSchema.virtual('serialOriginal')
    .get(function () {
        return this.original.toString('base64');
    });

mediaSchema.pre('save', async function(next) {
    if (this.original && this.isModified('original')) {
        try {
            // Use sharp to compress the image binary to webp
            const compressed = await sharp(this.original)
                .webp({ quality: 80 })
                .toBuffer(); // Outputs to a format that can be saved to BSON
            this.compressed = compressed;
        } catch (error) {
            return next(err);
        }
    }

    next();
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;