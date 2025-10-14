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

const editPost = tryCatchWrapper(
	(req: Request, res: Response) => service.editPost(req),
	'EDIT_POST_ERROR'
)

const interactWithPost = tryCatchWrapper(
	(req: Request, res: Response) => service.interactWithPost(req),
	'INTERACT_WITH_POST_ERROR'
)

export {
	getPosts,
	getOwnPosts,
	getPublicPosts,
	postPost,
	editPost,
	interactWithPost,
}
