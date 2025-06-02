import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'

export default function PlanDetailScreen({ route, navigation }) {
  const { plan } = route.params

  // Usamos h.diaInicio si existe, o h.dia (para favoritos “viejos”)
  const diasUnicos = Array.from(
    new Set(
      plan.horarios.map(h => (h.diaInicio ?? h.dia) ?? '')
    )
  )
  const diasStr = diasUnicos.join(', ')

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: plan.imagenUrl }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{plan.nombre}</Text>
        <Text style={styles.line}>📍 {plan.localizacion}</Text>
        <Text style={styles.line}>
          💶 {plan.precio.toFixed(2)} €
        </Text>
        <Text style={styles.line}>📅 {diasStr}</Text>
        <Text style={styles.subtitle}>Horarios:</Text>
        {plan.horarios.map((h, idx) => {
          const diaMostrar = h.diaInicio ?? h.dia
          return (
            <Text key={idx} style={styles.line}>
              • {diaMostrar}: {h.horaInicio}–{h.horaFin}
            </Text>
          )
        })}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 200 },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4
  },
  line: { fontSize: 16, marginBottom: 6 },
  btn: {
    marginTop: 20,
    backgroundColor: '#64EDCC',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  btnText: { color: 'white', fontWeight: 'bold' }
})
