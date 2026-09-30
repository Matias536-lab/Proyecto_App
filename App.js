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
import LoginScreen from "./LoginScreen";
import RegistroScreen from "./RegistroScreen";

export default function App() {
  // Controla si el menú lateral está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Guarda cuál pantalla se está mostrando
  const [pantallaActual, setPantallaActual] = useState("Inicio");

  // Guarda las recetas creadas por el usuario
  const [recetas, setRecetas] = useState([]);

  // ---- PREFERENCIAS DE LA APP ----
  // Viven acá y no dentro de ConfigScreen, para que no se pierdan
  // cuando el usuario sale de esa pantalla y vuelve.
  const [buscarInternet, setBuscarInternet] = useState(true);

  // ---- SESIÓN DEL USUARIO ----
  // sesionIniciada dice si hay alguien "adentro" de la app.
  // Arranca en true para que la app se pueda usar de entrada;
  // al confirmar la salida en CerrarScreen pasa a false.
  const [sesionIniciada, setSesionIniciada] = useState(true);

  // Datos de quien está usando la app. Es null cuando no hay sesión.
  const [usuario, setUsuario] = useState({ nombre: "Mi cuenta", email: "" });

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

  // Borrar todas las recetas creadas. La usa Configuración.
  const borrarTodasLasRecetas = () => {
    setRecetas([]);
  };

  // Abre la sesión: guarda los datos y manda al inicio.
  // La llaman LoginScreen y RegistroScreen cuando los datos son válidos.
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    setSesionIniciada(true);
    navegarA("Inicio");
  };

  // Cierra la sesión: borra los datos del usuario.
  // A partir de acá el menú esconde "Mi Cuenta" y muestra
  // "Iniciar Sesión" y "Registrarse".
  const cerrarSesion = () => {
    setUsuario(null);
    setSesionIniciada(false);
    navegarA("Inicio");
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
    const parametros = typeof params === "string" ? { busqueda: params } : params;

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
        // Si no hay sesión, no tiene sentido mostrar el perfil:
        // mandamos directo a iniciar sesión.
        if (!sesionIniciada) {
          return <LoginScreen navegarA={navegarA} iniciarSesion={iniciarSesion} />;
        }
        return <PerfilScreen navegarA={navegarA} usuario={usuario} />;

      case "Login":
        return <LoginScreen navegarA={navegarA} iniciarSesion={iniciarSesion} />;

      case "Registro":
        return <RegistroScreen navegarA={navegarA} iniciarSesion={iniciarSesion} />;

      case "Configuracion":
        return (
          <ConfigScreen
            navegarA={navegarA}
            buscarInternet={buscarInternet}
            setBuscarInternet={setBuscarInternet}
            recetas={recetas}
            borrarTodasLasRecetas={borrarTodasLasRecetas}
          />
        );

      case "CerrarSesion":
        // Si ya cerró sesión, no hay nada que cerrar.
        if (!sesionIniciada) {
          return <LoginScreen navegarA={navegarA} iniciarSesion={iniciarSesion} />;
        }
        return <CerrarScreen navegarA={navegarA} cerrarSesion={cerrarSesion} />;

      case "Resultados":
        // Le pasamos "route" (forma nueva) y también "busqueda" (forma vieja),
        // así la pantalla funciona con cualquiera de las dos versiones.
        return (
          <ResultadosScreen
            navegarA={navegarA}
            route={parametrosNavegacion}
            buscarInternet={buscarInternet}
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
        return "Cerrar Sesión";
      case "Login":
        return "Iniciar Sesión";
      case "Registro":
        return "Crear Cuenta";
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

              {/* El menú solo tiene lo que NO está en la pantalla de Inicio.
                  Categorías, Crear Receta y Mis Recetas ya tienen su caja
                  ahí, y repetirlas acá sería mostrar lo mismo dos veces. */}

              {/* INICIO */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("Inicio")}
              >
                <Text style={styles.drawerItemTexto}>Inicio</Text>
              </TouchableOpacity>

              {/* MI CUENTA: solo si hay sesión abierta */}
              {sesionIniciada ? (
                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={() => navegarA("Perfil")}
                >
                  <Text style={styles.drawerItemTexto}>Mi Cuenta</Text>
                </TouchableOpacity>
              ) : null}

              {/* CONFIGURACIÓN: siempre visible */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navegarA("Configuracion")}
              >
                <Text style={styles.drawerItemTexto}>Configuración</Text>
              </TouchableOpacity>

              {/* Acá el menú cambia según haya sesión o no:
                  con sesión abierta ofrece salir,
                  sin sesión ofrece entrar o registrarse. */}
              {sesionIniciada ? (
                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={() => navegarA("CerrarSesion")}
                >
                  <Text style={[styles.drawerItemTexto, { color: "#A8322E" }]}>
                    Cerrar Sesión
                  </Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navegarA("Login")}
                  >
                    <Text style={styles.drawerItemTexto}>Iniciar Sesión</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navegarA("Registro")}
                  >
                    <Text style={styles.drawerItemTexto}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
              )}
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