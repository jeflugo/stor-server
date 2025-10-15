import { TUser } from '../types/users'
import jwt from 'jsonwebtoken'
import { Request } from 'express'
import User from '../models/users'

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

const getCurrentUser = async (req: any) =>
	await User.findById(req.user?.userId).select('-password')

const getPublicUser = async (req: Request) => {
	const username = req.params.username
	const user = await User.findOne({ username }).select('-password -email')
	if (!user) {
		throw new Error('User not found')
	}
	return user
}

export default {
	registerUser,
	loginUser,
	getCurrentUser,
	getPublicUser,
}
