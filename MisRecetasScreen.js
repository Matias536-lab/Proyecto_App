import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Modal,
  FlatList
} from 'react-native';

export default function MisRecetasScreen({ navegarA, recetas, eliminarReceta }) {
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const verDetalle = (receta) => {
    setRecetaSeleccionada(receta);
    setModalVisible(true);
  };

  const confirmarEliminar = (id) => {
    Alert.alert(
      'Eliminar receta',
      '¿Estás seguro de que quieres eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => eliminarReceta(id)
        }
      ]
    );
  };

  const renderReceta = ({ item }) => (
    <TouchableOpacity 
      style={styles.recetaCard}
      onPress={() => verDetalle(item)}
    >
      <View style={styles.recetaHeader}>
        <Text style={styles.recetaNombre}>{item.nombre}</Text>
        <TouchableOpacity 
          onPress={() => confirmarEliminar(item.id)}
          style={styles.eliminarBoton}
        >
          <Text style={styles.eliminarTexto}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recetaInfo}>
        <Text style={styles.recetaDetalle}>⏱ {item.tiempo}</Text>
        <Text style={styles.recetaDetalle}>👥 {item.porciones}</Text>
      </View>
      <Text style={styles.recetaResumen}>
        {item.ingredientes.length} ingredientes • {item.pasos.length} pasos
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {recetas.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.emoji}>🍽️</Text>
          <Text style={styles.tituloVacio}>No tienes recetas</Text>
          <Text style={styles.subtituloVacio}>
            ¡Empieza a crear tus propias recetas desde el inicio!
          </Text>
          <TouchableOpacity 
            style={styles.botonCrear}
            onPress={() => navegarA('CrearReceta')}
          >
            <Text style={styles.botonTexto}>Crear primera receta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recetas}
          renderItem={renderReceta}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.lista}
        />
      )}

      {/* Modal de detalle */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitulo}>{recetaSeleccionada?.nombre}</Text>
              
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfo}>⏱ {recetaSeleccionada?.tiempo}</Text>
                <Text style={styles.modalInfo}>👥 {recetaSeleccionada?.porciones}</Text>
              </View>

              <Text style={styles.modalSubtitulo}>Ingredientes</Text>
              {recetaSeleccionada?.ingredientes.map((ing, index) => (
                <Text key={index} style={styles.modalListaItem}>• {ing}</Text>
              ))}

              <Text style={styles.modalSubtitulo}>Pasos</Text>
              {recetaSeleccionada?.pasos.map((paso, index) => (
                <Text key={index} style={styles.modalListaItem}>
                  {index + 1}. {paso}
                </Text>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalCerrar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F4EE',
  },
  lista: {
    padding: 15,
  },
  recetaCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6E4DC',
    elevation: 2,
  },
  recetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recetaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  eliminarBoton: {
    padding: 5,
  },
  eliminarTexto: {
    fontSize: 18,
    color: '#d9534f',
    fontWeight: 'bold',
  },
  recetaInfo: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  recetaDetalle: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  recetaResumen: {
    fontSize: 13,
    color: '#888',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  tituloVacio: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtituloVacio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  botonCrear: {
    backgroundColor: '#0566b6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalInfo: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 10,
  },
  modalSubtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  modalListaItem: {
    fontSize: 15,
    color: '#444',
    paddingVertical: 3,
    paddingLeft: 5,
  },
  modalCerrar: {
    backgroundColor: '#0566b6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCerrarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});