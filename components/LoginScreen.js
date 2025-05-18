// components/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { auth } from './components/firebaseConfig.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigation.replace('Swipes');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegister ? 'Regístrate' : 'Inicia sesión'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isRegister ? 'Registrarme' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsRegister(r => !r)}
        style={styles.switchContainer}
      >
        <Text style={styles.switchText}>
          {isRegister
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center',
    padding: 20, backgroundColor: 'white'
  },
  title: {
    fontSize: 24, fontWeight: 'bold',
    marginBottom: 20, textAlign: 'center'
  },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 4, padding: 10,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#64EDCC',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white', fontWeight: 'bold'
  },
  switchContainer: {
    marginTop: 12, alignItems: 'center'
  },
  switchText: {
    color: '#64EDCC'
  }
});
