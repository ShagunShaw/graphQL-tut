import { Client } from "pg";

const client = new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: process.env.POSTGRES_DB,
})

// Connect once at module level
const connectToPostgreSQL = async () => {
    await client.connect();
    console.log('Connected to PostgreSQL')
}

export { connectToPostgreSQL, client }