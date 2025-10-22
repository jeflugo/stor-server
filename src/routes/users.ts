import { Router } from 'express'
import {
	registerUser,
	loginUser,
	getCurrentUser,
	getPublicUser,
	deleteUser,
	editUser,
	followAction,
} from '../controllers/users'
import { authenticate } from '../middleware/auth'

const router = Router()

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Protected routes
router.get('/me', authenticate, getCurrentUser)
router.get('/people/:username', getPublicUser)
router.delete('/:id', authenticate, deleteUser)
router.patch('/:id', authenticate, editUser)
router.patch('/follow-action/:id', authenticate, followAction)

export { router }
