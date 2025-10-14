import { Request } from 'express'
import Post from '../models/posts'
import { B2Service } from './b2'
import User from '../models/users'
import { TPost } from '../types/posts'

const getPosts = async () => await Post.find()

const getOwnPosts = async (req: any) => {
	const { username } = req.user!

	if (!username) {
		throw new Error('User not authenticated')
	}
	const posts = await Post.find({
		'author.username': username,
	})
	if (!posts) {
		throw new Error('User have no posts')
	}

	const modifiedPosts = await Promise.all(
		posts.map(async post => {
			if (!post.media) return post
			post.media = await Promise.all(
				post.media.map(async mediaItem => {
					mediaItem.url = await B2Service.getSignedUrl(mediaItem.key)
					return mediaItem
				})
			)
			return post
		})
	)

	return modifiedPosts
}

const postPost = async (req: any) => {
	const { title, content } = req.body
	// const author = req.user!.userId
	const author = await User.findById(
		req.user!.userId,
		'-_id name username avatar'
	)

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

	return post
}

const getPublicPosts = async (req: Request) => {
	const username = req.params.username
	const userPosts = await Post.find({ 'author.username': username })
	if (!userPosts) {
		throw new Error('User not found')
	}
	return userPosts
}

const editPost = async (req: Request) => {
	// let { title, content } = req.body
	// let post = await Post.findById(req.params.id)
	// if (!post) {
	// 	throw new Error('Post not found')
	// }
	// post.title = title
	// post.content = content
	// await post.save()
	// return post
	console.log('edit postttttttttt')
}

const interactWithPost = async (req: Request) => {
	const postChanges: Partial<TPost> = req.body

	const updatedPost = await Post.findByIdAndUpdate(req.params.id, postChanges)

	if (!updatedPost) {
		throw new Error('Post not found')
	}

	return {
		success: true,
	}
}

export default {
	getPosts,
	getOwnPosts,
	getPublicPosts,
	postPost,
	editPost,
	interactWithPost,
}
