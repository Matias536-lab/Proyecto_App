import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Recibimos "navegarA" desestructurado desde los parámetros. Viene directo desde App.js
export default function CerrarSesionScreen({ navegarA }) {
  return (
    <View style={styles.container}>
      {/* Tarjeta central flotante */}
      <View style={styles.card}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.titulo}>¿Deseas salir?</Text>
        <Text style={styles.subtitulo}>Tendrás que volver a ingresar tus datos la próxima vez.</Text>
        
        {/* Botón de acción destructiva (rojo) */}
        <TouchableOpacity style={styles.botonSalir}>
          <Text style={styles.textoSalir}>Confirmar Salida</Text>
        </TouchableOpacity>

        {/* Al presionar Cancelar, llamamos al parámetro navegarA para regresar sanos y salvos al Inicio */}
        <TouchableOpacity onPress={() => navegarA('Inicio')}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
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
  card: { backgroundColor: '#fff',
  padding: 30,
  borderRadius: 20,
  width: '100%',
  alignItems: 'center',
  elevation: 5 
  },
  emoji: { fontSize: 50,
  marginBottom: 10 
  },
  titulo: { fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10 
  },
  subtitulo: { fontSize: 16,
  color: '#666',
  textAlign: 'center',
  marginBottom: 30 
  },
  botonSalir: { backgroundColor: '#d9534f',
  paddingVertical: 15,
  paddingHorizontal: 40,
  borderRadius: 12,
  marginBottom: 15 
},
  textoSalir: { color: '#fff',
  fontWeight: 'bold',
  fontSize: 16 
},
  textoCancelar: { color: '#333',
  fontSize: 16,
  textDecorationLine: 'underline' 

} // Aplica el subrayado clásico de enlace web
});