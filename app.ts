import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import routes from './src/routes'
import { data } from './src/bot'

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())
app.set('view engine', 'ejs')
app.set('views', './views')
app.use('/files', express.static('public'))
app.use(routes)

export default app


