import { Request, Response } from 'express'
import service from '../services/users'
import { tryCatchWrapper } from '../utils/tryCatchWrapper'
import { TUserInput, TUserLogin } from '../types'

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

export { registerUser, loginUser }
