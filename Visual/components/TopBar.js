import React from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

export default function TopBar({
  onFilterPress,
  onFavoritesPress,
  onLogout
}) {
  const iconHitSlop = { top: 10, bottom: 10, left: 10, right: 10 }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/madrizzzmor.png')}
        style={styles.logo}
      />
      <TouchableOpacity
        onPress={onFilterPress}
        style={styles.iconButton}
        hitSlop={iconHitSlop}
      >
        <FontAwesome name="filter" size={24} color="#5c5c5c" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onFavoritesPress}
        style={styles.iconButton}
        hitSlop={iconHitSlop}
      >
        <FontAwesome name="star" size={24} color="#5c5c5c" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLogout}
        style={styles.iconButton}
        hitSlop={iconHitSlop}
      >
        <MaterialIcons name="power-settings-new" size={24} color="#5c5c5c" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 4,
    paddingHorizontal: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
