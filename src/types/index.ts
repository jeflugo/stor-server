import { Request } from 'express'

export type TUser = {
	_id?: string
	name: string
	email: string
	password: string
	role: 'user' | 'admin'
}

export type TUserInput = {
	name: string
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
