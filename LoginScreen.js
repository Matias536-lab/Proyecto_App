import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

// Pantalla de inicio de sesión.
//
// IMPORTANTE: es una simulación. No hay servidor ni base de datos detrás,
// así que la app no puede comprobar si la contraseña es correcta.
// Lo único que hacemos es validar que los campos estén bien escritos
// y darle al usuario una sesión abierta con esos datos.
export default function LoginScreen({ navegarA, iniciarSesion }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  const entrar = () => {
    // Validación 1: que no esté vacío
    if (!email.trim()) {
      Alert.alert("Falta un dato", "Ingresá tu correo electrónico.");
      return;
    }

    // Validación 2: que parezca un correo (tenga arroba y un punto después)
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      Alert.alert("Correo inválido", "Escribí un correo válido, por ejemplo nombre@mail.com");
      return;
    }

    // Validación 3: contraseña mínima
    if (contrasena.length < 4) {
      Alert.alert("Contraseña corta", "La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    // Todo bien: abrimos la sesión.
    // Como no hay servidor, armamos el nombre a partir del correo:
    // de "matias@mail.com" sacamos "matias".
    const nombreDelCorreo = email.split("@")[0];

    iniciarSesion({
      nombre: nombreDelCorreo,
      email: email.trim(),
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.titulo}>Iniciar sesión</Text>
        <Text style={styles.bajada}>
          Entrá a tu cuenta para guardar y crear tus recetas.
        </Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="nombre@mail.com"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          placeholderTextColor="#999"
          secureTextEntry
        />

        <TouchableOpacity style={styles.botonPrincipal} onPress={entrar}>
          <Text style={styles.botonPrincipalTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navegarA("Registro")}>
          <Text style={styles.enlace}>
            ¿No tenés cuenta? Registrate acá
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navegarA("Inicio")}>
          <Text style={styles.enlaceSecundario}>Seguir sin iniciar sesión</Text>
        </TouchableOpacity>

        {/* Aviso honesto sobre el alcance de esta pantalla */}
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            Esta versión no se conecta a ningún servidor: los datos de la cuenta
            quedan guardados solo mientras la aplicación esté abierta.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4EE",
  },
  form: {
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  bajada: {
    fontSize: 15,
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    marginTop: 18,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E4DC",
    fontSize: 16,
    color: "#333",
  },
  botonPrincipal: {
    backgroundColor: "#9C4221",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  botonPrincipalTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  enlace: {
    color: "#9C4221",
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
  enlaceSecundario: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  aviso: {
    backgroundColor: "#EFEDE4",
    borderRadius: 10,
    padding: 14,
    marginTop: 30,
    marginBottom: 20,
  },
  avisoTexto: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },
});