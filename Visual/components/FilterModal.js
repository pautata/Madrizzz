// src/components/FilterModal.js
import React, { useState, useEffect } from 'react';
import {
  View, Modal, StyleSheet, Text,
  TouchableOpacity, TextInput, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function FilterModal({
  visible,
  onApply,
  onClose,
  initialFilters
}) {
  // usamos "ALL" para el picker, mapeamos a "" al aplicar
  const [dia, setDia] = useState(initialFilters.dia || "ALL");
  const [horaMin, setHoraMin] = useState(initialFilters.horaMin);
  const [horaMax, setHoraMax] = useState(initialFilters.horaMax);
  const [precioMin, setPrecioMin] = useState(initialFilters.precioMin);
  const [precioMax, setPrecioMax] = useState(initialFilters.precioMax);

  // sincronizamos cuando initialFilters cambian
  useEffect(() => {
    setDia(initialFilters.dia || "ALL");
    setHoraMin(initialFilters.horaMin);
    setHoraMax(initialFilters.horaMax);
    setPrecioMin(initialFilters.precioMin);
    setPrecioMax(initialFilters.precioMax);
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      dia: dia === "ALL" ? "" : dia,
      horaMin,
      horaMax,
      precioMin,
      precioMax
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Filtros</Text>

          <Text>Día</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={dia} onValueChange={setDia}>
              <Picker.Item label="Todos" value="ALL" />
              {['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO']
                .map(d => <Picker.Item key={d} label={d} value={d} />)}
            </Picker>
          </View>

          <Text>Hora mínima (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={horaMin}
            placeholder="00:00"
            onChangeText={setHoraMin}
          />

          <Text>Hora máxima (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={horaMax}
            placeholder="23:59"
            onChangeText={setHoraMax}
          />

          <Text>Precio mínimo (€)</Text>
          <TextInput
            style={styles.input}
            value={precioMin}
            keyboardType="decimal-pad"
            onChangeText={setPrecioMin}
          />

          <Text>Precio máximo (€)</Text>
          <TextInput
            style={styles.input}
            value={precioMax}
            keyboardType="decimal-pad"
            onChangeText={setPrecioMax}
          />

          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose} style={styles.btnCancel}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.btnApply}>
              <Text style={{ color: 'white' }}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: '#00000066',
    justifyContent: 'center', padding: 20
  },
  container: {
    backgroundColor: 'white', borderRadius: 8, padding: 16
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  pickerWrapper: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    marginBottom: 12,
    ...Platform.select({ android: { marginVertical: -8 } })
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    padding: 8, marginBottom: 12
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'flex-end'
  },
  btnCancel: {
    padding: 10, marginRight: 10
  },
  btnApply: {
    backgroundColor: '#64EDCC', padding: 10, borderRadius: 4
  }
});
