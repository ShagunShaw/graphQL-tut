import { ApolloServer } from "@apollo/server";
import { User } from "./user/index.js"; 
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

export default async function createApolloGraphqlServer(httpServer) {
    // Create GraphQL Server
    const server = new ApolloServer({
    typeDefs: `
        ${User.typeDefs}

        type Query {
            ${User.queries}
        }
        type Mutation {
            ${User.mutations}
        }
    `,
    resolvers: {
        Query: {
            ...User.resolvers.queries
        },
        Mutation: {
            ...User.resolvers.mutations
        }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });

    await server.start();
    return server;
}