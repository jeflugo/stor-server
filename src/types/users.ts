import { Request } from 'express'
import mongoose from 'mongoose'

export type TUserComment = {
	postId: mongoose.Types.ObjectId
	content: string
}

export type TAuthor = {
	_id: mongoose.Types.ObjectId
	username: string
	avatar?: string
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
	followers: TAuthor[]
	following: TAuthor[]
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
