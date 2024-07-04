import { Router } from 'express'
import { createSession, logout, getConnectionState, sendMessage, currentClient, data } from '../bot'
import app from "../../app";

const routes = Router()

routes.post('/send-message', async (req, res) => {
  const { phone, message } = req.body
  await sendMessage(phone, message, res)
})

routes.get('/start', (req, res) => {
  const initial = () => {
    createSession().then((response) => {
      res.json({ response })
    }).catch((erro) => {
      res.status(500).json(erro)
    })

  }
  initial()
})

routes.get('/logout', (req, res) => {
  const logoutWpp = () => {
    logout().then((response) => {
      res.json({ response })
    }).catch((erro) => {
      res.status(500).json(erro)
    })

  }
  logoutWpp()
})

routes.get('/status', (req, res) => {
  if (!currentClient) {
    return res.status(500).json({ data: 'Not connected' })
  }
  const getStatus = () => {
    getConnectionState(res).then((response) => {
      res.json({ response })
    }).catch((erro) => {
      res.status(500).json(erro)
    })

  }
  getStatus()
})

routes.get('/', (req, res) => {
  const apiKey = process.env['WHATSAPP_SERVICE_API_KEY']

  if (!res.req?.query?.apiKey || !apiKey || res.req?.query?.apiKey !== apiKey) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  res.render('index', data)
})

export default routes
