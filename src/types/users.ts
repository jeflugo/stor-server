import { Request } from 'express'
import mongoose from 'mongoose'

export type TUserComment = {
	postId: mongoose.Types.ObjectId
	content: string
}

export type TUser = {
	_id: mongoose.Types.ObjectId
	name: string
	username: string
	email: string
	password: string
	bio?: string
	avatar?: string
	location?: string
	followers: string[]
	following: string[]
	saved: string[]
	payOptions: string[]
}

export type TAuthRequest = Request & {
	user?: {
		username: string
		userId: mongoose.Types.ObjectId
		email: string
	}
}
