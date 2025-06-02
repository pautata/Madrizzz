// src/api.js
import Constants from 'expo-constants'
import axios from 'axios'

/**
 * Obtiene la IP del host de debugging (en tunnel/LAN Expo),
 * o usa 'localhost' en un emulador Android estándar.
 */
const getHost = () => {
  // Constants.manifest en SDK ≥ 49 es undefined, en SDK 48 y anteriores:
  const debuggerHost = Constants.manifest?.debuggerHost
    || Constants.manifest2?.extra?.expoClientHost // en algunos setups con app.config.js
    || ''
  if (debuggerHost) {
    return debuggerHost.split(':')[0]
  }
  // Fallback si no hay debuggerHost: en iOS simulador 'localhost', Android emu 10.0.2.2
  if (Constants.platform?.android) {
    return '10.0.2.2'
  }
  return 'localhost'
}

const host = '85f0-88-26-76-255.ngrok-free.app'

export const api = axios.create({
  baseURL: `https://${host}/api`,
  timeout: 5000,
})

// Ejemplo de uso:
// import { api } from './src/api'
// const { data } = await api.get('/planes/filter', { params: { dia: 'LUNES' } })
