import { initializeApp } from "firebase/app"
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  signOut as firebaseSignOut
} from "firebase/auth"
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  query
} from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
  apiKey:            "AIzaSyDYF27EcO-xNC5O9EVKQie6sujToLBiauo",
  authDomain:        "madrizzz.firebaseapp.com",
  projectId:         "madrizzz",
  storageBucket:     "madrizzz.appspot.com",
  messagingSenderId: "938450749179",
  appId:             "1:938450749179:android:573c7c34781eee2507d25e"
}

export const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})
export const defaultAuth = getAuth(app)
export const db = getFirestore(app)
export const signOut = () => firebaseSignOut(defaultAuth)
