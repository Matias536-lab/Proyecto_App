import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";

// Pantalla de Configuración.
//
// Colores de los interruptores, para no repetirlos en cada uno:
// apagado gris claro, encendido en el ladrillo de la app.
const PISTA = { false: "#D8D5CC", true: "#D9B5A6" };
const PERILLA_ENCENDIDA = "#9C4221";
const PERILLA_APAGADA = "#f4f3f4";

export default function ConfigScreen({ navegarA }) {
  // ESTADOS DE LA CONFIGURACIÓN
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [sonidos, setSonidos] = useState(true);
  const [vibracion, setVibracion] = useState(true);
  const [idioma, setIdioma] = useState("Español");
  const [unidades, setUnidades] = useState("Métrico");

  const mostrarAlerta = (titulo, mensaje) => {
    Alert.alert(titulo, mensaje, [{ text: "Cerrar" }]);
  };

  const restablecer = () => {
    Alert.alert(
      "Restablecer configuración",
      "¿Estás seguro? Se van a perder todas tus preferencias.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restablecer",
          style: "destructive",
          onPress: () => {
            setNotificaciones(true);
            setModoOscuro(false);
            setSonidos(true);
            setVibracion(true);
            setIdioma("Español");
            setUnidades("Métrico");
            mostrarAlerta("Listo", "Configuración restablecida.");
          },
        },
      ],
    );
  };

  // Fila con interruptor. La armamos una vez y la reutilizamos,
  // así todas quedan iguales y el archivo no se llena de código repetido.
  const filaInterruptor = (titulo, descripcion, valor, alCambiar) => (
    <View style={styles.opcion}>
      <View style={styles.opcionInfo}>
        <Text style={styles.opcionTitulo}>{titulo}</Text>
        <Text style={styles.opcionDescripcion}>{descripcion}</Text>
      </View>
      <Switch
        value={valor}
        onValueChange={alCambiar}
        trackColor={PISTA}
        thumbColor={valor ? PERILLA_ENCENDIDA : PERILLA_APAGADA}
      />
    </View>
  );

  // Fila que abre un diálogo al tocarla.
  const filaBoton = (titulo, valorActual, alTocar) => (
    <TouchableOpacity style={styles.opcion} onPress={alTocar}>
      <View style={styles.opcionInfo}>
        <Text style={styles.opcionTitulo}>{titulo}</Text>
        <Text style={styles.opcionDescripcion}>{valorActual}</Text>
      </View>
      <Text style={styles.flecha}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ---------------- PREFERENCIAS DE LA APP ---------------- */}
      <Text style={styles.tituloSeccion}>Preferencias de la app</Text>

      {filaInterruptor(
        "Notificaciones",
        "Recibir avisos de nuevas recetas",
        notificaciones,
        setNotificaciones,
      )}

      {filaInterruptor(
        "Modo oscuro",
        "Cambiar a tema oscuro",
        modoOscuro,
        setModoOscuro,
      )}

      {filaInterruptor(
        "Sonidos",
        "Efectos de sonido en la app",
        sonidos,
        setSonidos,
      )}

      {filaInterruptor(
        "Vibración",
        "Vibrar al interactuar",
        vibracion,
        setVibracion,
      )}

      {/* ---------------- PREFERENCIAS DE COCINA ---------------- */}
      <Text style={styles.tituloSeccion}>Preferencias de cocina</Text>

      {filaBoton("Idioma", idioma, () =>
        Alert.alert("Idioma", "Elegí el idioma de la aplicación", [
          { text: "Español", onPress: () => setIdioma("Español") },
          { text: "Inglés", onPress: () => setIdioma("Inglés") },
          { text: "Portugués", onPress: () => setIdioma("Portugués") },
          { text: "Cancelar", style: "cancel" },
        ]),
      )}

      {filaBoton("Unidades de medida", unidades, () =>
        Alert.alert("Unidades de medida", "Elegí el sistema de medidas", [
          { text: "Métrico (g, ml)", onPress: () => setUnidades("Métrico") },
          {
            text: "Imperial (oz, tazas)",
            onPress: () => setUnidades("Imperial"),
          },
          { text: "Cancelar", style: "cancel" },
        ]),
      )}

      {/* ---------------- INFORMACIÓN ---------------- */}
      <Text style={styles.tituloSeccion}>Información</Text>

      {filaBoton("Acerca de MyKitchen", "Versión 1.0.0", () =>
        mostrarAlerta(
          "MyKitchen 1.0.0",
          "Aplicación de recetas organizadas por las cuatro comidas del día.\n\n" +
            "Proyecto de la materia Plataformas Móviles.\n" +
            'E.E.S.T. N°7 "José Hernández" — 7mo 2da, Programación.\n\n' +
            "Las recetas de internet provienen de TheMealDB.",
        ),
      )}

      {filaBoton("Ayuda y soporte", "Sobre el equipo", () =>
        mostrarAlerta(
          "Equipo de desarrollo",
          "Matías Maldonado\nIago Craveli\nJulián Acosta\n\n" +
            "Para consultas, contactanos MyKitchen123@hotmail.com",
        ),
      )}

      {/* ---------------- RESTABLECER ---------------- */}
      <TouchableOpacity style={styles.botonPeligro} onPress={restablecer}>
        <Text style={styles.textoPeligro}>Restablecer configuración</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F4EE",
  },
  tituloSeccion: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 4,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E6E4DC",
  },
  opcionInfo: {
    flex: 1,
    paddingRight: 12,
  },
  opcionTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  opcionDescripcion: {
    fontSize: 13,
    color: "#888",
    marginTop: 3,
  },
  flecha: {
    fontSize: 26,
    color: "#ccc",
  },
  botonPeligro: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A8322E",
  },
  textoPeligro: {
    color: "#A8322E",
    fontSize: 16,
    fontWeight: "bold",
  },
});
