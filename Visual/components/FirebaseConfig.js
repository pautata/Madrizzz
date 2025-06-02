// src/components/FirebaseConfig.js

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

// 1) Inicializa la app de Firebase
export const app = initializeApp(firebaseConfig)

// 2) Inicializa Auth con persistencia en AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

// 3) Exporta el Auth “estándar” para listeners
export const defaultAuth = getAuth(app)

// 4) Inicializa y exporta Firestore
export const db = getFirestore(app)

// 5) Función de cierre de sesión
export const signOut = () => firebaseSignOut(defaultAuth)
