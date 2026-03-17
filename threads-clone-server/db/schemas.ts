import { client } from './db.js'

export const createTables = async () => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name          VARCHAR(15) NOT NULL,
            last_name           VARCHAR(10) NOT NULL,
            profile_image_url   TEXT,
            email               VARCHAR(30) UNIQUE NOT NULL,
            password            VARCHAR(255) NOT NULL,
            salt                VARCHAR(255) NOT NULL
        )
    `)
    console.log('Users table ready')
}