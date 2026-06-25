import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

export default function HomeScreen() {
  return (
    // ScrollView permite deslizar la pantalla hacia abajo si las tarjetas no caben en pantallas chicas
    <ScrollView style={styles.container}>
      
      {/* Barra de busqueda */}
      <View style={styles.searchContainer}>
        <TextInput 
          placeholder="Buscar recetas" 
          placeholderTextColor="#777"
          style={styles.input}
        />
      </View>

      {/* Tarjeta de Categorias */}
      <TouchableOpacity style={styles.card}>
        {/* ImageBackground permite poner texto y filtros directamente encima de una imagen de internet */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=600' }} 
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }} // Aplica esquinas redondeadas directamente al mapa de bits de la foto
        >
          {/* Filtro oscuro para opacar la imagen y lograr que el texto blanco se lea sin forzar la vista */}
          <View style={styles.filtroOscuro}>
            <Text style={styles.cardTexto}>Categorías</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      
      {/* Tarjeta de Crear Receta */}
      <TouchableOpacity style={styles.card}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=600' }} 
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}
        >
          <View style={styles.filtroOscuro}>
            <Text style={styles.cardTexto}>Crear receta</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Tarjeta de mis recetas*/}
      <TouchableOpacity style={styles.card}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=600' }} 
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}
        >
          <View style={styles.filtroOscuro}>
            <Text style={styles.cardTexto}>Mis recetas</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#F5F4EE' },
  searchContainer: { marginBottom: 20, marginTop: 10 },
  input: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E6E4DC',
    fontSize: 16,
    paddingLeft: 15
  },
  card: { 
    height: 140, 
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden', // CRUCIAL: Recorta la imagen de fondo para que respete las esquinas redondeadas de la tarjeta
    elevation: 3, 
  },
  backgroundImage: { flex: 1, justifyContent: 'center' },
  filtroOscuro: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Capa negra con 25% de opacidad
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTexto: { color: '#fff', fontSize: 26, fontWeight: 'bold', letterSpacing: 0.5 }
});