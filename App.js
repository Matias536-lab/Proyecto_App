import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

// Traemos las pantallas desde sus archivos individuales para no amontonar código acá
import HomeScreen from './HomeScreen';
import PerfilScreen from './PerfilScreen';
import ConfigScreen from './ConfigScreen';
import CerrarScreen from './CerrarScreen';
import ResultadosScreen from './ResultadosScreen'; // Importamos la nueva pantalla de resultados

export default  function  App() {
/* Variables estado (Guardan datos que cambian la interfaz en tiempo real)
menuAbierto: true para mostrar el menú, false para ocultarlo */
const  [menuAbierto, setMenuAbierto] = useState(false);
// pantallaActual: guarda el texto de qué sección debe ver el usuario en este momento
const  [pantallaActual, setPantallaActual] = useState('Inicio');

// Funcion de navegacion: Cambia de pantalla y cierra el menú al mismo tiempo
const  navegarA = ( pantalla )  =>  {
setPantallaActual( pantalla );
setMenuAbierto(false); // Cierra el menú lateral automáticamente al tocar una opción
};

/* CORREGIDO: Volvimos a declarar el nombre de la función 'renderizarPantalla' */
const  renderizarPantalla = ()  =>  {
switch (pantallaActual) {
case 'Inicio':
return < HomeScreen navegarA={navegarA} />; // Pasamos navegarA para que el buscador pueda redirigir
case 'Configuracion':
return < ConfigScreen  />;
case 'CerrarSesion':
return < CerrarScreen  navegarA={navegarA} />;
case 'Perfil':
return < PerfilScreen  navegarA={navegarA} />;
case 'Resultados':
return < ResultadosScreen navegarA={navegarA} />; // Caso para mostrar la pantalla de sin resultados
default:
return < HomeScreen navegarA={navegarA}  />; // Si algo falla, por seguridad mostramos el Inicio
}
};

return (
// SafeAreaView evita que el contenido se meta debajo de la cámara frontal o la barra de batería
< SafeAreaView  style={styles.container}>
{/* Configura la barra de notificaciones del celular (hora, batería) con fondo claro */}
< StatusBar  barStyle="dark-content" backgroundColor="#FAF9F6" />

{/* Header (Barra superior fija) */}
< View  style={styles.header}>
{/* Aca entra el botón de tres líneas para abrir/cerrar el menú */}
< TouchableOpacity  onPress={()  =>  setMenuAbierto(!menuAbierto)} style={styles.menuBoton}>
< Text  style={styles.menuIcono}>☰</ Text >
</ TouchableOpacity >

{/* El titulo Cambia el texto del header según la pantalla en la que estemos */}
< Text  style={styles.headerTitulo}>
{pantallaActual === 'Inicio' ? 'MyKitchen' :
pantallaActual === 'Configuracion' ? 'Configuración' :
pantallaActual === 'CerrarSesion' ? 'Salir' : 
pantallaActual === 'Resultados' ? 'Búsqueda' : 'Mi Cuenta'}
</ Text >

{/* Este View vacío de 40px equilibra el espacio del botón izquierdo para que el título quede centrado */}
< View  style={{ width: 40 }} />
</ View >

{/* Contenedor principal: Aquí se implementa la pantalla que toque ver */}
< View  style={styles.contenidoPrincipal}>

{/* Ejecutamos la función de arriba para pintar el componente activo */}
{renderizarPantalla()}

{/* Menu lateral (Se dibuja por encima de la pantalla actual sólo si menuAbierto es true) */}
{menuAbierto && (
< View  style={styles.drawerOverlay}>
{/* El cajón blanco con las opciones */}
< View  style={styles.drawer}>
< Text  style={styles.drawerTitulo}>Menú Principal</ Text >
< View  style={styles.linea} /> {/* Línea divisoria gris */}

{/* Enlaces del menú. Cada uno llama a navegarA mandándole el nombre clave de la pantalla */}
< TouchableOpacity  style={styles.drawerItem} onPress={()  =>  navegarA('Inicio')}>
< Text  style={styles.drawerItemTexto}>Inicio</ Text >
</ TouchableOpacity >

< TouchableOpacity  style={styles.drawerItem} onPress={()  =>  navegarA('Perfil')}>
< Text  style={styles.drawerItemTexto}>Mi Cuenta</ Text >
</ TouchableOpacity >

< TouchableOpacity  style={styles.drawerItem} onPress={()  =>  navegarA('Configuracion')}>
< Text  style={styles.drawerItemTexto}>Configuración</ Text >
</ TouchableOpacity >

< TouchableOpacity  style={styles.drawerItem} onPress={()  =>  navegarA('CerrarSesion')}>
< Text  style={[styles.drawerItemTexto, { color: '#d9534f' }]}>Cerrar Sesión</ Text >
</ TouchableOpacity >
</ View >

{/* Cierre Falso: El área oscura fuera del menú. Si el usuario la toca, el menú se cierra */}
< TouchableOpacity  style={styles.cierreFalso} onPress={()  =>  setMenuAbierto(false)} />
</ View >
)}

</ View >
</ SafeAreaView >
);
}

// Estilos
const  styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#FAF9F6' },
header: {
height: 60,
flexDirection: 'row',
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

/* Diseño del drawer */
drawerOverlay: {
position: 'absolute',
top: 0, left: 0, right: 0, bottom: 0,
flexDirection: 'row',
zIndex: 999
},
drawer: {
width: '70%',
backgroundColor: '#fff',
height: '100%',
padding: 20,
elevation: 16,
shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3.84
},
cierreFalso: { width: '30%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' },
drawerTitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333', marginTop: 20 },
linea: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
drawerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
drawerItemTexto: { fontSize: 18, color: '#444' }
});