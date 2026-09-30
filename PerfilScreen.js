import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

// Pantalla "Mi Cuenta".
//
// Recibe el usuario desde App.js. Si no hay sesión abierta, en vez de
// mostrar datos vacíos invita a iniciar sesión.
export default function PerfilScreen({ navegarA, usuario }) {
  if (!usuario) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.titulo}>No hay sesión abierta</Text>
          <Text style={styles.subtitulo}>
            Iniciá sesión para ver los datos de tu cuenta.
          </Text>

          <TouchableOpacity
            style={styles.boton}
            onPress={() => navegarA("Login")}
          >
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.icono}>
        <ImageBackground
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 100 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>{usuario.nombre}</Text>

        {usuario.email ? (
          <Text style={styles.email}>{usuario.email}</Text>
        ) : null}

        <View style={styles.linea} />

        <Text style={styles.dato}>Sesión abierta en este dispositivo.</Text>

        <TouchableOpacity
          style={styles.botonSecundario}
          onPress={() => navegarA("CerrarSesion")}
        >
          <Text style={styles.botonSecundarioTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9C4221",
    alignItems: "center",
    padding: 20,
  },
  icono: {
    backgroundColor: "#fff",
    borderRadius: 100,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 15,
    padding: 25,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  email: {
    fontSize: 15,
    color: "#777",
    marginTop: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  linea: {
    height: 1,
    backgroundColor: "#E6E4DC",
    alignSelf: "stretch",
    marginVertical: 20,
  },
  dato: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  boton: {
    backgroundColor: "#9C4221",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 25,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: "#A8322E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 25,
  },
  botonSecundarioTexto: {
    color: "#A8322E",
    fontSize: 15,
    fontWeight: "bold",
  },
});