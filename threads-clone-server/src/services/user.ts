// import { prismaClient } from "../lib/db.js"
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
    public static createUser(payload: CreateUserPayload) {
        const {firstName, lastName, email, password, profileURL} = payload
        const salt= randomBytes(32).toString('hex');
        const hashedPassword= createHmac('sha256', salt).update(password).digest('hex')

        // return prismaClient.user.create({
        //     data: {
        //         firstName,
        //         lastName,
        //         email,
        //         salt,
        //         password: hashedPassword,
        //         profileImageURL: profileURL || "NIL"
        //     }
        // });
        return "hello";
    }

    private static getUserByEmail(email: string)
    {
        // return prismaClient.user.findUnique({
        //     where: {email}
        // })
        return "hello"
    }

    private static generateHash(salt: string, password: string)
    {
        const hashedPassword= createHmac('sha256', salt).update(password).digest('hex')
        return hashedPassword
    }

    public static async getUserToken(payload: GetUSerTokenPayload) {
        const {email, password} = payload
        // const user= await this.getUserByEmail(email)

        // if(!user)   throw new Error('user not found')

        // const userSalt= user.salt
        // const userHashedPassword= this.generateHash(userSalt, password)

        // if(userHashedPassword !== user.password)    throw new Error('Incorrect Password')

        // // generate a token
        // const token= JWT.sign({ id: user.id, email: user.email }, JWT_SECRET)
        // return token
        return "hello"
    }
}

export default UserService