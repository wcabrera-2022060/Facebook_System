'use strict'

import Category from './category.model.js'

export const createCategory = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'Category created successfully', category })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating category' })
    }
}

export const getCategories = async (req, res) => {
    try {
        let category = await Category.find({})
        if (!category) return res.status(404).send({ message: 'Categories not found' })
        return res.send({ message: 'Categories found', category })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting categories' })
    }
}

export const searchCategories = async (req, res) => {
    try {
        let { id } = req.params
        let category = await Category.find({ _id: id })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        return res.send({ message: 'Category found', category })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error searching category' })
    }
}

export const updateCategory = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let category = await Category.findOneAndUpdate({ _id: id }, data, { new: true })
        if (!category) return res.status(404).send({ message: 'Category not found not updated' })
        return res.send({ message: 'Category updated successfully', category })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating category' })
    }
}