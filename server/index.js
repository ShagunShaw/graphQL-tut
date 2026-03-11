import express from 'express'
import { ApolloServer } from '@apollo/server'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'
import axios from 'axios'

async function startServer() {
    const app= express();
    const server= new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String
            }

            type Todo {
                id: ID!    
                title: String!
                completed: Boolean  
                user: User   
            }

            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    const res= await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.idgit}`)
                    return res.data
                }
            },

            Query: {
                getTodos: async () => {
                    const res= await axios.get('https://jsonplaceholder.typicode.com/todos')
                    return res.data
                },

                getAllUsers: async () => {
                    const res= await axios.get('https://jsonplaceholder.typicode.com/users')
                    return res.data
                },

                getUser: async (parent, {id}) => {
                    const res= await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
                    return res.data
                }
            }
        }
    })

    await server.start()

    app.use(cors())
    app.use(express.json())
    app.use('/graphql', expressMiddleware(server))

    app.listen(8000, () => console.log("Server started at port 8000"))
}

startServer()