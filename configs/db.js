'use strict'

import mongoose from 'mongoose'

export const connect = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | could not be connect to mongodb')
            mongoose.disconnect()
        })
        mongoose.connection.on('connected', () => console.log('Connect to MongoDB'))
        return await mongoose.connect(process.env.URL_DB)
    } catch (error) {
        console.error('Database connection failed', error)
    }
}