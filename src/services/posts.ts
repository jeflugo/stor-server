import { Request } from 'express'
import Post from '../models/posts'
import { B2Service } from './b2'

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

const postPost = async (req: any) => {
	const { title, content } = req.body
	const author = req.user!.userId

	let media = []

	// If there's a media file, upload to Backblaze B2
	if (req.file) {
		const isVideo = req.file.mimetype.startsWith('video/')
		const fileType = isVideo ? 'videos' : 'images'
		const fileName = `${fileType}/${author}/${Date.now()}-${
			req.file.originalname
		}`

		const uploadResult = await B2Service.uploadFile(
			req.file.buffer,
			fileName,
			req.file.mimetype,
			isVideo
		)

		media.push({
			url: uploadResult.url,
			key: uploadResult.key,
			type: isVideo ? 'video' : 'image',
			size: uploadResult.size,
			thumbnail: uploadResult.thumbnail,
			duration: uploadResult.duration,
		})
	}

	const post = await Post.create({
		author,
		title,
		content,
		media,
	})

	// Populate user data for response
	// await post.populate('userId', 'username avatar')

	return post
}

const getPublicPosts = async (req: Request) => {
	const username = req.params.username
	const userPosts = await Post.find({ username })
	if (!userPosts) {
		throw new Error('User not found')
	}
	return userPosts
}

export default { getOwnPosts, getPublicPosts, postPost }
