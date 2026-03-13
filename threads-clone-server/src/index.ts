import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
// Q) Why is prisma a dev-dependency and not a dependency (ask in claude)

async function init() {
    const app= express()
    const PORT= Number(process.env.PORT) || 8000

    app.use(express.json())

    // Create GraphQL Server
    const server = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
        }
    `,
    resolvers: {
        Query: {
            hello: () => 'Hey I am GraphQL server'
        }
    },
    });

    await server.start();

    app.get("/", (req, res) => {
        res.json({message: "Health, OKK!"})
    })

    app.use('/graphql', expressMiddleware(server))

    app.listen(PORT, () => console.log("Server Started"))
}

init();