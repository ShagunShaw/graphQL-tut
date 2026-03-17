import type { CreateUserPayload, GetUSerTokenPayload } from "../../services/user.js"
import UserService from "../../services/user.js"

const queries = {
    getUserToken: async (parent: string, payload: GetUSerTokenPayload) => {
        const token= await UserService.getUserToken({
            email: payload.email,
            password: payload.password,
        })
        return token
    },

    getCurrentLoggedInUser: async (parent, params, context) => {
        /** Coz our context looks like this:
         * context = {
                        user: { id: "123", email: "john@gmail.com" }
                     }
         */
        if(context && context.user)
        {
            const id= context.user.id
            const user= UserService.getUserByID(id)
            return user;
        }

        throw new Error("No user found")
    }
}

const mutations = {
    createUser: async (parent: string, payload: CreateUserPayload) => {
        const res= UserService.createUser(payload)
        return res
    }
}

export const resolvers = {queries, mutations}