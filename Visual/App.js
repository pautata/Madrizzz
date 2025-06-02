// App.js
import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import Constants from 'expo-constants'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen      from './components/LoginScreen'
import TopBar           from './components/TopBar'
import FilterModal      from './components/FilterModal'
import FinishedModal    from './components/FinishedModal'
import BottomBar        from './components/BottomBar'
import Swipes           from './components/Swipes'
import FavoritesScreen  from './components/FavoritesScreen'
import PlanDetailScreen from './components/PlanDetailScreen'

import { auth } from './components/FirebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { api } from './src/api'

import {
  subscribeToFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites
} from './src/FavoritesService'

const Stack = createStackNavigator()

export default function App() {
  const [user,         setUser]         = useState(null)
  const [plans,        setPlans]        = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites,    setFavorites]    = useState([])
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [filters,      setFilters]      = useState({
    dia: '', horaMin: '', horaMax: '', precioMin: '', precioMax: ''
  })
  const [finished,     setFinished]     = useState(false)
  const swipesRef = useRef(null)

  // 1) Observa el estado de autenticación
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return () => unsub()
  }, [])

  // 2) Cuando cambian user o filtros → fetch planes
  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const { data } = await api.get('/planes/filter', {
          params: {
            ...(filters.dia       ? { dia: filters.dia }       : {}),
            ...(filters.horaMin   ? { horaMin: filters.horaMin } : {}),
            ...(filters.horaMax   ? { horaMax: filters.horaMax } : {}),
            ...(filters.precioMin ? { precioMin: filters.precioMin } : {}),
            ...(filters.precioMax ? { precioMax: filters.precioMax } : {})
          }
        })
        setPlans(data)
        setCurrentIndex(0)
        setFinished(false)
      } catch (err) {
        Alert.alert('Error al obtener los planes', err.message)
      }
    })()
  }, [filters, user])

  // 3) Suscripción a Firestore → favoritos “por usuario”
  useEffect(() => {
    if (!user) return
    const unsub = subscribeToFavorites(setFavorites)
    return () => unsub()
  }, [user])

  // 4) Filtros
  const openFilters  = () => setFiltersVisible(true)
  const applyFilters = nf => { setFilters(nf); setFiltersVisible(false) }

  // 5) Swipe + favoritos
  const nextPlan = () => {
    if (currentIndex < plans.length - 1) setCurrentIndex(i => i + 1)
    else setFinished(true)
  }
  const handleLike = async () => {
    const plan = plans[currentIndex]
    try {
      await addFavorite(plan)
      nextPlan()
    } catch (e) {
      Alert.alert('Error al guardar favorito', e.message)
    }
  }
  const handlePass = () => nextPlan()
  const handleLikePress = () => {
    swipesRef.current?.openLeft()
    handleLike()
  }
  const handlePassPress = () => {
    swipesRef.current?.openRight()
    handlePass()
  }

  // 6) Logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      Alert.alert('Error al cerrar sesión', e.message)
    }
  }

  // 7) Si no hay user → Login
  if (!user) return <LoginScreen />

  // 8) Navegación
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {({ navigation }) => (
            <View style={styles.container}>
              <TopBar
                onFilterPress={openFilters}
                onFavoritesPress={() => navigation.navigate('Favorites')}
                onLogout={handleLogout}
              />

              <View style={styles.swipes}>
                { !finished && plans.length > 0 && plans.map((p, i) =>
                  i === currentIndex && (
                    <Swipes
                      key={p.id}
                      ref={swipesRef}
                      currentIndex={currentIndex}
                      users={plans}
                      handleLike={handleLike}
                      handlePass={handlePass}
                    />
                  )
                )}
              </View>

              <BottomBar
                handleLikePress={handleLikePress}
                handlePassPress={handlePassPress}
              />

              <FilterModal
                visible={filtersVisible}
                onApply={applyFilters}
                onClose={() => setFiltersVisible(false)}
                initialFilters={filters}
              />

              <FinishedModal
                visible={finished}
                onReset={() => {
                  setFinished(false)
                  openFilters()
                }}
              />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="Favorites">
          {props => (
            <FavoritesScreen
              {...props}
              favorites={favorites}
              onRemove={removeFavorite}
              onClear={clearFavorites}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Detail">
          {props => <PlanDetailScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: Constants.statusBarHeight },
  swipes: {
    flex: 1,
    padding: 10,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  }
})
