import { Request } from 'express'
import Post from '../models/posts'
import { B2Service } from './b2'
import { TComment, TPost } from '../types/posts'
import mongoose from 'mongoose'
import User from '../models/users'

const getPosts = async () => {
	const posts = await Post.find()

	const fullPosts = await Promise.all(
		posts.map(async post => await post.populate('author', 'username avatar'))
	)

	return fullPosts
}

const getPostComments = async (req: Request) => {
	const post = await Post.findById(req.params.id)
	if (!post) throw new Error('Post not found')

	await post.populate('comments.author', 'username avatar')

	return post.comments
}

const getOwnPosts = async (req: any) => {
	const { userId } = req.user
	const posts = await Post.find({
		author: userId,
	})
	if (posts.length === 0) return null

	// const modifiedPosts = await Promise.all(
	// 	posts.map(async post => {
	// 		if (!post.media) return post
	// 		post.media = await Promise.all(
	// 			post.media.map(async mediaItem => {
	// 				mediaItem.url = await B2Service.getSignedUrl(mediaItem.key)
	// 				return mediaItem
	// 			})
	// 		)
	// 		return post
	// 	})
	// )

	return posts
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

	const postWithAuthor = await Post.findById(post._id).populate(
		'author',
		'username avatar'
	)

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

const interactWithPost = async (req: Request) => {
	const { type, author, content } = req.body
	const postId = req.params.id

	const user = await User.findById(author)
	const post = await Post.findById(postId)
	if (!post) throw new Error('Post not found')
	if (!user) throw new Error('User not found')

	const validAuthorId = mongoose.Types.ObjectId.createFromHexString(author)
	const validPostId = mongoose.Types.ObjectId.createFromHexString(postId)
	//* FOR LIKES
	if (type === 'like') {
		console.log('like')
		if (post.likes.includes(validAuthorId)) {
			post.likes.splice(post.likes.indexOf(validAuthorId), 1)
		} else {
			post.likes.push(validAuthorId)
		}
		await post.save()

		if (user.likes.includes(validPostId)) {
			user.likes.splice(user.likes.indexOf(validPostId), 1)
		} else {
			user.likes.push(validPostId)
		}
		await user.save()
		return true
	} else {
		console.log('comment')
		//* FOR COMMENTS

		post.comments.push({ author: validAuthorId, content })
		await post.save()
		await post.populate('comments.author', 'username avatar')

		user.comments.push({ postId: validPostId, content })
		await user.save()
		return true
	}
}

const editPost = async (req: Request) => {
	const { title, content } = req.body
	const postData: Partial<TPost> = {
		title,
		content,
	}
	const post = await Post.findByIdAndUpdate(req.params.id, postData)
	if (!post) throw new Error('Post not found')

	return true
}

const deletePost = async (req: Request) => {
	const post = await Post.findByIdAndDelete(req.params.id)
	if (!post) throw new Error('Post not found')
	console.log(post)

	return true
}

export default {
	getPosts,
	getOwnPosts,
	getPublicPosts,
	interactWithPost,
	getPostComments,
	postPost,
	editPost,
	deletePost,
}
