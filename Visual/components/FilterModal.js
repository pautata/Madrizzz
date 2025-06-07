import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function FilterModal({
  visible,
  onApply,
  onClose,
  initialFilters
}) {
  const [dia, setDia] = useState(initialFilters.dia || "ALL");
  const [horaMin, setHoraMin] = useState(initialFilters.horaMin ?? "");
  const [horaMax, setHoraMax] = useState(initialFilters.horaMax ?? "");
  const [precioMin, setPrecioMin] = useState(initialFilters.precioMin ?? "");
  const [precioMax, setPrecioMax] = useState(initialFilters.precioMax ?? "");

  useEffect(() => {
    setDia(initialFilters.dia || "ALL");
    setHoraMin(initialFilters.horaMin ?? "");
    setHoraMax(initialFilters.horaMax ?? "");
    setPrecioMin(initialFilters.precioMin ?? "");
    setPrecioMax(initialFilters.precioMax ?? "");
  }, [initialFilters]);

  const validarHora = (horaStr) => {
    const regex = /^(\d{2}):(\d{2})$/;
    const match = regex.exec(horaStr);
    if (!match) return false;
    const hh = parseInt(match[1], 10);
    const mm = parseInt(match[2], 10);
    if (isNaN(hh) || isNaN(mm)) return false;
    if (hh < 0 || hh > 23) return false;
    if (mm < 0 || mm > 59) return false;
    return true;
  };

  const validarPrecio = (precioStr) => {
    if (precioStr === undefined || precioStr === null) return false;
    const normalized = precioStr.replace(",", ".");
    const num = parseFloat(normalized);
    if (isNaN(num)) return false;
    if (num < 0) return false;
    return true;
  };

  const handleApply = () => {
    if (horaMin && horaMin.trim() !== "") {
      if (!validarHora(horaMin.trim())) {
        Alert.alert(
          "Hora mínima errónea",
          "Introduce la hora mínima en formato HH:MM (00–23 : 00–59)."
        );
        return;
      }
    }

    if (horaMax && horaMax.trim() !== "") {
      if (!validarHora(horaMax.trim())) {
        Alert.alert(
          "Hora máxima errónea",
          "Introduce la hora máxima en formato HH:MM (00–23 : 00–59)."
        );
        return;
      }
    }

    if (
      horaMin?.trim() &&
      horaMax?.trim() &&
      validarHora(horaMin.trim()) &&
      validarHora(horaMax.trim())
    ) {
      const [hMinStr, mMinStr] = horaMin.trim().split(":");
      const [hMaxStr, mMaxStr] = horaMax.trim().split(":");
      const hMin = parseInt(hMinStr, 10);
      const mMin = parseInt(mMinStr, 10);
      let hMax = parseInt(hMaxStr, 10);
      let mMax = parseInt(mMaxStr, 10);
      if (hMax === 0 && mMax === 0) {
        hMax = 23;
        mMax = 59;
      }
      const dateMin = new Date();
      dateMin.setHours(hMin, mMin, 0, 0);
      const dateMax = new Date();
      dateMax.setHours(hMax, mMax, 0, 0);
      if (dateMin > dateMax) {
        Alert.alert(
          "Rango horario inválido",
          "La hora mínima debe ser anterior o igual a la hora máxima."
        );
        return;
      }
    }

    if (precioMin && precioMin.trim() !== "") {
      if (!validarPrecio(precioMin.trim())) {
        Alert.alert(
          "Precio mínimo erróneo",
          "Introduce un número positivo válido para el precio mínimo (por ejemplo: 0, 10.50)."
        );
        return;
      }
    }

    if (precioMax && precioMax.trim() !== "") {
      if (!validarPrecio(precioMax.trim())) {
        Alert.alert(
          "Precio máximo erróneo",
          "Introduce un número válido para el precio máximo (por ejemplo: 20, 15.99)."
        );
        return;
      }
    }

    if (
      precioMin?.trim() &&
      precioMax?.trim() &&
      validarPrecio(precioMin.trim()) &&
      validarPrecio(precioMax.trim())
    ) {
      const min = parseFloat(precioMin.trim().replace(",", "."));
      const max = parseFloat(precioMax.trim().replace(",", "."));
      if (min > max) {
        Alert.alert(
          "Rango de precios inválido",
          "El precio mínimo debe ser menor o igual al precio máximo."
        );
        return;
      }
    }

    let normalizedPrecioMin = precioMin;
    let normalizedPrecioMax = precioMax;

    if (precioMin && precioMin.trim() !== "") {
      normalizedPrecioMin = precioMin.trim().replace(",", ".");
    }
    if (precioMax && precioMax.trim() !== "") {
      normalizedPrecioMax = precioMax.trim().replace(",", ".");
    }

    onApply({
      dia: dia === "ALL" ? "" : dia,
      horaMin,
      horaMax,
      precioMin: normalizedPrecioMin,
      precioMax: normalizedPrecioMax
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

          <Text>Precio mínimo (€) (puedes introducir decimales)</Text>
          <TextInput
            style={styles.input}
            value={precioMin}
            keyboardType="numeric"
            placeholder="0"
            onChangeText={setPrecioMin}
          />

          <Text>Precio máximo (€) (puedes introducir decimales)</Text>
          <TextInput
            style={styles.input}
            value={precioMax}
            keyboardType="numeric"
            placeholder="100"
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
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    padding: 20
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    ...Platform.select({ android: { marginVertical: -8 } })
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  btnCancel: {
    padding: 10,
    marginRight: 10
  },
  btnApply: {
    backgroundColor: '#64EDCC',
    padding: 10,
    borderRadius: 4
  }
});
