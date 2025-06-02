// components/LoginScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { auth } from "./FirebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

// Importa el modal de Términos y condiciones
import TermsModal from "./TermsModal";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos extra para registro:
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState(""); // Formato YYYY-MM-DD
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [isNewAccount, setIsNewAccount] = useState(false);

  // Estado para mostrar/ocultar el modal de Términos y condiciones
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Estados para validación en tiempo real de la contraseña:
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);

  // Cada vez que cambia `password`, recalculamos las validaciones:
  useEffect(() => {
    // Mínimo 6 caracteres
    setIsLengthValid(password.length >= 6);
    // Al menos un número
    setHasNumber(/\d/.test(password));
    // Al menos una mayúscula
    setHasUppercase(/[A-Z]/.test(password));
    // Al menos un símbolo (cualquier cosa que no sea letra ni número)
    setHasSymbol(/[^A-Za-z0-9]/.test(password));
  }, [password]);

  // Helper para parsear fecha YYYY-MM-DD
  const parseDate = (str) => {
    const parts = str.split("-");
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map((p) => parseInt(p, 10));
    if (
      isNaN(y) ||
      isNaN(m) ||
      isNaN(d) ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > 31
    ) {
      return null;
    }
    const date = new Date(y, m - 1, d);
    if (
      date.getFullYear() !== y ||
      date.getMonth() + 1 !== m ||
      date.getDate() !== d
    ) {
      return null;
    }
    return date;
  };

  // Devuelve true si la fecha es hace al menos 18 años
  const isOlderThan18 = (date) => {
    if (!date) return false;
    const now = new Date();
    const diffY = now.getFullYear() - date.getFullYear();
    if (diffY > 18) return true;
    if (diffY < 18) return false;
    if (now.getMonth() > date.getMonth()) return true;
    if (now.getMonth() < date.getMonth()) return false;
    return now.getDate() >= date.getDate();
  };

  // Mapeo de códigos de error de Firebase a mensajes en español
  const firebaseErrorMessages = {
    // Registro
    "auth/email-already-in-use":
      "Error. El correo ya está registrado. Usa otro o inicia sesión.",
    "auth/invalid-email": "Error. El correo no tiene un formato válido.",
    "auth/weak-password":
      "Error. La contraseña es demasiado corta. Debe tener al menos 6 caracteres.",
    // Login
    "auth/user-not-found":
      "Error. No existe ninguna cuenta con ese correo.",
    "auth/wrong-password": "Error. La contraseña es incorrecta.",
    "auth/too-many-requests":
      "Error. Has intentado demasiadas veces. Reintenta más tarde.",
    // Recuperar contraseña
    "auth/missing-email": "Error. Debes proporcionar un correo.",
    "auth/invalid-credential":
      "Error. El correo o la contraseña son incorrectos o no existe la cuenta.",
    "auth/user-disabled":
      "Error. Esta cuenta ha sido deshabilitada. Contacta al administrador.",
    // Otros errores genéricos
    default: (code) => `Error: ${code}`,
  };

  // Traduce un código de error de Firebase a español
  const translateFirebaseError = (error) => {
    const key = error.code;
    if (firebaseErrorMessages[key]) {
      // Si es un string fijo:
      if (typeof firebaseErrorMessages[key] === "string") {
        return firebaseErrorMessages[key];
      }
      // Si es función (para mensajes dinámicos):
      return firebaseErrorMessages[key](error.code);
    }
    return firebaseErrorMessages.default(error.code);
  };

  const handleAuth = async () => {
    try {
      if (isNewAccount) {
        // 1) Contraseña y confirmPassword coinciden
        if (password !== confirmPassword) {
          Alert.alert("Error", "Las contraseñas no coinciden.");
          return;
        }

        // 2) Validar email básico
        if (!email || !email.includes("@")) {
          Alert.alert("Error", "Introduce un correo válido.");
          return;
        }

        // 3) Validar cumpleaños: formato y > 18 años
        const dateObj = parseDate(birthday);
        if (!dateObj) {
          Alert.alert(
            "Error",
            "Introduce tu fecha de nacimiento en formato YYYY-MM-DD."
          );
          return;
        }
        if (!isOlderThan18(dateObj)) {
          Alert.alert(
            "Error",
            "Debes tener al menos 18 años para registrarte."
          );
          return;
        }

        // 4) Validar términos y condiciones aceptados
        if (!acceptedTerms) {
          Alert.alert(
            "Error",
            "Debes aceptar los términos y condiciones para registrarte."
          );
          return;
        }

        // 5) Validar mínima longitud de contraseña (≥ 6)
        if (!isLengthValid) {
          Alert.alert(
            "Error",
            "La contraseña debe tener al menos 6 caracteres."
          );
          return;
        }

        // Finalmente, crear cuenta
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Modo login
        if (!email || !password) {
          Alert.alert("Error", "Introduce email y contraseña.");
          return;
        }
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Si todo va bien, App.js detectará el cambio de auth y navegará solo
    } catch (error) {
      const mensaje = translateFirebaseError(error);
      Alert.alert("Error", mensaje);
    }
  };

  // Envía correo de recuperación de contraseña
  const handlePasswordReset = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert(
        "Error",
        "Introduce un correo válido para recuperar contraseña."
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Comprobar tu correo",
        "Te hemos enviado un email para restablecer tu contraseña."
      );
    } catch (error) {
      const mensaje = translateFirebaseError(error);
      Alert.alert("Error", mensaje);
    }
  };

  // Calcula cuántos requisitos de contraseña están cumplidos (0 a 4)
  const strengthScore =
    (isLengthValid ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasSymbol ? 1 : 0);

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

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isNewAccount && (
        <>
          {/* ─── Barra de fuerza ───────────────────────────────────────────────── */}
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

          {/* ─── Validaciones en tiempo real ─────────────────────────────────────── */}
          <View style={styles.validationContainer}>
            <ValidationItem label="Mínimo 6 caracteres" valid={isLengthValid} />
            <Text style={styles.optionalLabel}>
              Para fortalecer la contraseña (no obligatorio):
            </Text>
            <ValidationItem label="Al menos un número" valid={hasNumber} />
            <ValidationItem label="Al menos una mayúscula" valid={hasUppercase} />
            <ValidationItem label="Al menos un símbolo" valid={hasSymbol} />
          </View>

          {/* ─── Confirmar contraseña ──────────────────────────────────────────────── */}
          <TextInput
            style={styles.input}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* ─── Fecha de nacimiento ──────────────────────────────────────────────── */}
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (YYYY-MM-DD)"
            value={birthday}
            onChangeText={setBirthday}
            keyboardType={
              Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
            }
          />

          {/* ─── Términos y condiciones ────────────────────────────────────────────── */}
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
          setIsNewAccount((r) => !r);
          // Limpieza opcional al cambiar de modo:
          setPassword("");
          setConfirmPassword("");
          setBirthday("");
          setAcceptedTerms(false);
        }}
        style={styles.switchContainer}
      >
        <Text style={styles.switchText}>
          {isNewAccount
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </Text>
      </TouchableOpacity>

      {/* ─── Modal de Términos y condiciones ──────────────────────────────────── */}
      <TermsModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </View>
  );
}

// Componente auxiliar para cada línea de validación
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
  );
}

const styles = StyleSheet.create({
  /* ──────────────────────────────────────────────────────────────────────────
     Layout básico
  ────────────────────────────────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────────────────────────────────
     Validación en tiempo real
  ────────────────────────────────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────────────────────────────────
     Barra de fuerza (strength bar)
     ─ 4 segmentos horizontales, coloreados según score (0–4)
  ────────────────────────────────────────────────────────────────────────── */
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
});
