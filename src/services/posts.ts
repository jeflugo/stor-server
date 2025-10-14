import { Request } from 'express'
import Post from '../models/posts'
import { B2Service } from './b2'
import { TComment, TPost } from '../types/posts'
import mongoose from 'mongoose'

const getPosts = async () => {
	const posts = await Post.find()

	const fullPosts = await Promise.all(
		posts.map(async post => await post.populate('author', 'username avatar'))
	)

	return fullPosts
}

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
	const author = req.user!.userId
	// const author = await User.findById(
	// 	req.user!.userId,
	// 	'-_id name username avatar'
	// )

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

	const postWithAuthor = await Post.findById(post._id).populate(
		'author',
		'username avatar'
	)

	console.log(postWithAuthor)
	return postWithAuthor
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
	const { type, author, content } = req.body
	const postId = req.params.id

	const post = await Post.findById(postId)

	if (!post) throw new Error('Post not found')

	//* FOR LIKES
	if (type === 'like') return

	//* FOR COMMENTS
	const authorId = mongoose.Types.ObjectId.createFromHexString(author)
	const newComment: TComment = { author: authorId, content }

	post.comments.push(newComment)

	await post.save()
	await post.populate('comments.author', 'username avatar')

	return post
}

const getPostComments = async (req: Request) => {
	const post = await Post.findById(req.params.id)
	if (!post) throw new Error('Post not found')

	await post.populate('comments.author', 'username avatar')

	return post.comments
}

export default {
	getPosts,
	getOwnPosts,
	getPublicPosts,
	postPost,
	editPost,
	interactWithPost,
	getPostComments,
}
