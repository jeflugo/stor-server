import { Request } from 'express'

export type TUser = {
	_id?: string
	username: string
	email: string
	password: string
	role: 'user' | 'admin'
}

export type TUserInput = {
	username: string
	email: string
	password: string
	role?: 'user' | 'admin'
}

export type TUserLogin = {
	email: string
	password: string
}

export type TAuthRequest = Request & {
	user?: {
		userId: string
		email: string
		role: string
	}
}
