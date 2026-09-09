import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

// Importamos todas las pantallas
import HomeScreen from "./HomeScreen";
import PerfilScreen from "./PerfilScreen";
import ConfigScreen from "./ConfigScreen";
import CerrarScreen from "./CerrarScreen";
import ResultadosScreen from "./ResultadosScreen";
import CrearRecetasScreen from "./CrearRecetasScreen";
import MisRecetasScreen from "./MisRecetasScreen";
import CategoriasScreen from "./CategoriasScreen";
import DetalleRecetaScreen from "./DetalleRecetaScreen";

export default function App() {
  // Controla si el menú lateral está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Guarda cuál pantalla se está mostrando
  const [pantallaActual, setPantallaActual] = useState("Inicio");

  // Guarda las recetas creadas por el usuario
  const [recetas, setRecetas] = useState([]);

  // Guarda los datos que una pantalla le manda a otra.
  // Antes solo guardábamos el texto del buscador; ahora es un objeto
  // que puede llevar cualquier cosa: { busqueda }, { categoria }, { receta }...
  const [parametrosNavegacion, setParametrosNavegacion] = useState(null);

  // Agregar una nueva receta
  const agregarReceta = (nuevaReceta) => {
    setRecetas([
      ...recetas,
      {
        ...nuevaReceta,
        id: Date.now(),
      },
    ]);
  };

  // Eliminar una receta
  const eliminarReceta = (id) => {
    setRecetas(recetas.filter((receta) => receta.id !== id));
  };

  // Función para cambiar de pantalla.
  //
  // Acepta dos formas de uso, para no romper el código que ya teníamos:
  //   navegarA("Resultados", "pizza")              -> texto suelto (forma vieja)
  //   navegarA("Resultados", { busqueda: "pizza" }) -> objeto (forma nueva)
  //   navegarA("DetalleReceta", { receta: unaReceta })
  //   navegarA("Categorias", { categoria: "Desayuno" })
  const navegarA = (pantalla, params = null) => {
    // Si nos mandan un texto suelto, lo convertimos en objeto automáticamente
    const parametros =
      typeof params === "string" ? { busqueda: params } : params;

    setPantallaActual(pantalla);
    setParametrosNavegacion(parametros);
    setMenuAbierto(false);
  };

  // Decide qué pantalla mostrar
  const renderizarPantalla = () => {
    switch (pantallaActual) {
      case "Inicio":
        return <HomeScreen navegarA={navegarA} />;

      case "Perfil":
        return <PerfilScreen navegarA={navegarA} />;

      case "Configuracion":
        return <ConfigScreen navegarA={navegarA} />;

      case "CerrarSesion":
        return <CerrarScreen navegarA={navegarA} />;

      case "Resultados":
        // Le pasamos "route" (forma nueva) y también "busqueda" (forma vieja),
        // así la pantalla funciona con cualquiera de las dos versiones.
        return (
          <ResultadosScreen
            navegarA={navegarA}
            route={parametrosNavegacion}
            busqueda={
              parametrosNavegacion && parametrosNavegacion.busqueda
                ? parametrosNavegacion.busqueda
                : ""
            }
          />
        );

      case "CrearReceta":
        return (
          <CrearRecetasScreen
            navegarA={navegarA}
            agregarReceta={agregarReceta}
          />
        );

      case "MisRecetas":
        return (
          <MisRecetasScreen
            navegarA={navegarA}
            recetas={recetas}
            eliminarReceta={eliminarReceta}
          />
        );

      case "Categorias":
        return (
          <CategoriasScreen navegarA={navegarA} route={parametrosNavegacion} />
        );

      case "DetalleReceta":
        return (
          <DetalleRecetaScreen
            navegarA={navegarA}
            route={parametrosNavegacion}
          />
        );

      default:
        return <HomeScreen navegarA={navegarA} />;
    }
  };

  // Obtiene el título que aparece en el Header
  const obtenerTitulo = () => {
    switch (pantallaActual) {
      case "Inicio":
        return "MyKitchen";
      case "Perfil":
        return "Mi Cuenta";
      case "Configuracion":
        return "Configuración";
      case "CerrarSesion":
        return "Salir";
      case "Resultados":
        return "Búsqueda";
      case "CrearReceta":
        return "Crear Receta";
      case "MisRecetas":
        return "Mis Recetas";
      case "Categorias":
        return "Categorías";
      case "DetalleReceta":
        // Si tenemos la receta, mostramos su nombre en el header
        return parametrosNavegacion && parametrosNavegacion.receta
          ? parametrosNavegacion.receta.nombre
          : "Receta";
      default:
        return "MyKitchen";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setMenuAbierto(!menuAbierto)}
          style={styles.menuBoton}
        >
          <Text style={styles.menuIcono}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitulo} numberOfLines={1}>
          {obtenerTitulo()}
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.contenidoPrincipal}>
        {renderizarPantalla()}

        {/* MENÚ LATERAL */}
        {menuAbierto && (
          <View style={styles.drawerOverlay}>
            <View style={styles.drawer}>
              <Text style={styles.drawerTitulo}>Menú Principal</Text>
              <View style={styles.linea} />

              {/* INICIO */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("Inicio")}
              >
                <Text style={styles.drawerItemTexto}>🏠 Inicio</Text>
              </TouchableOpacity>

              {/* MI CUENTA */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("Perfil")}
              >
                <Text style={styles.drawerItemTexto}>👤 Mi Cuenta</Text>
              </TouchableOpacity>

              {/* CATEGORÍAS */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("Categorias")}
              >
                <Text style={styles.drawerItemTexto}>📂 Categorías</Text>
              </TouchableOpacity>

              {/* CREAR RECETA */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("CrearReceta")}
              >
                <Text style={styles.drawerItemTexto}>📝 Crear Receta</Text>
              </TouchableOpacity>

              {/* MIS RECETAS */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("MisRecetas")}
              >
                <Text style={styles.drawerItemTexto}>📖 Mis Recetas</Text>
              </TouchableOpacity>

              {/* CONFIGURACIÓN */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("Configuracion")}
              >
                <Text style={styles.drawerItemTexto}>⚙️ Configuración</Text>
              </TouchableOpacity>

              {/* CERRAR SESIÓN */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("CerrarSesion")}
              >
                <Text style={[styles.drawerItemTexto, { color: "#d9534f" }]}>
                  🚪 Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>

            {/* Zona oscura para cerrar el menú */}
            <TouchableOpacity
              style={styles.cierreFalso}
              onPress={() => setMenuAbierto(false)}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  menuBoton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  menuIcono: {
    fontSize: 28,
    color: "#333",
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  contenidoPrincipal: {
    flex: 1,
    position: "relative",
  },
  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 999,
  },
  drawer: {
    width: "70%",
    backgroundColor: "#fff",
    height: "100%",
    padding: 20,
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cierreFalso: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawerTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    marginTop: 20,
  },
  linea: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  drawerItemTexto: {
    fontSize: 18,
    color: "#444",
  },
});
