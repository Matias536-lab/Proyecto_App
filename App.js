import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

// Traemos las pantallas desde sus archivos individuales para no amontonar código acá
import HomeScreen from './HomeScreen';
import PerfilScreen from './PerfilScreen';
import ConfigScreen from './ConfigScreen'; 
import CerrarScreen from './CerrarScreen';   

export default function App() {
  // VARIABLES DE ESTADO (Guardan datos que cambian la interfaz en tiempo real)
  // menuAbierto: true para mostrar el menú, false para ocultarlo
  const [menuAbierto, setMenuAbierto] = useState(false);
  // pantallaActual: guarda el texto de qué sección debe ver el usuario en este momento
  const [pantallaActual, setPantallaActual] = useState('Inicio');
  
  // FUNCION DE NAVEGACIÓN: Cambia de pantalla y cierra el menú al mismo tiempo
  const navegarA = (pantalla) => {
    setPantallaActual(pantalla);
    setMenuAbierto(false); // Cierra el menú lateral automáticamente al tocar una opción
  };

  // SWITCH DINÁMICO: Examina la variable "pantallaActual" y devuelve el componente correspondiente
  // Nota: A CerrarScreen y PerfilScreen les pasamos la función navegarA como parámetro (Prop) 
  // para que esos archivos puedan ordenarle a App.js que cambie de pantalla.
  const renderizarPantalla = () => {
    switch (pantallaActual) {
      case 'Inicio': 
        return <HomeScreen />;
      case 'Configuracion': 
        return <ConfigScreen />;
      case 'CerrarSesion': 
        return <CerrarScreen navegarA={navegarA} />;
      case 'Perfil': 
        return <PerfilScreen navegarA={navegarA} />;
      default: 
        return <HomeScreen />; // Si algo falla, por seguridad mostramos el Inicio
    }
  };

  return (
    // SafeAreaView evita que el contenido se meta debajo de la cámara frontal o la barra de batería
    <SafeAreaView style={styles.container}>
      {/* Configura la barra de notificaciones del celular (hora, batería) con fondo claro */}
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      
      {/* HEADER (Barra superior fija) */}
      <View style={styles.header}>
        {/* Botón de tres líneas (Hamburguesa) para abrir/cerrar el menú */}
        <TouchableOpacity onPress={() => setMenuAbierto(!menuAbierto)} style={styles.menuBoton}>
          <Text style={styles.menuIcono}>☰</Text>
        </TouchableOpacity>

        {/* TÍTULO DINÁMICO: Cambia el texto del header según la pantalla en la que estemos */}
        <Text style={styles.headerTitulo}>
          {pantallaActual === 'Inicio' ? 'MyKitchen' : 
           pantallaActual === 'Configuracion' ? 'Configuración' : 
           pantallaActual === 'CerrarSesion' ? 'Salir' : 'Mi Cuenta'}
        </Text>

        {/* Este View vacío de 40px equilibra el espacio del botón izquierdo para que el título quede centrado */}
        <View style={{ width: 40 }} />
      </View>

      {/* CONTENEDOR PRINCIPAL: Aquí se inyecta la pantalla que toque ver */}
      <View style={styles.contenidoPrincipal}>
        
        {/* Ejecutamos la función de arriba para pintar el componente activo */}
        {renderizarPantalla()}

        {/* MENÚ LATERAL (Se dibuja por encima de la pantalla actual sólo si menuAbierto es true) */}
        {menuAbierto && (
          <View style={styles.drawerOverlay}>
            {/* El cajón blanco con las opciones */}
            <View style={styles.drawer}>
              <Text style={styles.drawerTitulo}>Menú Principal</Text>
              <View style={styles.linea} /> {/* Línea divisoria gris */}
              
              {/* Enlaces del menú. Cada uno llama a navegarA mandándole el nombre clave de la pantalla */}
              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('Inicio')}>
                <Text style={styles.drawerItemTexto}>Inicio</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('Perfil')}>
                <Text style={styles.drawerItemTexto}>Mi Cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('Configuracion')}>
                <Text style={styles.drawerItemTexto}>Configuración</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('CerrarSesion')}>
                <Text style={[styles.drawerItemTexto, { color: '#d9534f' }]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>

            {/* Cierre Falso: El área oscura fuera del menú. Si el usuario la toca, el menú se cierra */}
            <TouchableOpacity style={styles.cierreFalso} onPress={() => setMenuAbierto(false)} />
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

// ARQUITECTURA DE ESTILOS (Equivalente a CSS pero estructurado en objetos de JavaScript)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: {
    height: 60,
    flexDirection: 'row', // Distribuye los elementos horizontalmente (como un flexbox de CSS)
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  menuBoton: { width: 40, height: 40, justifyContent: 'center' },
  menuIcono: { fontSize: 28, color: '#333' },
  headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  contenidoPrincipal: { flex: 1, position: 'relative' },
  
  /* DISEÑO DEL DRAWER (Efecto de capa flotante) */
  drawerOverlay: { 
    position: 'absolute', // Hace flotar el menú por encima del contenido del fondo
    top: 0, left: 0, right: 0, bottom: 0, 
    flexDirection: 'row', 
    zIndex: 999 // Asegura que esté en el nivel más alto de la pantalla
  },
  drawer: { 
    width: '70%', 
    backgroundColor: '#fff', 
    height: '100%', 
    padding: 20, 
    elevation: 16, // Crea la sombra proyectada en Android
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3.84 // Sombras para iOS
  },
  cierreFalso: { width: '30%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }, // Fondo negro translúcido
  drawerTitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333', marginTop: 20 },
  linea: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  drawerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  drawerItemTexto: { fontSize: 18, color: '#444' }
});