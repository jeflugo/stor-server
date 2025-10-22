import { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils/tryCatchWrapper'
import service from '../services/posts'

const getPosts = tryCatchWrapper(
	(req: Request, res: Response) => service.getPosts(),
	'GET_POSTS_ERROR'
)

const getSinglePost = tryCatchWrapper(
	(req: Request, res: Response) => service.getSinglePost(req),
	'GET_SINGLE_POST_ERROR'
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

const getPostComments = tryCatchWrapper(
	(req: Request, res: Response) => service.getPostComments(req),
	'GET_POST_COMMENTS_ERROR'
)

const deletePost = tryCatchWrapper(
	(req: Request, res: Response) => service.deletePost(req),
	'DELETE_POST_ERROR'
)

const interactWithComment = tryCatchWrapper(
	(req: Request, res: Response) => service.interactWithComment(req),
	'INTERACT_WITH_COMMENT_ERROR'
)

const editComment = tryCatchWrapper(
	(req: Request, res: Response) => service.editComment(req),
	'EDIT_COMMENT_ERROR'
)

const deleteComment = tryCatchWrapper(
	(req: Request, res: Response) => service.deleteComment(req),
	'DELETE_COMMENT_ERROR'
)

export {
	getPosts,
	getSinglePost,
	getOwnPosts,
	getPublicPosts,
	postPost,
	editPost,
	interactWithPost,
	getPostComments,
	deletePost,
	interactWithComment,
	editComment,
	deleteComment,
}
