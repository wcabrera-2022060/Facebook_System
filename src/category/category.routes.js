'use strict'

import { Router } from 'express'
import { validateJwt } from '../../middlewares/roles.js'
import { createCategory, getCategories, searchCategories, updateCategory } from './category.controller.js'

const api = Router()

api.post('/createCategory', [validateJwt], createCategory)
api.get('/getCategories', [validateJwt], getCategories)
api.post('/searchCategory/:id', [validateJwt], searchCategories)
api.put('/updateCategory/:id', [validateJwt], updateCategory)

export default api