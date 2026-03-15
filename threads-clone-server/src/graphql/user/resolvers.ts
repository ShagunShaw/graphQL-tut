import type { CreateUserPayload, GetUSerTokenPayload } from "../../services/user.js"
import UserService from "../../services/user.js"

const queries = {
    getUserToken: async (parent: string, payload: GetUSerTokenPayload) => {
        const token= await UserService.getUserToken({
            email: payload.email,
            password: payload.password,
        })
        return token
    }
}

const mutations = {
    createUser: async (parent: string, payload: CreateUserPayload) => {
        const res= UserService.createUser(payload)
        // return res.id
        return "hello"
    }
}

export const resolvers = {queries, mutations}