import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native';

export default function ProfileScreen() {
  return (
            <View style={styles.container}>
              <View style={styles.icono}>
                <ImageBackground 
                        source={{ uri: 'https://unsplash.com/es/ilustraciones/marcador-de-posicion-de-imagen-de-perfil-para-una-persona-desconocida-x9LSAQ7_V1s' }} 
                        style={styles.backgroundImage}
                        imageStyle={{borderRadius: 15}}
                      ></ImageBackground>
                      </View>
                      
              <View style={styles.card}>
                <Text style={styles.titulo}>Nombre de cuenta</Text>
              </View>
            </View>
          );
}

const styles = StyleSheet.create({
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
  container: { flex: 1,
  backgroundColor: '#0566b6',
  justifyContent: 'center',
  alignItems: 'center', padding: 20 
  },
  card: { backgroundColor: '#fff',
  height: '85%',
  width: '110%',
  alignItems: 'center',
  marginTop: 40 
  },
  icono: { backgroundColor: '#524949',
  borderRadius: 100,
  width: '55%',
  height: '26.5%',
  alignItems: 'center',
  marginTop: '30%' 
  },
  backgroundImage: { flex: 1,
  justifyContent: 'center' 
  },
  titulo: { fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10 
  },
  menuBoton: { width: 40,
  height: 40,
  justifyContent: 'center' 
  },
  menuIcono: { fontSize: 28,
  color: '#333' 
  },
  headerTitulo: { fontSize: 20,
  fontWeight: 'bold',
  color: '#333' 
  },
  contenidoPrincipal: { flex: 1,
  position: 'relative' 
  },
  pantallaGenerica: { flex: 1,
  justifyContent: 'center',
  alignItems: 'center' 
  },
  textoPantalla: { fontSize: 18,
  color: '#666' 
},
});