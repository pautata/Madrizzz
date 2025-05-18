// screens/FavoritesScreen.js
import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, FlatList, Linking
} from 'react-native';
import Constants from 'expo-constants';  // ← import Constants

const diasSemana = ['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO'];

export default function FavoritesScreen({ navigation, favorites, setFavorites }) {
  const [tab, setTab] = useState('prox');
  const hoyIdx = new Date().getDay();
  const mananaIdx = (hoyIdx + 1) % 7;

  useEffect(() => {
    console.log('Favorites recibidos:', favorites);
  }, [favorites]);

  const dataPorTab = useMemo(() => {
    const grupos = { hoy: [], manana: [], prox: [] };

    favorites.forEach(plan => {
      const diasArray = Array.isArray(plan.horarios)
        ? Array.from(new Set(plan.horarios.map(h => h.dia.toUpperCase())))
        : [];

      const vistos = new Set();
      diasArray.forEach(d => {
        const idx = diasSemana.indexOf(d);
        if (idx === hoyIdx && !vistos.has('hoy')) {
          grupos.hoy.push(plan);
          vistos.add('hoy');
        } else if (idx === mananaIdx && !vistos.has('manana')) {
          grupos.manana.push(plan);
          vistos.add('manana');
        } else if (idx !== hoyIdx && idx !== mananaIdx && !vistos.has('prox')) {
          grupos.prox.push(plan);
          vistos.add('prox');
        }
      });
    });

    console.log('Grupos:', grupos);
    return grupos;
  }, [favorites, hoyIdx, mananaIdx]);

  const renderPlan = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text>{item.localizacion} · {item.precio.toFixed(2)} €</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity onPress={() => Linking.openURL(item.url ?? '#')}>
          <Text style={styles.link}>Abrir web</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Detail', { plan: item })}>
          <Text style={styles.link}>Detalle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFavorites(prev => prev.filter(p => p.id !== item.id))}>
          <Text style={[styles.link, { color: 'red' }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header fijo con tabs */}
      <View style={styles.header}>
        {['hoy','manana','prox'].map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={tab === t ? styles.tabTextActive : styles.tabText}>
              {t === 'hoy' ? 'Hoy' : t === 'manana' ? 'Mañana' : 'Próximos días'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista scrollable */}
      <FlatList
        style={styles.list}
        data={dataPorTab[tab]}
        keyExtractor={item => String(item.id)}
        renderItem={renderPlan}
        ListEmptyComponent={<Text style={styles.empty}>No hay favoritos aquí.</Text>}
      />

      {/* Footer fijo */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setFavorites([])} style={styles.footerBtn}>
          <Text>Vaciar favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerBtn}>
          <Text>Seguir eligiendo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,  // ← desliza todo el contenido bajo la barra de estado
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: 'white',
    elevation: 4,
    paddingTop: 15,   // ← empuja las pestañas hacia abajo, igual que TopBar
  },
  tab: { padding: 8 },
  tabActive: { borderBottomWidth: 2, borderColor: '#64EDCC' },
  tabText: { color: '#555' },
  tabTextActive: { color: '#64EDCC', fontWeight: 'bold' },

  list: { flex: 1, padding: 10 },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    elevation: 2
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  link: { textDecorationLine: 'underline' },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: 'white',
    elevation: 4
  },
  footerBtn: { padding: 10 }
});
