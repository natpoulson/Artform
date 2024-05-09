const { GraphQLError } = require('graphql');

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
    }
}