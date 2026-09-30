import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

// Las categorías siguen definidas en recetas.js (un solo lugar).
import { CATEGORIAS } from "./recetas";

// ------------------------------------------------------------
// FOTOS DE CADA CATEGORÍA
//
// Acá y en ningún otro lado. Si querés cambiar la foto de una comida,
// reemplazá la dirección de esa línea por otra y listo.
// Para conseguir otra: entrá a unsplash.com, buscá una foto,
// hacé clic derecho sobre ella > "Copiar dirección de imagen".
// ------------------------------------------------------------
const IMAGENES_CATEGORIAS = {
  Desayuno:
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=600",
  Almuerzo:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600",
  Merienda:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600",
  Cena: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600",
};

export default function CategoriasScreen({ navegarA }) {
  // Al tocar una categoría vamos a Resultados, pero en lugar de mandarle
  // un texto de búsqueda le mandamos cuál categoría eligió el usuario.
  const abrirCategoria = (categoria) => {
    navegarA("Resultados", { categoria: categoria.id });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Las 4 comidas del día</Text>

      {CATEGORIAS.map((categoria) => {
        return (
          <TouchableOpacity
            key={categoria.id}
            style={styles.card}
            onPress={() => abrirCategoria(categoria)}
          >
            <ImageBackground
              source={{ uri: IMAGENES_CATEGORIAS[categoria.id] }}
              style={styles.imagenFondo}
              imageStyle={{ borderRadius: 15 }}
            >
              {/* Capa oscura: hace que el texto blanco se lea
                  aunque la foto de atrás sea clara. */}
              <View style={styles.filtroOscuro}>
                <Text style={styles.cardTitulo}>{categoria.nombre}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={styles.botonVolver}
        onPress={() => navegarA("Inicio")}
      >
        <Text style={styles.botonVolverTexto}>Volver al inicio</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4EE",
    padding: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
    marginBottom: 14,
  },
  card: {
    // Más bajas que las de Inicio: así entran las cuatro
    // en pantalla sin tener que deslizar.
    height: 110,
    marginBottom: 12,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    // Color de respaldo: si la foto no carga, la caja se ve igual
    // de prolija en vez de quedar en blanco.
    backgroundColor: "#7A5648",
  },
  imagenFondo: {
    flex: 1,
    justifyContent: "center",
  },
  filtroOscuro: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  cardTitulo: {
    color: "#fff",
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  botonVolver: {
    backgroundColor: "#9C4221",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  botonVolverTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});