import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getOwnPosts, getPublicPosts, postPost } from '../controllers/posts'
import { upload } from '../utils/multer'

const router = Router()

router.post('/', authenticate, upload.single('media'), postPost)
router.get('/', authenticate, getOwnPosts)
router.get('/poeple/:username', getPublicPosts)

export { router }
