import 'dotenv/config'
import express from 'express'
import createApolloGraphqlServer from './graphql/index.js'
import { connectToPostgreSQL } from '../db/db.js';
import UserService from './services/user.js';
import { createTables } from '../db/schemas.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import http from 'http'

// import 'dotenv/config'
// import express from 'express'
// import createApolloGraphqlServer from './graphql/index.js'
// import { connectToPostgreSQL } from '../db/db.js';
// import UserService from './services/user.js';
// import { createTables } from '../db/schemas.js';
// import { startStandaloneServer } from '@apollo/server/standalone';

async function init() {
    const app= express()
    const PORT= Number(process.env.PORT) || 8000

    await connectToPostgreSQL()
    await createTables()

    const httpServer = http.createServer(app);

    const gqlServer= await createApolloGraphqlServer(httpServer)

    app.use(express.json())

    app.get("/", (req, res) => {
        res.json({message: "Health, OKK!"})
    })

        app.use('/graphql', expressMiddleware(gqlServer, {
        context: async ({ req, res }) => {           // Whatever we are return from this function to context, will be now available globally in context param, so now context will look like this:
        // context = { user: { id: "123", email: "john@gmail.com" } }
            const tokenHeader = req.headers['token']
            const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader
            try {
                if(!token)  throw new Error("No token found")
                const user = UserService.decodeJWTToken(token)
                return { user }
            } catch (error) {
                return {}
            }
        }
    }))

    await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
    );
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
    }

init();