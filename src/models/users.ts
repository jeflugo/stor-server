import mongoose from 'mongoose'
import { TUser } from '../types'
import bcrypt from 'bcryptjs'

export type TUserDocument = TUser &
	mongoose.Document & {
		comparePassword(candidatePassword: string): Promise<boolean>
	}

const userSchema = new mongoose.Schema<TUserDocument>(
	{
		username: {
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
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()

	try {
		const salt = await bcrypt.genSalt(12)
		this.password = await bcrypt.hash(this.password, salt)
		next()
	} catch (error: any) {
		next(error)
	}
})

// Compare password method
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
	const user = this.toObject()
	delete user.password
	return user
}

const User = mongoose.model('users', userSchema)

export default User
