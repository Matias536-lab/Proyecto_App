import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

// Esta pantalla muestra la ficha completa de UNA receta.
//
// Recibe la receta a través de "route", que es el objeto que mandamos
// desde otra pantalla con:  navegarA("DetalleReceta", { receta: unaReceta })
//
// Sirve tanto para las recetas propias de MyKitchen (recetas.js)
// como para las que vengan de la API, porque las dos usan los mismos campos.
export default function DetalleRecetaScreen({ navegarA, route }) {
  // Si la foto del plato no llega a cargarse (sin internet, dirección
  // caída), lo anotamos acá para mostrar una portada de respaldo
  // en vez de dejar un hueco roto en la pantalla.
  const [fotoFallo, setFotoFallo] = useState(false);

  // Si por algún motivo llegamos acá sin receta, mostramos un aviso
  // en lugar de dejar que la app se rompa.
  const receta = route && route.receta ? route.receta : null;

  if (!receta) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.tituloVacio}>No se encontró la receta</Text>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navegarA("Inicio")}
        >
          <Text style={styles.botonVolverTexto}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Algunos campos pueden no venir (sobre todo si la receta viene de la API),
  // así que preparamos valores por defecto para que nunca quede en blanco.
  const ingredientes = receta.ingredientes || [];
  const pasos = receta.pasos || [];

  return (
    <ScrollView style={styles.container}>
      {/* PORTADA: la foto del plato.
          Si falta o no carga, mostramos una franja de color con el
          nombre de la comida, para que nunca quede un hueco vacío. */}
      {receta.imagen && !fotoFallo ? (
        <View style={styles.portada}>
          <Image
            source={{ uri: receta.imagen }}
            style={styles.imagen}
            onError={() => setFotoFallo(true)}
          />
        </View>
      ) : (
        <View style={styles.portadaSinFoto}>
          <Text style={styles.portadaSinFotoTexto}>
            {receta.categoria || "Receta"}
          </Text>
        </View>
      )}

      <Text style={styles.nombre}>{receta.nombre}</Text>

      {/* ETIQUETAS: categoría, tiempo y porciones */}
      <View style={styles.filaEtiquetas}>
        {receta.categoria ? (
          <View style={styles.etiqueta}>
            <Text style={styles.etiquetaTexto}>{receta.categoria}</Text>
          </View>
        ) : null}

        {receta.tiempo ? (
          <View style={styles.etiqueta}>
            <Text style={styles.etiquetaTexto}>{receta.tiempo}</Text>
          </View>
        ) : null}

        {receta.porciones ? (
          <View style={styles.etiqueta}>
            <Text style={styles.etiquetaTexto}>{receta.porciones}</Text>
          </View>
        ) : null}
      </View>

      {/* INFORMACIÓN BREVE SOBRE EL PLATO */}
      {receta.descripcion ? (
        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>Sobre este plato</Text>
          <Text style={styles.descripcion}>{receta.descripcion}</Text>
        </View>
      ) : null}

      {/* INGREDIENTES */}
      <View style={styles.tarjeta}>
        <Text style={styles.subtitulo}>Ingredientes</Text>
        {ingredientes.length > 0 ? (
          ingredientes.map((ingrediente, indice) => (
            <View key={indice} style={styles.filaIngrediente}>
              <Text style={styles.punto}>•</Text>
              <Text style={styles.textoItem}>{ingrediente}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.textoSinDatos}>
            Esta receta no tiene ingredientes cargados.
          </Text>
        )}
      </View>

      {/* PREPARACIÓN */}
      <View style={styles.tarjeta}>
        <Text style={styles.subtitulo}>Preparación</Text>
        {pasos.length > 0 ? (
          pasos.map((paso, indice) => (
            <View key={indice} style={styles.filaPaso}>
              <View style={styles.numeroPaso}>
                <Text style={styles.numeroPasoTexto}>{indice + 1}</Text>
              </View>
              <Text style={styles.textoItem}>{paso}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.textoSinDatos}>
            Esta receta no tiene pasos cargados.
          </Text>
        )}
      </View>

      {/* BOTONES */}
      <TouchableOpacity
        style={styles.botonVolver}
        onPress={() => navegarA("Inicio")}
      >
        <Text style={styles.botonVolverTexto}>Volver al inicio</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4EE",
    padding: 20,
  },
  portada: {
    height: 160,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6E4DC",
    overflow: "hidden",
    marginBottom: 15,
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  portadaSinFoto: {
    height: 110,
    backgroundColor: "#7A5648",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  portadaSinFotoTexto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  nombre: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  filaEtiquetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  etiqueta: {
    backgroundColor: "#F7EBE5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  etiquetaTexto: {
    color: "#9C4221",
    fontSize: 14,
    fontWeight: "600",
  },
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E6E4DC",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  filaIngrediente: {
    flexDirection: "row",
    marginBottom: 8,
  },
  punto: {
    fontSize: 15,
    color: "#9C4221",
    marginRight: 8,
    fontWeight: "bold",
  },
  filaPaso: {
    flexDirection: "row",
    marginBottom: 14,
  },
  numeroPaso: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#9C4221",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  numeroPasoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  textoItem: {
    fontSize: 15,
    color: "#444",
    flex: 1,
    lineHeight: 21,
  },
  textoSinDatos: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  botonVolver: {
    backgroundColor: "#9C4221",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  botonVolverTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  vacio: {
    flex: 1,
    backgroundColor: "#F5F4EE",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  tituloVacio: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
  },
});