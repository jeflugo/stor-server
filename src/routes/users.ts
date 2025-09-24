import { Router } from 'express'
import {
	registerUser,
	loginUser,
	getCurrentUser,
	// updateUser,
	// deleteUser,
	// getAllUsers
} from '../controllers/users'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Protected routes
router.get('/me', authenticate, getCurrentUser)
// router.put('/me', authenticate, updateUser);
// router.delete('/me', authenticate, deleteUser);

// // Admin only routes
// router.get('/all', authenticate, authorize('admin'), getAllUsers);

export { router }
