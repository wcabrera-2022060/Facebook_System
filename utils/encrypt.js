'use strict'

import { compare, hash } from 'bcrypt'

export const encrypt = async (password) => {
    try {
        return await hash(password, 5)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkPassword = async (password, hash) => {
    try {
        return await compare(password, hash)
    } catch (error) {
        console.error(error)
        return error
    }
}