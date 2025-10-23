import { TAuthor, TAuthRequest, TNotification, TUser } from '../types/users'
import jwt from 'jsonwebtoken'
import { Request } from 'express'
import User from '../models/users'
import Post from '../models/posts'

const generateToken = (userId: string): string =>
	jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })

const registerUser = async (userData: TUser) => {
	const { email, username } = userData

	// Check if username or email already exist
	const usernameExist = await User.findOne({ username })
	const emailExist = await User.findOne({ email })

	if (usernameExist || emailExist)
		return { success: false, usernameExist, emailExist }

	const user = await User.create(userData)
	const token = generateToken(user._id.toString())

	return {
		success: true,
		user,
		token,
	}
}

const loginUser = async (userData: TUser) => {
	const { email, password } = userData

	// Find user and include password
	const user = await User.findOne({ email }).select('+password')
	if (!user) return { success: false }

	// Check password
	const isPasswordValid = await user.comparePassword(password)
	if (!isPasswordValid) return { success: false }

	// Generate token
	const token = generateToken(user._id.toString())

	return {
		success: true,
		user,
		token,
	}
}

const getCurrentUser = async (req: TAuthRequest) =>
	await User.findById(req.user?.userId).select('-password')

const getPublicUser = async (req: Request) => {
	const username = req.params.username
	const user = await User.findOne({ username }).select('-password -email')
	if (!user) {
		throw new Error('User not found')
	}
	return user
}

const deleteUser = async (req: TAuthRequest) => {
	const userId = req.params.id
	const user = await User.findByIdAndDelete(userId)
	if (!user) throw new Error('User not found')
	const posts = await Post.deleteMany({ 'author.username': user.username })

	return true
}

const editUser = async (req: TAuthRequest) => {
	const userId = req.params.id
	const userInfo: Partial<TUser> = req.body
	const user = await User.findByIdAndUpdate(userId, userInfo)
	if (!user) throw new Error('User not found')

	return true
}

const followAction = async (req: TAuthRequest) => {
	const userToFollowId = req.params.id
	const { userId } = req.user!
	const { isFollowing } = req.body

	const user = await User.findById(userId)
	if (!user) throw new Error('User not found.')
	const userToFollow = await User.findById(userToFollowId)
	if (!userToFollow) throw new Error('User to follow not found.')

	if (!isFollowing) {
		user.following.push({
			_id: userToFollow._id,
			username: userToFollow.username,
			avatar: userToFollow.avatar,
		})
		userToFollow.followers.push({
			_id: user._id,
			username: user.username,
			avatar: user.avatar,
		})
	} else {
		const userTofollowIndex = user.following.findIndex(
			following => following._id.toString() === userToFollow._id.toString()
		)
		user.following.splice(userTofollowIndex, 1)

		const userIndex = userToFollow.followers.findIndex(
			following => following._id.toString() === user._id.toString()
		)
		userToFollow.followers.splice(userIndex, 1)
	}

	await user.save()
	await userToFollow.save()
	return user
}

const notifyUser = async (req: TAuthRequest) => {
	const newNotification = req.body as TNotification

	const userToNotify = await User.findById(req.params.id)
	if (!userToNotify) throw new Error('User to notify not found')

	switch (newNotification.type) {
		case 'like':
			userToNotify.notifications.push(newNotification)
			break
		case 'deleteLike':
			const notificationIndex = userToNotify.notifications.findIndex(
				noti =>
					noti.postId === newNotification.postId &&
					noti.author._id.toString() === newNotification.author._id.toString()
			)
			userToNotify.notifications.splice(notificationIndex, 1)
			break
		case 'comment':
			break
		case 'deleteComment':
			break

		default:
			break
	}
	await userToNotify.save()

	return true
}

export default {
	registerUser,
	loginUser,
	getCurrentUser,
	getPublicUser,
	deleteUser,
	editUser,
	followAction,
	notifyUser,
}
