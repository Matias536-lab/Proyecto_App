import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';

import {
  traerRecetasDeUsuario,
  traerRecetaCompleta,
  borrarReceta
} from './apiUsuarios';

// Las recetas que creó el usuario. Salen de MySQL, no de la memoria de la app.

const ACENTO = '#9C4221';
const FONDO = '#F5F4EE';
const TARJETA = '#FFFFFF';
const BORDE = '#E6E4DC';
const TEXTO = '#333333';
const TEXTO_SUAVE = '#888888';
const DESTRUCTIVO = '#A8322E';
const RESPALDO_FOTO = '#7A5848';

function Tarjeta({ receta, onAbrir, onBorrar }) {
  const [fotoFallo, setFotoFallo] = useState(false);

  return (
    <View style={styles.tarjeta}>
      <TouchableOpacity style={styles.tarjetaCuerpo} onPress={onAbrir} activeOpacity={0.8}>
        {receta.imagen && !fotoFallo ? (
          <Image
            source={{ uri: receta.imagen }}
            style={styles.miniatura}
            onError={() => setFotoFallo(true)}
          />
        ) : (
          <View style={[styles.miniatura, styles.miniaturaSinFoto]}>
            <Text style={styles.miniaturaTexto}>{receta.categoria}</Text>
          </View>
        )}

        <View style={styles.tarjetaTextos}>
          <Text style={styles.tarjetaNombre} numberOfLines={2}>
            {receta.nombre}
          </Text>
          <Text style={styles.tarjetaCategoria}>{receta.categoria}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonBorrar} onPress={onBorrar}>
        <Text style={styles.botonBorrarTexto}>Borrar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MisRecetasScreen({ navegarA, usuario }) {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const id = usuario && usuario.id ? usuario.id : null;

  const cargar = () => {
    if (!id) {
      setCargando(false);
      return;
    }
    setCargando(true);
    setError('');

    traerRecetasDeUsuario(id)
      .then(setRecetas)
      .catch((e) => setError(e.message))
      .then(() => setCargando(false));
  };

  useEffect(cargar, [id]);

  const abrir = async (receta) => {
    setOcupado(true);
    try {
      const completa = await traerRecetaCompleta(receta.id);
      navegarA('DetalleReceta', { receta: completa });
    } catch (e) {
      Alert.alert('No se pudo abrir la receta', e.message);
    } finally {
      setOcupado(false);
    }
  };

  const confirmarBorrado = (receta) => {
    Alert.alert(
      'Borrar receta',
      'Se va a eliminar "' + receta.nombre + '" con sus ingredientes y sus pasos. No se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            setOcupado(true);
            try {
              await borrarReceta(receta.id);
              setRecetas(recetas.filter((r) => r.id !== receta.id));
            } catch (e) {
              Alert.alert('No se pudo borrar', e.message);
            } finally {
              setOcupado(false);
            }
          }
        }
      ]
    );
  };

  if (!id) {
    return (
      <View style={styles.centrado}>
        <View style={styles.tarjetaVacia}>
          <Text style={styles.tituloVacio}>No hay sesion abierta</Text>
          <Text style={styles.textoVacio}>
            Inicia sesion para ver las recetas que creaste.
          </Text>
          <TouchableOpacity style={styles.botonPrincipal} onPress={() => navegarA('Login')}>
            <Text style={styles.botonPrincipalTexto}>Iniciar sesion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={ACENTO} />
        <Text style={styles.cargandoTexto}>Cargando tus recetas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <View style={styles.tarjetaVacia}>
          <Text style={styles.tituloVacio}>No se pudieron traer tus recetas</Text>
          <Text style={styles.textoVacio}>{error}</Text>
          <TouchableOpacity style={styles.botonPrincipal} onPress={cargar}>
            <Text style={styles.botonPrincipalTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (recetas.length === 0) {
    return (
      <View style={styles.centrado}>
        <View style={styles.tarjetaVacia}>
          <Text style={styles.tituloVacio}>Todavia no creaste recetas</Text>
          <Text style={styles.textoVacio}>
            Las recetas que crees se guardan en la base de datos y van a aparecer aca.
          </Text>
          <TouchableOpacity
            style={styles.botonPrincipal}
            onPress={() => navegarA('CrearReceta')}
          >
            <Text style={styles.botonPrincipalTexto}>Crear mi primera receta</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.lista}>
      <Text style={styles.contador}>
        {recetas.length === 1 ? '1 receta creada' : recetas.length + ' recetas creadas'}
      </Text>

      {recetas.map((r) => (
        <Tarjeta
          key={r.id}
          receta={r}
          onAbrir={() => abrir(r)}
          onBorrar={() => confirmarBorrado(r)}
        />
      ))}

      {ocupado ? (
        <View style={styles.ocupado}>
          <ActivityIndicator size="small" color={ACENTO} />
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.botonPrincipal}
        onPress={() => navegarA('CrearReceta')}
      >
        <Text style={styles.botonPrincipalTexto}>Crear otra receta</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FONDO
  },
  lista: {
    padding: 20
  },
  contador: {
    fontSize: 14,
    color: ACENTO,
    fontWeight: '600',
    marginBottom: 14
  },
  tarjeta: {
    backgroundColor: TARJETA,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDE,
    overflow: 'hidden',
    elevation: 2
  },
  tarjetaCuerpo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  },
  miniatura: {
    width: 64,
    height: 64,
    borderRadius: 10
  },
  miniaturaSinFoto: {
    backgroundColor: RESPALDO_FOTO,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  miniaturaTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center'
  },
  tarjetaTextos: {
    flex: 1,
    marginLeft: 14
  },
  tarjetaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXTO
  },
  tarjetaCategoria: {
    fontSize: 13,
    color: ACENTO,
    marginTop: 3,
    fontWeight: '600'
  },
  botonBorrar: {
    borderTopWidth: 1,
    borderTopColor: BORDE,
    paddingVertical: 10,
    alignItems: 'center'
  },
  botonBorrarTexto: {
    color: DESTRUCTIVO,
    fontSize: 14,
    fontWeight: '600'
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
    marginBottom: 8,
    textAlign: 'center'
  },
  textoVacio: {
    fontSize: 15,
    color: TEXTO_SUAVE,
    textAlign: 'center',
    lineHeight: 21
  },
  cargandoTexto: {
    marginTop: 12,
    color: TEXTO_SUAVE,
    fontSize: 15
  },
  ocupado: {
    paddingVertical: 14,
    alignItems: 'center'
  },
  botonPrincipal: {
    backgroundColor: ACENTO,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center'
  },
  botonPrincipalTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
