'use strict'

import Comment from '../comment/comment.model.js'
import Publication from '../publication/publication.model.js'

export const createComment = async (req, res) => {
    try {
        let { _id } = req.user
        let data = req.body
        data.user = _id
        const query = [{ path: 'user', select: '-password' }, { path: 'publication', populate: { path: 'user', select: '-password' } }]
        const required = ['title', 'text', 'publication']
        let missingData = required.filter(field => !data[field] || data[field].replaceAll(' ', '').length === 0)
        if (missingData.length > 0) return res.status(400).send({ message: `Missing required fields ${missingData.join(', ')}` })
        let comment = new Comment(data)
        await comment.save()
        await comment.populate(query)
        await Publication.findOneAndUpdate({_id: data.publication}, {$push: {comment: comment._id}})
        return res.send({ message: 'Comment created successfully', comment })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating comment' })
    }
}

export const personalCommentaries = async (req, res) => {
    try {
        let { _id } = req.user
        const query = [{ path: 'user', select: '-password' }, { path: 'publication', select: '-comment', populate: [{ path: 'user', select: '-password' }, { path: 'category' }] }]
        let comment = await Comment.find({ user: _id }).populate(query)
        if (!comment) return res.status(404).send({ message: 'Commentaries not found' })
        return res.send({ message: 'Your comments found', comment })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting your comments' })
    }
}

export const updateComment = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params
        let data = req.body
        const query = [{ path: 'user', select: '-password' }, { path: 'publication', select: '-comment', populate: [{ path: 'user', select: '-password' }, { path: 'category' }] }]
        let comment = await Comment.findOne({ _id: id })
        if (!comment) return res.status(404).send({ message: 'Comment not found' })
        if (comment.user.toString() === _id.toString()) {
            let updateComment = await Comment.findOneAndUpdate({ _id: id }, data, { new: true }).populate(query)
            if (!updateComment) return res.status(404).send({ message: 'Comment not found not updated' })
            return res.send({ message: 'Comment updated successfully', updateComment })
        } else {
            return res.status(401).send({ message: 'You cannot update this comment' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating comment' })
    }
}

export const deleteComment = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params
        const query = [{ path: 'user', select: '-password' }, { path: 'publication', select: '-comment', populate: [{ path: 'user', select: '-password' }, { path: 'category' }] }]
        let comment = await Comment.findOne({ _id: id })
        if (!comment) return res.status(404).send({ message: 'Comment not found' })
        if (comment.user.toString() === _id.toString()) {
            let deleteComment = await Comment.findOneAndDelete({ _id: id }).populate(query)
            if (!deleteComment) return res.status(404).send({ message: 'Comment not found not deleted' })
            return res.send({ message: 'Comment deleted succesfully', deleteComment })
        } else {
            return res.status(401).send({ message: 'You cannot delete this comment' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting comment' })
    }
}