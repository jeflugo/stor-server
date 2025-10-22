import mongoose from 'mongoose'
import { TUser } from '../types/users'
import bcrypt from 'bcryptjs'

export type TUserDocument = TUser &
	mongoose.Document & {
		comparePassword(candidatePassword: string): Promise<boolean>
	}

const AuthorSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		reuired: true,
	},
	username: {
		type: String,
		reuired: true,
	},
	avatar: {
		type: String,
	},
})

const UserSchema = new mongoose.Schema<TUserDocument>(
	{
		name: {
			type: String,
			required: true,
		},
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
		location: { type: String, default: '' },
		bio: { type: String, default: '' },
		avatar: { type: String, default: '' },
		followers: { type: [AuthorSchema], default: [] },
		following: { type: [AuthorSchema], default: [] },
		saved: { type: [String], default: [] },
		payOptions: { type: [String], default: [] },
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

// Hash password before saving
UserSchema.pre('save', async function (next) {
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
UserSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
	const user = this.toObject()
	delete user.password
	return user
}

const User = mongoose.model('User', UserSchema)

export default User
