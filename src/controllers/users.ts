import { Request, Response } from 'express'
import service from '../services/users'
import { tryCatchWrapper } from '../utils/tryCatchWrapper'

const getUsers = tryCatchWrapper(
	(req: Request, res: Response) => service.getUsers(),
	'GET_USERS_ERROR'
)

const postUser = tryCatchWrapper(
	(req: Request, res: Response) => service.postUser(req.body),
	'POST_USER_ERROR'
)

// const resetBreads = tryCatchWrapper(
// 	(req: Request, res: Response) => service.resetBreads(),
// 	'RESET_BREADS_ERROR'
// )

// const reorderBreads = tryCatchWrapper(
// 	(req: Request, res: Response) => service.reorderBreads(req.body),
// 	'REORDER_BREADS_ERROR'
// )

// const getBread = tryCatchWrapper(
// 	(req: Request, res: Response) => service.getBread(req.params.id),
// 	'GET_BREAD_ERROR'
// )

// const updateBread = tryCatchWrapper(
// 	(req: Request, res: Response) => service.updateBread(req.params.id, req.body),
// 	'UPDATE_BREAD_ERROR'
// )

// const deleteBread = tryCatchWrapper(
// 	(req: Request, res: Response) => service.deleteBread(req.params.id),
// 	'DELETE_BREAD_ERROR'
// )

export {
	getUsers,
	postUser,
	// resetBreads,
	// reorderBreads,
	// deleteBread,
	// getBread,
	// updateBread,
}
