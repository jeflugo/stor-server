import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
	deleteComment,
	deletePost,
	editComment,
	editPost,
	getOwnPosts,
	getPostComments,
	getPosts,
	getPublicPosts,
	getSinglePost,
	interactWithComment,
	interactWithPost,
	postPost,
} from '../controllers/posts'
import { upload } from '../utils/multer'

const router = Router()

router.post('/', authenticate, upload.single('media'), postPost)
router.get('/', getPosts)
router.get('/single-post/:id', getSinglePost)
router.get('/me', authenticate, getOwnPosts)
router.get('/people/:username', getPublicPosts)
router.patch('/:id', authenticate, editPost)
router.delete('/:id', authenticate, deletePost)
router.patch('/actions/:id', interactWithPost)

// Comments
router.get('/comments/:id', getPostComments)
router.patch('/comment-actions/:id', interactWithComment)
router.patch('/comments/:id', authenticate, editComment)
router.put('/comments/:id', authenticate, deleteComment)

export { router }
