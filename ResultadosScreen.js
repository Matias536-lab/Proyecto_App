import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function ResultadosScreen({ navegarA }) {
  return (
    <View style={styles.container}>
      {/* Tarjeta central flotante similar a la de Cerrar Sesión */}
      <View style={styles.card}>
        <Text style={styles.emoji}>🔍</Text>
        <Text style={styles.titulo}>Sin resultados</Text>
        <Text style={styles.subtitulo}>No encontramos recetas que coincidan con tu búsqueda por el momento.</Text>

        {/* Botón para regresar de forma segura a la pantalla principal */}
        <TouchableOpacity style={styles.botonVolver} onPress={() => navegarA('Inicio')}>
          <Text style={styles.textoVolver}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4EE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: { 
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5
  },
  emoji: { 
    fontSize: 50,
    marginBottom: 10
  },
  titulo: { 
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  subtitulo: { 
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30
  },
  botonVolver: { 
    backgroundColor: '#0566b6', // Usamos el mismo azul de PerfilScreen para consistencia de marca
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  textoVolver: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});