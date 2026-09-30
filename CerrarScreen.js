import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

// Pantalla de cierre de sesión.
//
// Antes esta pantalla cerraba la APLICACIÓN con BackHandler.exitApp().
// Ahora cierra la SESIÓN: le avisa a App.js que el usuario salió,
// y App.js se encarga de esconder "Mi Cuenta" del menú y de mostrar
// las opciones de iniciar sesión y registrarse.
export default function CerrarScreen({ navegarA, cerrarSesion }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>¿Deseas cerrar sesión?</Text>
        <Text style={styles.subtitulo}>
          Vas a tener que volver a ingresar tus datos la próxima vez que quieras
          entrar a tu cuenta.
        </Text>

        {/* Botón de confirmar */}
        <TouchableOpacity style={styles.botonSalir} onPress={cerrarSesion}>
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
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  botonSalir: {
    backgroundColor: "#A8322E",
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
