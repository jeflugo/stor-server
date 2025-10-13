import { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils/tryCatchWrapper'
import service from '../services/posts'

const getPosts = tryCatchWrapper(
	(req: Request, res: Response) => service.getPosts(),
	'GET_POSTS_ERROR'
)

const getOwnPosts = tryCatchWrapper(
	(req: Request, res: Response) => service.getOwnPosts(req),
	'GET_OWN_POSTS_ERROR'
)
const postPost = tryCatchWrapper(
	(req: Request, res: Response) => service.postPost(req),
	'POST_POST_ERROR'
)

const getPublicPosts = tryCatchWrapper(
	(req: Request, res: Response) => service.getPublicPosts(req),
	'GET_PUBLIC_POSTS_ERROR'
)

export { getPosts, getOwnPosts, getPublicPosts, postPost }
