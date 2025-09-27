import { Request, Response } from 'express'
import service from '../services/users'
import { tryCatchWrapper } from '../utils/tryCatchWrapper'
import { TUser, TUserInput, TUserLogin } from '../types'

const registerUser = tryCatchWrapper(
	(req: Request<{}, {}, TUserInput>, res: Response) =>
		service.registerUser(req.body),
	'REGISTER_USER_ERROR'
)

const loginUser = tryCatchWrapper(
	(req: Request<{}, {}, TUserLogin>, res: Response) =>
		service.loginUser(req.body),
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

export { registerUser, loginUser, getCurrentUser, getPublicUser }
