'use strict'

import { Schema, model } from 'mongoose'

const publicationSchema = Schema({
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
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
    comment: [{
        type: Schema.ObjectId,
        ref: 'comment'
    }]
}, {
    versionKey: false
})

export default model('publication', publicationSchema)