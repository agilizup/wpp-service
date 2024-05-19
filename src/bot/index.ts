import { create, Whatsapp } from '@wppconnect-team/wppconnect'
import { io } from '../../server'
import { BehaviorSubject } from 'rxjs'
import { Response } from 'express'

export let qrCodeBase64 = new BehaviorSubject('')
export let sessionStatus = new BehaviorSubject('')
export let sessionName = new BehaviorSubject('')
export let currentClient: Whatsapp

export const data = {
  qrcode: qrCodeBase64.value,
  status: sessionStatus.value,
  session: sessionName.value,
}

export const createSession = async () => {
  try {
    const client = await create({
      puppeteerOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      session: 'agilizone',
      catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
        if (base64Qrimg) {
          qrCodeBase64.next(base64Qrimg)
          io.emit('qrcode', qrCodeBase64.value)
          //  console.log(this.qrCodeBase64.value)
        }
        console.log('Number of attempts to read the qrcode: ', attempts)
        console.log('Terminal qrcode: ', asciiQR)
        //  console.log('base64 image string qrcode: ', base64Qrimg);
        // console.log('urlCode (data-ref): ', urlCode);
      },
      statusFind: (statusSession, session) => {
        console.log('Status Session: ', statusSession)
        if (statusSession) {
          sessionStatus.next(statusSession)
          io.emit('status', sessionStatus.value)
          console.log(sessionStatus)
        }
        //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
        //Create session wss return "serverClose" case server for close
        console.log('Session name: ', session)
        if (session) {
          sessionName.next(session)
          io.emit('session', sessionName.value)
        }
      },
      onLoadingScreen: (percent, message) => {
        console.log('LOADING_SCREEN', percent + '%', message)
        io.emit('loading', `LOADING_SCREEN ${percent}% ${message}`)
      },
      autoClose: 300000,
      disableWelcome: true,
    })
    if (client) {
      currentClient = client
      start(client)
    }

  } catch (e) {
    console.log(e)
    return e
  }
}

const start = (client: Whatsapp) => {
  currentClient = client
  client.onMessage((message) => {
    if (message.body === 'Hello') {
      client
        .sendText(message.from, 'Hello, how I may help you?')
        .then((result) => {
          console.log('Result: ', result) //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro) //return object error
        })
    }
  })
}

export const logout = () => {
  return currentClient.logout()
}

export const getConnectionState = (res: Response) => {
  return currentClient.getConnectionState()
}

export const sendMessage = async (number: string, message: string, res: Response) => {
  const apiKey = process.env['WHATSAPP_SERVICE_API_KEY']

  if (!res.req?.query?.apiKey || !apiKey || res.req?.query?.apiKey !== apiKey) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  if (!currentClient) {
    return res.status(400).json({ message: 'No available connection' })
  }

  if (!number || number.length < 11) {
    return res.status(422).json({ message: 'Invalid phone number' })
  }

  try {
    const result = await currentClient.sendText(`${number}@c.us`, message)
    return res.json({ message: 'Message sent!' })
  } catch (error) {
    console.warn('Error sending message: ', (error as Error).message)
    return res.status(500).json({
      message: 'Message could be sent',
      error
    })
  }
}
