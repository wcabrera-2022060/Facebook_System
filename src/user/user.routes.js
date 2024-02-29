'use strict'

import { Router } from 'express'
import { createUser, getUsers, login, searchUser, updatePassword, updateUser } from './user.controller.js'
import { validateJwt } from '../../middlewares/roles.js'

const api = Router()

api.post('/createUser', createUser)
api.post('/login', login)
api.get('/getUsers', [validateJwt], getUsers)
api.post('/searchUser/:id', [validateJwt], searchUser)
api.put('/updateUser', [validateJwt], updateUser)
api.put('/updatePassword', [validateJwt], updatePassword)

export default api