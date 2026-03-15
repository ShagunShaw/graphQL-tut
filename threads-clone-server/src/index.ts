import 'dotenv/config'
import express from 'express'
import { expressMiddleware } from '@as-integrations/express4';
import createApolloGraphqlServer from './graphql/index.js'
import { connectToPostgreSQL } from '../db/db.js';

async function init() {
    const app= express()
    const PORT= Number(process.env.PORT) || 8000

    
    await connectToPostgreSQL()
    console.log("db connected successfully")

    app.use(express.json())

    const gqlServer= await createApolloGraphqlServer()

    app.get("/", (req, res) => {
        res.json({message: "Health, OKK!"})
    })

    app.use('/graphql', expressMiddleware(gqlServer))

    app.listen(PORT, () => console.log("Server Started"))
}

init();