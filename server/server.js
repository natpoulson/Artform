const path = require('path');
const express = require('express');
const db = require('./config/database');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startServer = async () => {
    await server.start();

    app.use(express.json());
    app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        } )
    }

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log('Now listening on port', PORT);
            console.log('Apollo Server active on /graphql');
        });
    });
};

startServer();