const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/settings');

module.exports = {
    AuthError: new GraphQLError('Cannot authenticate user.', {
        extensions: {
            code: 'UNAUTHENTICATED'
        }
    }),
    authMiddleware: function ({ req } ) {
        const token = req.headers.authorization.split(' ').pop.trim();
        
        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(
                token,
                JWT_SECRET,
                { maxAge: JWT_EXPIRATION }
            );

            req.user = data;
        } catch (error) {
            console.log('Invalid token');
        }

        return req;
    },
    signToken: function ( { email, displayName, _id } ) {
        const payload = { email, displayName, _id };
        return jwt.sign(
            { data: payload },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        )
    }
}