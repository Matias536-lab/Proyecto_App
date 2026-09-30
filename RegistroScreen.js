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

// Pantalla de registro.
//
// Al igual que el inicio de sesión, es una simulación: no hay servidor
// donde guardar la cuenta. Validamos los datos y abrimos la sesión
// directamente con el nombre que escribió el usuario.
export default function RegistroScreen({ navegarA, iniciarSesion }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetir, setRepetir] = useState("");

  const registrarse = () => {
    if (!nombre.trim()) {
      Alert.alert("Falta un dato", "Ingresá tu nombre.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Falta un dato", "Ingresá tu correo electrónico.");
      return;
    }

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      Alert.alert("Correo inválido", "Escribí un correo válido, por ejemplo nombre@mail.com");
      return;
    }

    if (contrasena.length < 4) {
      Alert.alert("Contraseña corta", "La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    // Esta validación es la que más se olvida y la que más molesta al usuario
    if (contrasena !== repetir) {
      Alert.alert("No coinciden", "Las dos contraseñas tienen que ser iguales.");
      return;
    }

    iniciarSesion({
      nombre: nombre.trim(),
      email: email.trim(),
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.bajada}>
          Registrate para tener tu espacio de recetas en MyKitchen.
        </Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Matías"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#999"
        />

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
          placeholder="Al menos 4 caracteres"
          value={contrasena}
          onChangeText={setContrasena}
          placeholderTextColor="#999"
          secureTextEntry
        />

        <Text style={styles.label}>Repetir contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribila de nuevo"
          value={repetir}
          onChangeText={setRepetir}
          placeholderTextColor="#999"
          secureTextEntry
        />

        <TouchableOpacity style={styles.botonPrincipal} onPress={registrarse}>
          <Text style={styles.botonPrincipalTexto}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navegarA("Login")}>
          <Text style={styles.enlace}>¿Ya tenés cuenta? Iniciá sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navegarA("Inicio")}>
          <Text style={styles.enlaceSecundario}>Seguir sin registrarme</Text>
        </TouchableOpacity>

        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            Esta versión no se conecta a ningún servidor: la cuenta queda
            guardada solo mientras la aplicación esté abierta.
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