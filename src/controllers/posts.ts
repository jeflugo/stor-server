import { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils/tryCatchWrapper'
import service from '../services/posts'

const getOwnPosts = tryCatchWrapper(
	(req: Request, res: Response) => service.getOwnPosts(req),
	'REGISTER_USER_ERROR'
)
const getPublicPosts = tryCatchWrapper(
	(req: Request, res: Response) => service.getPublicPosts(req),
	'REGISTER_USER_ERROR'
)

export { getOwnPosts, getPublicPosts }
