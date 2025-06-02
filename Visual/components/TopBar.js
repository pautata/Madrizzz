import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function TopBar({
  onFilterPress,
  onFavoritesPress,
  onLogout
}) {
  return (
    <View style={styles.container}>
      {/* Logo personalizado */}
      <Image
        source={require('../assets/images/madrizzzmor.png')}
        style={styles.logo}
      />

      {/* Filtro */}
      <TouchableOpacity onPress={onFilterPress}>
        <FontAwesome name="filter" size={24} color="#5c5c5c" />
      </TouchableOpacity>

      {/* Favoritos */}
      <TouchableOpacity onPress={onFavoritesPress}>
        <FontAwesome name="star" size={24} color="#5c5c5c" />
      </TouchableOpacity>

      {/* Cerrar sesión */}
      <TouchableOpacity onPress={onLogout}>
        <MaterialIcons name="power-settings-new" size={24} color="#5c5c5c" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 4,
    paddingHorizontal: 10
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  }
});
