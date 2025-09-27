import { Request } from 'express'
import Post from '../models/posts'

const getOwnPosts = async (req: any) => {
	const userId = req.user?.userId

	if (!userId) {
		throw new Error('User not authenticated')
	}
	const userPosts = await Post.find({ userId })
	if (!userPosts) {
		throw new Error('User have no posts')
	}
	return userPosts
}

const getPublicPosts = async (req: Request) => {
	const username = req.params.username
	const userPosts = await Post.find({ username })
	if (!userPosts) {
		throw new Error('User not found')
	}
	return userPosts
}

export default { getOwnPosts, getPublicPosts }
