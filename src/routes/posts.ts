import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
	editPost,
	getOwnPosts,
	getPosts,
	getPublicPosts,
	interactWithPost,
	postPost,
} from '../controllers/posts'
import { upload } from '../utils/multer'

const router = Router()

router.post('/', authenticate, upload.single('media'), postPost)
router.get('/', getPosts)
router.get('/me', authenticate, getOwnPosts)
router.get('/people/:username', getPublicPosts)
router.patch('/:id', authenticate, editPost)
router.patch('/actions/:id', interactWithPost)

export { router }
