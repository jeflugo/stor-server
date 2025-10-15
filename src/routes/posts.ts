import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
	deletePost,
	editPost,
	getOwnPosts,
	getPostComments,
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
router.delete('/:id', authenticate, deletePost)
router.patch('/actions/:id', interactWithPost)
router.get('/comments/:id', getPostComments)

export { router }
