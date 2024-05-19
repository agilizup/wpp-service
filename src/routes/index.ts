import { Router } from 'express'
import { sendMessage, currentClient } from '../bot'
import { createSession, logout, getConnectionState } from '../bot'

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

// routes.get('/logout', (req, res) => {
//   const logoutWpp = () => {
//     logout().then((response) => {
//       res.json({ response })
//     }).catch((erro) => {
//       res.status(500).json(erro)
//     })
//
//   }
//   logoutWpp()
// })

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

export default routes
