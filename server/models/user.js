const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { BCRYPT_HASHCOUNT, CREATOR_EMAIL } = require('../config/settings');
const validator = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"]
    },
    displayName: { type: String },
    password: {
        type: String,
        required: true
    },
    totalOwing: { type: Types.Decimal128 },
    commissions: [ { type: Types.ObjectID, ref: 'Commission' } ]
}, { timestamps: true, virtuals: true });

userSchema.method.checkPassword(async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
});

userSchema.method.encryptPassword(async function (newPassword) {
    return await bcrypt.hash(newPassword, BCRYPT_HASHCOUNT);
});

// Used when checking if the user should be presented with creator functions.
// Will also be used to authenticate certain requests (i.e. Removing media, adjusting settings, etc.)
userSchema.virtual('isCreator')
    .get(function() {
        return this.email === CREATOR_EMAIL;
    });

userSchema.pre('save', async function(next) {
    // Set the display name to the first part of a user's email if left blank
    if (!this.displayName) {
        this.displayName = /^[^@]+/.exec(this.email)[0];
    }

    if (this.isNew || this.isModified('password')) {
        this.password = await encryptPassword(this.password);
    }

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;