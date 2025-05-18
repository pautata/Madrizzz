import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

export default function TopBar({ onFilterPress }) {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="fire" size={27} color="#F06795" />
      <TouchableOpacity onPress={onFilterPress}>
        <FontAwesome name="filter" size={27} color="#5c5c5c" />
      </TouchableOpacity>
      <FontAwesome name="star" size={24} color="#5c5c5c" />
      <FontAwesome name="user" size={27} color="#5c5c5c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 5.46,
    elevation: 9
  }
});
