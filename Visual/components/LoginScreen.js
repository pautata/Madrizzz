import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { auth } from "./FirebaseConfig"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth"
import TermsModal from "./TermsModal"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [birthday, setBirthday] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [isLengthValid, setIsLengthValid] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasUppercase, setHasUppercase] = useState(false)
  const [hasSymbol, setHasSymbol] = useState(false)

  useEffect(() => {
    setIsLengthValid(password.length >= 6)
    setHasNumber(/\d/.test(password))
    setHasUppercase(/[A-Z]/.test(password))
    setHasSymbol(/[^A-Za-z0-9]/.test(password))
  }, [password])

  const parseDate = (str) => {
    const parts = str.split("-")
    if (parts.length !== 3) return null
    const [dStr, mStr, yStr] = parts
    const d = parseInt(dStr, 10)
    const m = parseInt(mStr, 10)
    const y = parseInt(yStr, 10)
    if (
      isNaN(y) ||
      isNaN(m) ||
      isNaN(d) ||
      y < 1899 ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > 31
    ) {
      return null
    }
    const date = new Date(y, m - 1, d)
    if (
      date.getFullYear() !== y ||
      date.getMonth() + 1 !== m ||
      date.getDate() !== d
    ) {
      return null
    }
    return date
  }

  const isOlderThan18 = (date) => {
    if (!date) return false
    const now = new Date()
    const diffY = now.getFullYear() - date.getFullYear()
    if (diffY > 18) return true
    if (diffY < 18) return false
    if (now.getMonth() > date.getMonth()) return true
    if (now.getMonth() < date.getMonth()) return false
    return now.getDate() >= date.getDate()
  }

  const firebaseErrorMessages = {
    "auth/email-already-in-use":
      "Error. El correo ya está registrado. Usa otro o inicia sesión.",
    "auth/invalid-email": "Error. El correo no tiene un formato válido.",
    "auth/weak-password":
      "Error. La contraseña es demasiado corta. Debe tener al menos 6 caracteres.",
    "auth/user-not-found":
      "Error. No existe ninguna cuenta con ese correo.",
    "auth/wrong-password": "Error. La contraseña es incorrecta.",
    "auth/too-many-requests":
      "Error. Has intentado demasiadas veces. Reintenta más tarde.",
    "auth/missing-email": "Error. Debes proporcionar un correo.",
    "auth/invalid-credential":
      "Error. El correo o la contraseña son incorrectos o no existe la cuenta.",
    "auth/user-disabled":
      "Error. Esta cuenta ha sido deshabilitada. Contacta al administrador.",
    default: (code) => `Error: ${code}`,
  }

  const translateFirebaseError = (error) => {
    const key = error.code
    if (firebaseErrorMessages[key]) {
      if (typeof firebaseErrorMessages[key] === "string") {
        return firebaseErrorMessages[key]
      }
      return firebaseErrorMessages[key](error.code)
    }
    return firebaseErrorMessages.default(error.code)
  }

  const handleAuth = async () => {
    try {
      if (!email || !email.includes("@")) {
        Alert.alert("Error", "Introduce un correo válido.")
        return
      }

      if (isNewAccount) {
        if (!isLengthValid) {
          Alert.alert(
            "Error",
            "La contraseña debe tener al menos 6 caracteres."
          )
          return
        }

        if (password !== confirmPassword) {
          Alert.alert("Error", "Las contraseñas no coinciden.")
          return
        }

        const dateObj = parseDate(birthday)
        if (!dateObj) {
          Alert.alert(
            "Error",
            "Introduce tu fecha de nacimiento en formato DD-MM-YYYY y asegúrate de que sea una fecha válida."
          )
          return
        }
        if (!isOlderThan18(dateObj)) {
          Alert.alert("Error", "Debes tener al menos 18 años para registrarte.")
          return
        }

        if (!acceptedTerms) {
          Alert.alert(
            "Error",
            "Debes aceptar los términos y condiciones para registrarte."
          )
          return
        }

        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        if (!email || !password) {
          Alert.alert("Error", "Introduce email y contraseña.")
          return
        }
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      const mensaje = translateFirebaseError(error)
      Alert.alert("Error", mensaje)
    }
  }

  const handlePasswordReset = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert(
        "Error",
        "Introduce un correo válido para recuperar contraseña."
      )
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      Alert.alert(
        "¡Correo enviado!",
        "Te hemos enviado un email para restablecer tu contraseña."
      )
    } catch (error) {
      const mensaje = translateFirebaseError(error)
      Alert.alert("Error", mensaje)
    }
  }

  const strengthScore =
    (isLengthValid ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasSymbol ? 1 : 0)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isNewAccount ? "Regístrate" : "Inicia sesión"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {isNewAccount && (
        <>
          <View style={styles.strengthBarContainer}>
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.strengthSegment,
                  idx < strengthScore
                    ? styles.strengthActive
                    : styles.strengthInactive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.strengthLabel}>
            Fuerza: {strengthScore} de 4
          </Text>

          <View style={styles.validationContainer}>
            <ValidationItem label="Mínimo 6 caracteres" valid={isLengthValid} />
            <Text style={styles.optionalLabel}>
              Para fortalecer la contraseña (no obligatorio):
            </Text>
            <ValidationItem label="Al menos un número" valid={hasNumber} />
            <ValidationItem label="Al menos una mayúscula" valid={hasUppercase} />
            <ValidationItem label="Al menos un símbolo" valid={hasSymbol} />
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            >
              <FontAwesome
                name={showConfirmPassword ? "eye" : "eye-slash"}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (DD-MM-YYYY)"
            value={birthday}
            onChangeText={setBirthday}
            keyboardType={
              Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
            }
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setShowTermsModal(true)}
          >
            <Text style={styles.termsLinkText}>
              Leer términos y condiciones
            </Text>
          </TouchableOpacity>
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAcceptedTerms((prev) => !prev)}
            >
              {acceptedTerms && <View style={styles.checkboxChecked} />}
            </TouchableOpacity>
            <Text>Acepto los términos y condiciones</Text>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isNewAccount ? "Registrarme" : "Entrar"}
        </Text>
      </TouchableOpacity>

      {!isNewAccount && (
        <TouchableOpacity
          onPress={handlePasswordReset}
          style={styles.resetContainer}
        >
          <Text style={styles.resetText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => {
          setIsNewAccount((r) => !r)
          setPassword("")
          setConfirmPassword("")
          setBirthday("")
          setAcceptedTerms(false)
          setShowPassword(false)
          setShowConfirmPassword(false)
        }}
        style={styles.switchContainer}
      >
        <Text style={styles.switchText}>
          {isNewAccount
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </Text>
      </TouchableOpacity>

      <TermsModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </View>
  )
}

function ValidationItem({ label, valid }) {
  return (
    <View style={styles.validationItem}>
      <Text
        style={[
          styles.validationIcon,
          valid ? styles.valid : styles.invalid,
        ]}
      >
        {valid ? "✓" : "✗"}
      </Text>
      <Text style={styles.validationText}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#64EDCC",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  switchContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  switchText: {
    color: "#64EDCC",
  },
  resetContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  resetText: {
    color: "#F06795",
    textDecorationLine: "underline",
  },
  termsContainer: {
    marginBottom: 8,
    alignItems: "flex-start",
  },
  termsLinkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#555",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: "#64EDCC",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 12,
    paddingRight: 10,
  },
  inputFlex: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 4,
  },
  validationContainer: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  optionalLabel: {
    fontSize: 12,
    color: "#555",
    marginVertical: 4,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  validationIcon: {
    fontSize: 16,
    width: 20,
    textAlign: "center",
  },
  validationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  valid: {
    color: "green",
  },
  invalid: {
    color: "red",
  },
  strengthBarContainer: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  strengthSegment: {
    flex: 1,
    marginHorizontal: 1,
  },
  strengthActive: {
    backgroundColor: "#64EDCC",
  },
  strengthInactive: {
    backgroundColor: "#E0E0E0",
  },
  strengthLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 12,
    textAlign: "right",
  },
})
