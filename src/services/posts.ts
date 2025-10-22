import { Request } from 'express'
import Post from '../models/posts'
import { B2Service } from './b2'
import { TAuthor, TPost } from '../types/posts'
import User from '../models/users'

const getPosts = async () => await Post.find()

const getSinglePost = async (req: Request) => {
	const { id } = req.params
	const post = await Post.findById(id)
	return post
}

const getPostComments = async (req: Request) => {
	const post = await Post.findById(req.params.id)
	if (!post) throw new Error('Post not found')

	return post.comments
}

const getOwnPosts = async (req: any) => {
	const { userId } = req.user
	const posts = await Post.find({
		'author._id': userId,
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
	const authorId = req.user!.userId

	const user = await User.findById(authorId)
	if (!user) throw new Error('asdasd')
	const author: TAuthor = {
		_id: user._id,
		username: user.username,
		avatar: user.avatar,
	}

	let media = []

	// If there's a media file, upload to Backblaze B2
	if (req.file) {
		const isVideo = req.file.mimetype.startsWith('video/')
		const fileType = isVideo ? 'videos' : 'images'
		const fileName = `${fileType}/${authorId}/${Date.now()}-${
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

const interactWithPost = async (req: Request) => {
	const { type, author: authorId, content } = req.body
	const postId = req.params.id

	const user = await User.findById(authorId)
	const post = await Post.findById(postId)
	if (!post) throw new Error('Post not found')
	if (!user) throw new Error('User not found')
	const author: TAuthor = {
		_id: user._id,
		username: user.username,
		avatar: user.avatar,
	}

	//* FOR LIKES
	if (type === 'like') {
		const likeIndex = post.likes.findIndex(
			like => like._id.toString() === author._id.toString()
		)
		if (likeIndex !== -1) {
			post.likes.splice(likeIndex, 1)
		} else {
			post.likes.push(author)
		}
		await post.save()

		return true
	} else {
		//* FOR COMMENTS
		post.comments.push({ author: author, content })
		await post.save()

		return post.comments[post.comments.length - 1]
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

const interactWithComment = async (req: Request) => {
	const { type, author: authorId, commentId } = req.body
	const postId = req.params.id

	const user = await User.findById(authorId)
	const post = await Post.findById(postId)
	if (!user) throw new Error('User not found')
	if (!post) throw new Error('Post not found')
	const author: TAuthor = {
		_id: user._id,
		username: user.username,
		avatar: user.avatar,
	}

	const commentIndex = post.comments.findIndex(
		comment => comment._id?.toString() === commentId
	)
	if (commentIndex === -1) throw new Error('Comment not found')

	if (type === 'like') {
		const likeIndex = post.comments[commentIndex].likes!.findIndex(
			like => like._id.toString() === author._id.toString()
		)
		if (likeIndex !== -1) {
			post.comments[commentIndex].likes!.splice(likeIndex, 1)
		} else {
			post.comments[commentIndex].likes!.push(author)
		}
		await post.save()
		return true
	}
}

const editComment = async (req: Request) => {
	const { content, commentId } = req.body
	const post = await Post.findById(req.params.id)
	if (!post) throw new Error('Post not found')
	const commentIndex = post.comments.findIndex(
		comment => comment._id?.toString() === commentId
	)
	post.comments[commentIndex].content = content
	await post.save()

	return true
}

const deleteComment = async (req: Request) => {
	const { commentId } = req.body
	const post = await Post.findById(req.params.id)
	if (!post) throw new Error('Post not found')
	const commentIndex = post.comments.findIndex(
		comment => comment._id?.toString() === commentId
	)
	post.comments.splice(commentIndex, 1)

	await post.save()

	return true
}

export default {
	getPosts,
	getSinglePost,
	getOwnPosts,
	getPublicPosts,
	interactWithPost,
	getPostComments,
	postPost,
	editPost,
	deletePost,
	interactWithComment,
	editComment,
	deleteComment,
}
