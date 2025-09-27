import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getOwnPosts, getPublicPosts } from '../controllers/posts'

const router = Router()

router.get('/', authenticate, getOwnPosts)
router.get('/poeple/:username', getPublicPosts)

export { router }
