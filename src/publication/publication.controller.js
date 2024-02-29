'use strict'

import Publication from '../publication/publication.model.js'

export const createPublication = async (req, res) => {
    try {
        let { _id } = req.user
        let data = req.body
        data.user = _id
        const required = ['title', 'category', 'text']
        let missingData = required.filter(field => !data[field] || data[field].replaceAll(' ', '').length === 0)
        if (missingData.length > 0) return res.status(400).send({ message: `Missing required fields ${missingData.join(', ')}` })
        let publication = new Publication(data)
        await publication.save()
        await publication.populate('user', '-__v -password')
        return res.send({ message: 'Publication created succesfully', publication })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating publication' })
    }
}

export const getPublications = async (req, res) => {
    try {
        let publication = await Publication.find({}).populate('user', '-__v -password')
        if (!publication) return res.status(404).send({ message: 'No posts to show' })
        return res.send({ message: 'List of publications', publication })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error  getting publications' })
    }
}

export const searchPublication = async (req, res) => {
    try {
        let { id } = req.params
        let publication = await Publication.findOne({ _id: id }).populate('user', '-__v -password')
        if (!publication) return res.status(404).send({ message: 'Publication not found' })
        return res.send({ message: 'Publication found', publication })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error searching publication' })
    }
}

export const updatePublication = async (req, res) => {
    try {
        let { id } = req.params
        let { _id } = req.user
        let data = req.body
        let publication = await Publication.findOne({ _id: id })
        if (!publication) return res.status(404).send({ message: 'Publication no found' })
        console.log(typeof (publication.user), typeof (_id))
        if (publication.user.toString() === _id.toString()) {
            let updatePublication = await Publication.findOneAndUpdate({ _id: id }, data, { new: true }).populate('user', '-__v -password')
            if (!updatePublication) return res.status(404).send({ message: 'Publication not found' })
            return res.send({ message: 'Publication updating successfully', updatePublication })
        } else {
            return res.status(401).send({ message: 'You cannot edit this post' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating publication' })
    }
}

export const deletePublication = async (req, res) => {
    try {
        let { id } = req.params
        let { _id } = req.user
        let publication = await Publication.findOne({ _id: id })
        if (!publication) return res.status(404).send({ message: 'Publication not found' })
        if (publication.user.toString() === _id.toString()) {
            let deletePublication = await Publication.findOneAndDelete({ _id: id })
            if (!deletePublication) return res.status(404).send({ message: 'Publication not found' })
            return res.send({ message: 'Publication deleted successfully' })
        } else {
            return res.status(401).send({ message: 'You cannot delete this post' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting publication' })
    }
}