'use strict'

import { Router } from 'express'
import { validateJwt } from '../../middlewares/roles.js'
import { createComment, deleteComment, personalCommentaries, updateComment } from './comment.controller.js'

const api = Router()

api.post('/createComment', [validateJwt], createComment)
api.post('/personalCommentaries', [validateJwt], personalCommentaries)
api.put('/updateComment/:id', [validateJwt], updateComment)
api.delete('/deleteComment/:id', [validateJwt], deleteComment)

export default api