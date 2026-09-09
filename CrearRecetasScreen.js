import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';

export default function CrearRecetasScreen({ navegarA, agregarReceta }) {
  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [porciones, setPorciones] = useState('');

  // Función para guardar la receta
  const guardarReceta = () => {
    // Validaciones
    if (!nombre.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la receta');
      return;
    }
    if (!ingredientes.trim()) {
      Alert.alert('Error', 'Por favor ingresa los ingredientes');
      return;
    }
    if (!pasos.trim()) {
      Alert.alert('Error', 'Por favor ingresa los pasos de preparación');
      return;
    }

    // Crear objeto receta
    const nuevaReceta = {
      nombre: nombre.trim(),
      ingredientes: ingredientes.trim().split('\n').filter(i => i.trim() !== ''),
      pasos: pasos.trim().split('\n').filter(p => p.trim() !== ''),
      tiempo: tiempo.trim() || 'No especificado',
      porciones: porciones.trim() || 'No especificado',
    };

    // Agregar al estado global
    agregarReceta(nuevaReceta);

    // Limpiar formulario
    setNombre('');
    setIngredientes('');
    setPasos('');
    setTiempo('');
    setPorciones('');

    // Mostrar mensaje de éxito
    Alert.alert(
      '¡Éxito!', 
      'Receta creada correctamente',
      [{ text: 'Ver mis recetas', onPress: () => navegarA('MisRecetas') }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre de la receta *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pastel de chocolate"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Ingredientes *</Text>
        <Text style={styles.helper}>Escribe cada ingrediente en una línea nueva</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Harina\nAzúcar\nHuevos\n..."
          value={ingredientes}
          onChangeText={setIngredientes}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Pasos de preparación *</Text>
        <Text style={styles.helper}>Escribe cada paso en una línea nueva</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="1. Mezclar los ingredientes secos\n2. Agregar los líquidos\n..."
          value={pasos}
          onChangeText={setPasos}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Tiempo de preparación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 45 minutos"
          value={tiempo}
          onChangeText={setTiempo}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Porciones</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 8 porciones"
          value={porciones}
          onChangeText={setPorciones}
          placeholderTextColor="#999"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonGuardar} onPress={guardarReceta}>
            <Text style={styles.buttonText}>Guardar Receta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.buttonCancelar]} 
            onPress={() => navegarA('Inicio')}
          >
            <Text style={styles.buttonTextCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F4EE',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  helper: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E4DC',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  buttonGuardar: {
    backgroundColor: '#0566b6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonCancelar: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextCancelar: {
    color: '#666',
    fontSize: 16,
  },
});