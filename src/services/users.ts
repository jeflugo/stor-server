import { Request, Response } from 'express'
import User from '../models/users'
import { TUser } from '../types/users'
import jwt from 'jsonwebtoken'

const generateToken = (userId: string): string =>
	jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })

const registerUser = async (userData: TUser) => {
	const user = await User.create(userData)
	const token = generateToken(user._id.toString())
	return {
		message: 'User registered successfully',
		user,
		token,
	}
}

const loginUser = async (userData: TUser) => {
	const { email, password } = userData

	// Find user and include password
	const user = await User.findOne({ email }).select('+password')
	if (!user) return { message: 'Invalid credentials' }

	// Check password
	const isPasswordValid = await user.comparePassword(password)
	if (!isPasswordValid) return { message: 'Invalid credentials' }

	// Generate token
	const token = generateToken(user._id.toString())

	return {
		message: 'Login successful',
		user,
		token,
	}
}

const getCurrentUser = async (req: any) => {
	const userId = req.user?.userId

	if (!userId) {
		throw new Error('User not authenticated')
	}
	const user = await User.findById(userId).select('-password')
	if (!user) {
		throw new Error('User not found')
	}
	return user
}

const getPublicUser = async (req: Request) => {
	const username = req.params.username
	const user = await User.findOne({ username }).select('-password -email -role')
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
