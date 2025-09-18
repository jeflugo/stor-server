import mongoose from 'mongoose'
import { TUser } from '../types'

const userSchema = new mongoose.Schema<TUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

const User = mongoose.model('users', userSchema)

export default User
