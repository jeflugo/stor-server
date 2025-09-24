import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { TAuthRequest } from '../types'
import User from '../models/users'

export const authenticate = async (
	req: TAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '')

		if (!token) {
			return res
				.status(401)
				.json({ message: 'Access denied. No token provided.' })
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string
		}
		const user = await User.findById(decoded.userId).select('-password')

		if (!user) {
			return res.status(401).json({ message: 'Token is not valid.' })
		}

		req.user = {
			userId: user._id.toString(),
			email: user.email,
			role: user.role,
		}

		next()
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid.' })
	}
}

export const authorize = (...roles: string[]) => {
	return (req: TAuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({
				message: 'Access denied. Insufficient permissions.',
			})
		}
		next()
	}
}
