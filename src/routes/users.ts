import { Router } from 'express'
import {
	// deleteBread,
	// resetBreads,
	// getBread,
	getUsers,
	postUser,
	// updateBread,
	// reorderBreads,
} from '../controllers/users'

const router = Router()

router.route('/').get(getUsers).post(postUser)
// .put(resetBreads)
// router.route('/:id').get(getBread).put(updateBread).delete(deleteBread)
// router.patch('/reorder-list', reorderBreads)

export { router }
