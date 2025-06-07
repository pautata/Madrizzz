import { auth, db } from '../components/FirebaseConfig'
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore'

export function subscribeToFavorites(onChange) {
  const uid = auth.currentUser.uid
  const favsCol = collection(db, 'users', uid, 'favorites')
  const q = query(favsCol)

  const unsubscribe = onSnapshot(q, snapshot => {
    const favs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    onChange(favs)
  })

  return unsubscribe
}

export async function addFavorite(plan) {
  const uid = auth.currentUser.uid
  const favDoc = doc(db, 'users', uid, 'favorites', String(plan.id))
  await setDoc(favDoc, {
    nombre: plan.nombre,
    localizacion: plan.localizacion,
    precio: plan.precio,
    imagenUrl: plan.imagenUrl,
    url: plan.url,
    horarios: plan.horarios
  })
}

export async function removeFavorite(planId) {
  const uid = auth.currentUser.uid
  const favDoc = doc(db, 'users', uid, 'favorites', String(planId))
  await deleteDoc(favDoc)
}

export async function clearFavorites() {
  const uid = auth.currentUser.uid
  const favsCol = collection(db, 'users', uid, 'favorites')
  const snap = await getDocs(favsCol)
  if (snap.empty) return

  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()
}
