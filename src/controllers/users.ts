import { Request, Response } from 'express'
import service from '../services/users'
import { tryCatchWrapper } from '../utils/tryCatchWrapper'

const registerUser = tryCatchWrapper(
	(req: Request, res: Response) => service.registerUser(req.body),
	'REGISTER_USER_ERROR'
)

const loginUser = tryCatchWrapper(
	(req: Request, res: Response) => service.loginUser(req.body),
	'LOGIN_USER_ERROR'
)

const getCurrentUser = tryCatchWrapper(
	(req: Request, res: Response) => service.getCurrentUser(req),
	'GET_CURRENT_USER_ERROR'
)

const getPublicUser = tryCatchWrapper(
	(req: Request, res: Response) => service.getPublicUser(req),
	'GET_PUBLIC_USER_ERROR'
)

const deleteUser = tryCatchWrapper(
	(req: Request, res: Response) => service.deleteUser(req),
	'DELETE_USER_ERROR'
)

const editUser = tryCatchWrapper(
	(req: Request, res: Response) => service.editUser(req),
	'EDIT_USER_ERROR'
)

const followAction = tryCatchWrapper(
	(req: Request, res: Response) => service.followAction(req),
	'FOLLOW_ACTION_ERROR'
)

const notifyUser = tryCatchWrapper(
	(req: Request, res: Response) => service.notifyUser(req),
	'NOTIFY_USER_ERROR'
)

export {
	registerUser,
	loginUser,
	getCurrentUser,
	getPublicUser,
	deleteUser,
	editUser,
	followAction,
	notifyUser,
}
