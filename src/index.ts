import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { router } from './routes'
import db from './config/mongo'

db().then(() => console.log('Connected to db'))

const app = express()
const port = process.env.PORT || 3000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(
	morgan((tokens, req, res) => {
		const venezuelaTime = new Date().toLocaleTimeString('en-US', {
			timeZone: 'America/Caracas',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})
		return [
			venezuelaTime,
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			'-',
			tokens['response-time'](req, res),
			'ms',
		].join(' ')
	})
)

app.use(
	cors({
		origin: CLIENT_URL,
	})
)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(router)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => {
	console.log(`Running on port: ${port}`)
})
