import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { crearReceta } from './apiUsuarios';

// Pantalla para crear una receta.
//
// La receta se guarda en MySQL, no en la memoria de la app. Por eso hace
// falta estar logueado: cada receta queda asociada a su autor.

const ACENTO = '#9C4221';
const FONDO = '#F5F4EE';
const TARJETA = '#FFFFFF';
const BORDE = '#E6E4DC';
const TEXTO = '#333333';
const TEXTO_SUAVE = '#888888';

const CATEGORIAS = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];

export default function CrearRecetasScreen({ navegarA, usuario }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [porciones, setPorciones] = useState('');
  const [imagen, setImagen] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const id = usuario && usuario.id ? usuario.id : null;

  // Sin sesion no se puede crear: la receta necesita un autor.
  if (!id) {
    return (
      <View style={styles.centrado}>
        <View style={styles.tarjetaVacia}>
          <Text style={styles.tituloVacio}>Necesitas una cuenta</Text>
          <Text style={styles.textoVacio}>
            Las recetas se guardan con el nombre de quien las escribio, asi que
            hace falta iniciar sesion para crear una.
          </Text>
          <TouchableOpacity style={styles.botonPrincipal} onPress={() => navegarA('Login')}>
            <Text style={styles.botonPrincipalTexto}>Iniciar sesion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const guardar = async () => {
    setError('');

    if (!nombre.trim()) {
      setError('Poné el nombre de la receta.');
      return;
    }
    if (!categoria) {
      setError('Elegí a qué comida del día pertenece.');
      return;
    }

    // Cada renglón del cuadro de texto es un ingrediente o un paso.
    const listaIngredientes = ingredientes
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    const listaPasos = pasos
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    if (listaIngredientes.length === 0) {
      setError('Escribí al menos un ingrediente, uno por renglón.');
      return;
    }
    if (listaPasos.length === 0) {
      setError('Escribí al menos un paso, uno por renglón.');
      return;
    }

    setGuardando(true);

    try {
      const creada = await crearReceta({
        autor_id: id,
        nombre: nombre.trim(),
        categoria: categoria,
        descripcion: descripcion.trim(),
        tiempo: tiempo.trim(),
        porciones: porciones.trim(),
        imagen: imagen.trim(),
        ingredientes: listaIngredientes,
        pasos: listaPasos
      });

      setNombre('');
      setCategoria('');
      setDescripcion('');
      setIngredientes('');
      setPasos('');
      setTiempo('');
      setPorciones('');
      setImagen('');

      Alert.alert(
        'Receta guardada',
        'Quedó en la base de datos con ' +
          creada.ingredientes +
          ' ingredientes y ' +
          creada.pasos +
          ' pasos.',
        [
          { text: 'Crear otra', style: 'cancel' },
          { text: 'Ver mis recetas', onPress: () => navegarA('MisRecetas') }
        ]
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.ayuda}>
          Tu receta se guarda en la base de datos y queda asociada a tu cuenta.
        </Text>

        <Text style={styles.etiqueta}>Nombre de la receta *</Text>
        <TextInput
          style={styles.campo}
          placeholder="Ej: Milanesa con puré"
          placeholderTextColor="#AAA"
          value={nombre}
          onChangeText={setNombre}
          editable={!guardando}
        />

        <Text style={styles.etiqueta}>Comida del día *</Text>
        <View style={styles.categorias}>
          {CATEGORIAS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, categoria === c && styles.chipActivo]}
              onPress={() => setCategoria(c)}
              disabled={guardando}
            >
              <Text style={[styles.chipTexto, categoria === c && styles.chipTextoActivo]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.etiqueta}>Descripción</Text>
        <TextInput
          style={[styles.campo, styles.campoMediano]}
          placeholder="Una o dos líneas sobre el plato"
          placeholderTextColor="#AAA"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          editable={!guardando}
        />

        <Text style={styles.etiqueta}>Ingredientes *</Text>
        <Text style={styles.sugerencia}>Uno por renglón</Text>
        <TextInput
          style={[styles.campo, styles.campoGrande]}
          placeholder={'4 bifes de nalga\n2 huevos\n300 g de pan rallado'}
          placeholderTextColor="#AAA"
          value={ingredientes}
          onChangeText={setIngredientes}
          multiline
          editable={!guardando}
        />

        <Text style={styles.etiqueta}>Preparación *</Text>
        <Text style={styles.sugerencia}>Un paso por renglón</Text>
        <TextInput
          style={[styles.campo, styles.campoGrande]}
          placeholder={'Batir los huevos con ajo y perejil\nPasar los bifes por huevo y pan rallado\nFreír 3 minutos de cada lado'}
          placeholderTextColor="#AAA"
          value={pasos}
          onChangeText={setPasos}
          multiline
          editable={!guardando}
        />

        <View style={styles.fila}>
          <View style={styles.mitad}>
            <Text style={styles.etiqueta}>Tiempo</Text>
            <TextInput
              style={styles.campo}
              placeholder="45 minutos"
              placeholderTextColor="#AAA"
              value={tiempo}
              onChangeText={setTiempo}
              editable={!guardando}
            />
          </View>

          <View style={styles.mitad}>
            <Text style={styles.etiqueta}>Porciones</Text>
            <TextInput
              style={styles.campo}
              placeholder="4 porciones"
              placeholderTextColor="#AAA"
              value={porciones}
              onChangeText={setPorciones}
              editable={!guardando}
            />
          </View>
        </View>

        <Text style={styles.etiqueta}>Foto (enlace)</Text>
        <Text style={styles.sugerencia}>Opcional. Si no ponés ninguna, se muestra una banda con el nombre</Text>
        <TextInput
          style={styles.campo}
          placeholder="https://..."
          placeholderTextColor="#AAA"
          value={imagen}
          onChangeText={setImagen}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!guardando}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.boton, guardando && styles.botonApagado]}
          onPress={guardar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.botonTexto}>Guardar receta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navegarA('Inicio')} disabled={guardando}>
          <Text style={styles.volver}>Volver al inicio</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FONDO,
    padding: 20
  },
  ayuda: {
    fontSize: 14,
    color: TEXTO_SUAVE,
    marginBottom: 20,
    lineHeight: 20
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 6
  },
  sugerencia: {
    fontSize: 12,
    color: TEXTO_SUAVE,
    marginBottom: 6,
    marginTop: -2
  },
  campo: {
    backgroundColor: TARJETA,
    borderWidth: 1,
    borderColor: BORDE,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXTO,
    marginBottom: 18
  },
  campoMediano: {
    height: 70,
    textAlignVertical: 'top'
  },
  campoGrande: {
    height: 120,
    textAlignVertical: 'top'
  },
  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14
  },
  chip: {
    borderWidth: 1,
    borderColor: BORDE,
    backgroundColor: TARJETA,
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 18,
    marginRight: 8,
    marginBottom: 8
  },
  chipActivo: {
    backgroundColor: ACENTO,
    borderColor: ACENTO
  },
  chipTexto: {
    fontSize: 14,
    color: TEXTO,
    fontWeight: '600'
  },
  chipTextoActivo: {
    color: '#FFFFFF'
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mitad: {
    width: '48%'
  },
  error: {
    color: '#A8322E',
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 19
  },
  boton: {
    backgroundColor: ACENTO,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4
  },
  botonApagado: {
    opacity: 0.7
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  volver: {
    color: TEXTO_SUAVE,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20
  },

  centrado: {
    flex: 1,
    backgroundColor: FONDO,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  tarjetaVacia: {
    backgroundColor: TARJETA,
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    padding: 26,
    borderWidth: 1,
    borderColor: BORDE
  },
  tituloVacio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXTO,
    marginBottom: 8
  },
  textoVacio: {
    fontSize: 15,
    color: TEXTO_SUAVE,
    textAlign: 'center',
    lineHeight: 21
  },
  botonPrincipal: {
    backgroundColor: ACENTO,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20
  },
  botonPrincipalTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
