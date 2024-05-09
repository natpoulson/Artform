const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const aboutContentSchema = new Schema({
    portrait: { type: Schema.Types.ObjectId, ref: 'Media' },
    banner: { type: Schema.Types.ObjectId, ref: 'Media' },
    bio: { type: String },
    willDo: [ { type: String } ],
    wontDo: [ { type: String } ],
    askMe: [ { type: String } ],
    conditions: [ { type: String } ]
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

module.exports = AboutContent;