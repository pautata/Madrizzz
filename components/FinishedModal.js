import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function FinishedModal({ visible, onReset }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.text}>No hay más planes con estos filtros.</Text>
          <TouchableOpacity style={styles.button} onPress={onReset}>
            <Text style={styles.buttonText}>Cambiar filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center'
  },
  text: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#64EDCC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
