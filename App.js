import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './HomeScreen';

export default function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pantallaActual, setPantallaActual] = useState('Inicio');

  const navegarA = (pantalla) => {
    setPantallaActual(pantalla);
    setMenuAbierto(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      
      {/* Barra Header*/}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuAbierto(!menuAbierto)} style={styles.menuBotón}>
          <Text style={styles.menuIcono}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>
          {pantallaActual === 'Inicio' ? 'MyKitchen' : 'Mi Cuenta'}
        </Text>
        <View style={{ width: 40 }} /> {/*Espacio del título*/}
      </View>

      {/*Menu Laterl*/}
      <View style={styles.contenidoPrincipal}>
        
        {pantallaActual === 'Inicio' ? <HomeScreen /> : (
          <View style={styles.pantallaGenerica}>
            <Text style={styles.textoPantalla}>Espacio de Perfil</Text>
          </View>
        )}

        {/* Menu del Drawer*/}
        {menuAbierto && (
          <View style={styles.drawerOverlay}>
            <View style={styles.drawer}>
              <Text style={styles.drawerTitulo}>Menú Principal</Text>
              <View style={styles.linea} />
              
              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('Inicio')}>
                <Text style={styles.drawerItemTexto}>Inicio</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('Perfil')}>
                <Text style={styles.drawerItemTexto}>Mi Cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('Configuracion')}>
                <Text style={styles.drawerItemTexto}>Configuración</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={() => navegarA('Perfil')}>
                <Text style={styles.drawerItemTexto}>Cerrar Sesión</Text>
              </TouchableOpacity>

            </View>
            <TouchableOpacity style={styles.cierreFalso} onPress={() => setMenuAbierto(false)} />
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  menuBotón: { width: 40, height: 40, justifyContent: 'center' },
  menuIcono: { fontSize: 28, color: '#333' },
  headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  contenidoPrincipal: { flex: 1, position: 'relative' },
  pantallaGenerica: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoPantalla: { fontSize: 18, color: '#666' },
  
  /* Estilos del Drawer */
  drawerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', zIndex: 999 },
  drawer: { width: '70%', backgroundColor: '#fff', height: '100%', padding: 20, elevation: 16, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3.84 },
  cierreFalso: { width: '30%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' },
  drawerTitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333', marginTop: 20 },
  linea: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  drawerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  drawerItemTexto: { fontSize: 18, color: '#444' }
});