import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function ConfiguracionScreen() {
  // Matriz de objetos que simula los datos de configuración. Esto evita repetir código JSX manualmente.
  const opciones = [
    { id: 1, titulo: 'Notificaciones', subtitulo: 'Configuraciones recibidas' },
    { id: 2, titulo: 'Privacidad', subtitulo: 'Gestiona la privacidad de tu perfil' },
    { id: 3, titulo: 'Idioma', subtitulo: 'Español Latino' },
    { id: 4, titulo: 'Modo Oscuro', subtitulo: 'Desactivado' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* .map() recorre la lista anterior y genera una tarjeta blanca en pantalla por cada objeto */}
      {opciones.map((opcion) => (
        // El atributo "key" es obligatorio en React para que sepa qué elemento actualizar si la lista cambia
        <TouchableOpacity key={opcion.id} style={styles.item}>
          <View>
            <Text style={styles.tituloItem}>{opcion.titulo}</Text>
            <Text style={styles.subtituloItem}>{opcion.subtitulo}</Text>
          </View>
          {/* Ícono decorativo indicador de avance */}
          <Text style={styles.flecha}>❯</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F4EE', padding: 20 },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between', // Empuja los textos a la izquierda y la flecha al extremo derecho
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E4DC',
  },
  tituloItem: { fontSize: 18,
  fontWeight: 'bold',
  color: '#333' 
  },
  subtituloItem: { fontSize: 14,
  color: '#777',
  marginTop: 4 
  },
  flecha: { fontSize: 18,
  color: '#ccc' 
}
});