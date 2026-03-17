import { client } from '../../db/db.js'
import {createHmac, randomBytes} from 'node:crypto'
import JWT from 'jsonwebtoken'

export interface CreateUserPayload {
    firstName: string
    lastName: string
    email: string
    password: string
    profileURL?: string
}

export interface GetUSerTokenPayload {
    email: string,
    password: string
}

const JWT_SECRET= process.env.JWT_SECRET

class UserService {
    public static async createUser(payload: CreateUserPayload) {
        const {firstName, lastName, email, password} = payload
        const profileURL = payload.profileURL || "NULL"
        const salt= randomBytes(32).toString('hex');
        const hashedPassword= createHmac('sha256', salt).update(password).digest('hex')
        console.log("reached here")
        const rows= await client.query(
            "INSERT INTO users (first_name, last_name, profile_image_url, email, password, salt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [firstName, lastName, profileURL, email, hashedPassword, salt]
        );

        return rows.rows[0].id.toString();         
    }

    private static async getUserByEmail(email: string)
    {
        const { rows }= await client.query("SELECT * FROM users WHERE email= $1 ",
            [email]
        )

        return rows[0]
    }

    private static generateHash(salt: string, password: string)
    {
        const hashedPassword= createHmac('sha256', salt).update(password).digest('hex')
        return hashedPassword
    }

    public static async getUserToken(payload: GetUSerTokenPayload) {
        const {email, password} = payload
        const user= await this.getUserByEmail(email)

        if(!user)   throw new Error('user not found')

        const userSalt= user.salt
        const userHashedPassword= this.generateHash(userSalt, password)

        if(userHashedPassword !== user.password)    throw new Error('Incorrect Password')

        // generate a token
        const token= JWT.sign({ id: user.id, email: user.email }, JWT_SECRET, {expiresIn: '1h'})
        return token
    }

    public static decodeJWTToken(token: string) {
        return JWT.verify(token, JWT_SECRET)
    }

    public static async getUserByID(id) {
        const { rows }= await client.query("SELECT * FROM users WHERE id= $1 ",
            [id]
        )

        const result= {
            ...rows[0],
            id: rows[0].id,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            email: rows[0].email,
            profileImageURL: rows[0].profile_image_url
        }

        return result
    }
}

export default UserService