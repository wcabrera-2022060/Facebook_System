'use strict'

import { Schema, model } from 'mongoose'

const commentSchema = Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    publication: {
        type: Schema.ObjectId,
        ref: 'publication',
        required: true
    }
}, {
    versionKey: false
})

export default model('comment', commentSchema)