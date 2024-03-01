'use strict'

import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import { dataUser } from '../../utils/validations.js'
import User from './user.model.js'

export const createUser = async (req, res) => {
    try {
        let data = req.body
        const required = ['name', 'surname', 'email', 'username', 'password']
        let missingData = required.filter(field => !data[field] || data[field].replaceAll(' ', '').length === 0)
        if (missingData.length > 0) return res.status(400).send({ message: `Missing required fields ${missingData.join(', ')}` })
        let user = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] })
        if (user) return res.status(409).send({ message: 'Username or email not available' })
        data.password = await encrypt(data.password)
        user = new User(data)
        await user.save()
        return res.send({ message: 'User created successfully', user })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating user' })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password, email } = req.body
        let user = await User.findOne({ $or: [{ username: username }, { email: email }] })
        if (user && await checkPassword(password, user.password)) {
            let userInfo = {
                uid: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                username: user.username,
            }
            let token = await generateJwt(userInfo)
            return res.send({
                message: `Welcome ${userInfo.name}`,
                userInfo,
                token
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Failed to login' })
    }
}

export const getUsers = async (req, res) => {
    try {
        let users = await User.find({}, { password: 0 })
        if (!users) return res.status(404).send({ message: 'Users not found' })
        return res.send({ message: 'Users found:', users })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting users' })
    }
}

export const searchUser = async (req, res) => {
    try {
        let { id } = req.params
        let user = await User.findOne({ _id: id }, { password: 0 })
        if (!user) return res.status(404).send({ message: 'User not found' })
        return res.send({ message: 'User found:', user })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error searching user' })
    }
}

export const updateUser = async (req, res) => {
    try {
        let { _id } = req.user
        let {id} = req.params
        let data = req.body
        if(id.toString() === _id.toString()){
            let update = dataUser(data)
            if (!update) return res.status(400).send({ message: 'Incorrect data has been entered or data is missing' })
            let user = await User.findOneAndUpdate({ _id: _id }, data, { new: true })
            if (!user) return res.status(404).send({ message: 'Your user not found, not updated' })
            return res.send({ message: 'User updated successfully', user })
        }else{
            return res.status(401).send({message: 'You cannot edit his profile'})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating user' })
    }
}

export const updatePassword = async (req, res) => {
    try {
        let { _id } = req.user
        let { oldPassword, newPassword } = req.body
        let { password } = await User.findOne({ _id: _id })
        if (!password) return res.status(404).send({ message: 'User not found' })
        if (await checkPassword(oldPassword, password)) {
            let user = await User.findOneAndUpdate({ _id: _id }, { password: await encrypt(newPassword) }, { new: true },)
            if (!user) return res.status(404).send({ message: 'Error updating password' })
            return res.send({ message: 'Updating password successfully' })
        }
        return res.status(404).send({ message: 'Need to enter your old password to update' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating password' })
    }
}