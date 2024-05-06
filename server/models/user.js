const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { BCRYPT_HASHES } = require('../config/settings');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true },
    displayName: { type: String },
    password: { type: String, required: true },
    accountBalance: { type: Types.Decimal128 },
    commissions: [ { type: Types.ObjectID, ref: 'Commission' } ]
}, { timestamps: true });

userSchema.method('checkPassword', async function (enteredPassword) {
    try {
        if (await bcrypt.compare(enteredPassword, this.password)) {
            return true;
        }
    } catch (error) {
        return false;
    }
});

// Set the display name to the first part of a user's email if left blank
userSchema.pre('save', function(next) {
    if (!this.displayName) {
        this.displayName = /^[^@]+/.exec(this.email)[0];
    }

    next();
});



const User = mongoose.model("User", userSchema);

module.exports = User;