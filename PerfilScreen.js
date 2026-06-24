import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Recibimos también navegarA aquí por si en el futuro quieren poner un botón de "Volver al inicio"
export default function PerfilScreen({ navegarA }) {
  return (
    <View style={styles.pantallaGenerica}>
      <Text style={styles.textoPantalla}>Espacio de Perfil</Text>
      
      {/* Botón añadido para darle utilidad práctica a la navegación y probar los parámetros */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navegarA('Inicio')}>
        <Text style={styles.textoBoton}>Ir a Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pantallaGenerica: { 
    flex: 1, 
    backgroundColor: '#F5F4EE', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  textoPantalla: { fontSize: 20, color: '#333', fontWeight: '500', marginBottom: 20 },
  botonVolver: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E4DC'
  },
  textoBoton: { color: '#555', fontSize: 16, fontWeight: 'bold' }
});