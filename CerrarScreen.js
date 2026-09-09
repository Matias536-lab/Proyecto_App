import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
} from "react-native";

// Recibimos "navegarA" desde App.js
export default function CerrarSesionScreen({ navegarA }) {
  // Función para cerrar la aplicación
  const cerrarAplicacion = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      {/* Tarjeta central flotante */}
      <View style={styles.card}>
        <Text style={styles.emoji}>👋</Text>

        <Text style={styles.titulo}>¿Deseas salir?</Text>

        <Text style={styles.subtitulo}>
          Tendrás que volver a ingresar tus datos la próxima vez.
        </Text>

        {/* Botón de Confirmar Salida */}
        <TouchableOpacity style={styles.botonSalir} onPress={cerrarAplicacion}>
          <Text style={styles.textoSalir}>Confirmar Salida</Text>
        </TouchableOpacity>

        {/* Botón Cancelar */}
        <TouchableOpacity onPress={() => navegarA("Inicio")}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4EE",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    elevation: 5,
  },

  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },

  botonSalir: {
    backgroundColor: "#d9534f",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
  },

  textoSalir: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  textoCancelar: {
    color: "#333",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
