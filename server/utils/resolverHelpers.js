const { GraphQLError } = require('graphql');
const { AuthError } = require('./auth');
const { STATUSES, LEGAL_CHANGES } = require('../config/settings');

module.exports = {
    gQLNotFoundErr: function (message) {
        throw new GraphQLError(message, {
            extensions: {
                code: "NOT_FOUND",
                status: 404
            }
        });
    },
    gQLForbiddenErr: function (message) {
        throw new GraphQLError(message, {
            extensions: {
                code: "FORBIDDEN",
                status: 403
            }
        });
    },
    gQLValidationErr: function (message) {
        throw new GraphQLError(message, {
            extensions: {
                code: "BAD_USER_INPUT",
                status: 400
            }
        })
    },
    gQLGeneralFailure: function (message) {
        throw new GraphQLError(message, {
            extensions: {
                code: "INTERNAL_ERROR",
                status: 500
            }
        })
    },
    isLoggedIn: function (context) {
        if (!context.user) {
            throw AuthError;
        }
    },
    isDiff: function (inputValue, compareValue) {
        if (!inputValue || !compareValue) {
            return false;
        }
    
        if (!inputValue === compareValue) {
            return true;
        }
    },
    isLegal: function (initial, target) {
        if (!STATUSES.includes(initial) || !STATUSES.includes(target)) {
            return false;
        }

        if (LEGAL_CHANGES.find(item => {
            item.initial === initial &&
            item.legal.includes(target)
        })) {
            return true;
        }

        return false;
    }
}