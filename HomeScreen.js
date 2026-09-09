import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

export default function HomeScreen({ navegarA }) {
  const [busqueda, setBusqueda] = useState('');

  const manejarBusqueda = () => {
    if (busqueda.trim() !== '') {
      // IMPORTANTE: le mandamos el texto buscado a la pantalla de Resultados.
      // Antes navegábamos sin pasar el texto, por eso la búsqueda no funcionaba.
      //
      // Lo mandamos como TEXTO (no como objeto) a propósito: así funciona
      // tanto con el App.js nuevo como con el viejo.
      navegarA('Resultados', busqueda.trim());
      setBusqueda('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar Comida"
          placeholderTextColor="#777"
          style={styles.input}
          value={busqueda}
          onChangeText={(texto) => setBusqueda(texto)}
          returnKeyType="search"
          onSubmitEditing={manejarBusqueda}
        />

        {/* Botón de buscar: no todos los teclados muestran la tecla "buscar",
            así que conviene tener también un botón visible. */}
        <TouchableOpacity style={styles.botonBuscar} onPress={manejarBusqueda}>
          <Text style={styles.botonBuscarTexto}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjeta de Categorías */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navegarA('Categorias')}
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=600' }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}
        >
          <View style={styles.filtroOscuro}>
            <Text style={styles.cardTexto}>Categorías</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Tarjeta de Crear Receta */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navegarA('CrearReceta')}
      >
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

      {/* Tarjeta de Mis Recetas */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navegarA('MisRecetas')}
      >
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
  botonBuscar: {
    backgroundColor: '#0566b6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  botonBuscarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    height: 140,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  backgroundImage: { flex: 1, justifyContent: 'center' },
  filtroOscuro: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTexto: { color: '#fff', fontSize: 26, fontWeight: 'bold', letterSpacing: 0.5 }
});