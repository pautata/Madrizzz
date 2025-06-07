import Constants from 'expo-constants'
import axios from 'axios'

const getHost = () => {
  const debuggerHost = Constants.manifest?.debuggerHost
    || Constants.manifest2?.extra?.expoClientHost
    || ''

  if (debuggerHost) {
    return debuggerHost.split(':')[0]
  }

  if (Constants.platform?.android) {
    return '10.0.2.2'
  }

  return 'localhost'
}

const host = '5f44-84-127-42-89.ngrok-free.app'

export const api = axios.create({
  baseURL: `https://${host}/api`,
  timeout: 5000,
})
