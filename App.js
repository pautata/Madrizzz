// App.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native';
import Constants from 'expo-constants';
import TopBar from './components/TopBar';
import FilterModal from './components/FilterModal';
import FinishedModal from './components/FinishedModal';
import BottomBar from './components/BottomBar';
import Swipes from './components/Swipes';
import axios from 'axios';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Nuevas pantallas desde /screens
import FavoritesScreen from './components/FavoritesScreen';
import PlanDetailScreen from './components/PlanDetailScreen';

export default function App() {
  const [plans, setPlans] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const swipesRef = useRef(null);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    dia: "", horaMin: "", horaMax: "", precioMin: "", precioMax: ""
  });
  const [finished, setFinished] = useState(false);

  // 1. Fetch planes según filtros
  async function fetchPlans() {
    try {
      const { data } = await axios.get(
        'http://10.0.2.2:8080/api/planes/filter',
        {
          params: {
            ...(filters.dia ? { dia: filters.dia } : {}),
            ...(filters.horaMin ? { horaMin: filters.horaMin } : {}),
            ...(filters.horaMax ? { horaMax: filters.horaMax } : {}),
            ...(filters.precioMin ? { precioMin: filters.precioMin } : {}),
            ...(filters.precioMax ? { precioMax: filters.precioMax } : {}),
          }
        }
      );
      setPlans(data);
      setCurrentIndex(0);
      setFinished(false);
    } catch (error) {
      Alert.alert(
        'Error al obtener los planes',
        error.response?.data?.message ?? error.message,
        [{ text: 'Reintentar', onPress: fetchPlans }]
      );
    }
  }

  useEffect(() => {
    fetchPlans();
  }, [filters]);

  // 2. Navegación de filtros
  function openFilters() { setFiltersVisible(true); }
  function applyFilters(newFilters) {
    setFilters(newFilters);
    setFiltersVisible(false);
  }

  // 3. Control de índice y favoritos
  function nextPlan() {
    if (currentIndex < plans.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  }

  function addFavorite(plan) {
    setFavorites(favs => {
      if (favs.some(p => p.id === plan.id)) return favs;
      return [...favs, plan];
    });
  }

  // Handlers para gesto y botones
  function handleLike() {
    addFavorite(plans[currentIndex]);
    nextPlan();
  }
  function handlePass() {
    nextPlan();
  }

  function handleLikePress() {
    // abre la animación
    swipesRef.current?.openLeft();
    // y añade + avanza
    addFavorite(plans[currentIndex]);
    nextPlan();
  }
  function handlePassPress() {
    swipesRef.current?.openRight();
    nextPlan();
  }

  // 4. Stack Navigator
  const Stack = createStackNavigator();

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Swipes"
          screenOptions={{ headerShown: false }}
        >
          {/* Pantalla principal de swipes */}
          <Stack.Screen name="Swipes">
            {({ navigation }) => (
              <View style={styles.container}>
                <TopBar onFilterPress={openFilters} />

                <View style={styles.swipes}>
                  {!finished && plans.length > 0 &&
                    plans.map((p, i) =>
                      i === currentIndex ? (
                        <Swipes
                          key={p.id}
                          ref={swipesRef}
                          currentIndex={currentIndex}
                          users={plans}
                          handleLike={handleLike}
                          handlePass={handlePass}
                        />
                      ) : null
                    )
                  }
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
                    setFinished(false);
                    openFilters();
                  }}
                />

                <TouchableOpacity
                  style={styles.favsButton}
                  onPress={() => navigation.navigate('Favorites')}
                >
                  <Text>Ver Favoritos ({favorites.length})</Text>
                </TouchableOpacity>
              </View>
            )}
          </Stack.Screen>

          {/* Pantalla de favoritos */}
          <Stack.Screen name="Favorites">
            {props => (
              <FavoritesScreen
                {...props}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            )}
          </Stack.Screen>

          {/* Pantalla de detalle de un plan */}
          <Stack.Screen name="Detail">
            {props => <PlanDetailScreen {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },
  swipes: {
    flex: 1,
    padding: 10,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  favsButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#64EDCC',
    padding: 12,
    borderRadius: 24,
    elevation: 6
  }
});
