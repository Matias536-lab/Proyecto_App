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
  traerPerfil,
  traerRecetasDeUsuario,
  traerFavoritosDeUsuario,
  traerRecetaCompleta
} from './apiUsuarios';

// Pantalla de perfil.
//
// Estructura: cabecera, estadisticas, pestanias, grilla y cerrar sesion.
// Los numeros y las listas salen de la base de datos, no estan escritos aca.

const ACENTO = '#9C4221';
const FONDO = '#F5F4EE';
const TARJETA = '#FFFFFF';
const BORDE = '#E6E4DC';
const TEXTO = '#333333';
const TEXTO_SUAVE = '#888888';
const DESTRUCTIVO = '#A8322E';
const RESPALDO_FOTO = '#7A5848';

// "Fernando Lopez" -> "FL". Para cuando el usuario no tiene foto.
function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primera = partes[0][0];
  const segunda = partes.length > 1 ? partes[1][0] : '';
  return (primera + segunda).toUpperCase();
}

function Estadistica({ numero, etiqueta, activa, onPress }) {
  return (
    <TouchableOpacity style={styles.estadistica} onPress={onPress} activeOpacity={0.6}>
      <Text style={[styles.estadisticaNumero, activa && styles.estadisticaNumeroActiva]}>
        {numero}
      </Text>
      <Text style={styles.estadisticaEtiqueta}>{etiqueta}</Text>
    </TouchableOpacity>
  );
}

// Tarjeta de la grilla. Tiene su propio estado para la foto, porque si una
// imagen falla solo tiene que romperse esa tarjeta y no las demas.
function TarjetaReceta({ receta, onPress }) {
  const [fotoFallo, setFotoFallo] = useState(false);

  return (
    <TouchableOpacity style={styles.tarjeta} onPress={onPress} activeOpacity={0.8}>
      {receta.imagen && !fotoFallo ? (
        <Image
          source={{ uri: receta.imagen }}
          style={styles.tarjetaImagen}
          onError={() => setFotoFallo(true)}
        />
      ) : (
        <View style={[styles.tarjetaImagen, styles.tarjetaSinFoto]}>
          <Text style={styles.tarjetaSinFotoTexto} numberOfLines={2}>
            {receta.nombre}
          </Text>
        </View>
      )}

      <Text style={styles.tarjetaNombre} numberOfLines={2}>
        {receta.nombre}
      </Text>
      <Text style={styles.tarjetaCategoria}>{receta.categoria}</Text>
    </TouchableOpacity>
  );
}

export default function PerfilScreen({ navegarA, usuario }) {
  const [pestania, setPestania] = useState('recetas');
  const [perfil, setPerfil] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [abriendo, setAbriendo] = useState(false);

  // usuario.id solo existe si la sesion vino de la base de datos.
  const id = usuario && usuario.id ? usuario.id : null;

  useEffect(() => {
    if (!id) {
      setCargando(false);
      return;
    }

    let cancelado = false;
    setCargando(true);
    setError('');

    Promise.all([
      traerPerfil(id),
      traerRecetasDeUsuario(id),
      traerFavoritosDeUsuario(id)
    ])
      .then(([datosPerfil, misRecetas, misFavoritos]) => {
        if (cancelado) return;
        setPerfil(datosPerfil);
        setRecetas(misRecetas);
        setFavoritos(misFavoritos);
      })
      .catch((e) => {
        if (!cancelado) setError(e.message);
      })
      .then(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  // La grilla solo tiene id, nombre, categoria e imagen. Los ingredientes y
  // los pasos viven en otras tablas, asi que se piden al tocar la tarjeta.
  const abrirReceta = async (receta) => {
    setAbriendo(true);
    try {
      const completa = await traerRecetaCompleta(receta.id);
      navegarA('DetalleReceta', { receta: completa });
    } catch (e) {
      Alert.alert('No se pudo abrir la receta', e.message);
    } finally {
      setAbriendo(false);
    }
  };

  const editarPerfil = () => {
    Alert.alert(
      'Editar perfil',
      'Todavia no esta hecha la pantalla para cambiar el nombre, la foto y la descripcion.'
    );
  };

  // ---- SIN SESION DE LA BASE ----
  if (!id) {
    return (
      <View style={styles.centrado}>
        <View style={styles.tarjetaVacia}>
          <Text style={styles.tituloVacio}>No hay sesion abierta</Text>
          <Text style={styles.textoVacio}>
            Inicia sesion con tu cuenta para ver tu perfil, tus recetas y tus favoritos.
          </Text>
          <TouchableOpacity style={styles.botonPrincipal} onPress={() => navegarA('Login')}>
            <Text style={styles.botonPrincipalTexto}>Iniciar sesion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const nombre = perfil ? perfil.nombre : usuario.nombre;
  const email = perfil ? perfil.email : usuario.email;
  const foto = perfil ? perfil.foto : null;
  const bio = perfil ? perfil.bio : null;
  const lista = pestania === 'recetas' ? recetas : favoritos;

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      {/* CABECERA */}
      <View style={styles.cabecera}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarIniciales]}>
            <Text style={styles.avatarTexto}>{iniciales(nombre)}</Text>
          </View>
        )}

        <Text style={styles.nombre}>{nombre}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
        {bio ? <Text style={styles.bio}>{bio}</Text> : null}

        <TouchableOpacity style={styles.botonEditar} onPress={editarPerfil}>
          <Text style={styles.botonEditarTexto}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      {/* ESTADISTICAS */}
      <View style={styles.estadisticas}>
        <Estadistica
          numero={cargando ? '-' : recetas.length}
          etiqueta="Recetas"
          activa={pestania === 'recetas'}
          onPress={() => setPestania('recetas')}
        />
        <View style={styles.separadorVertical} />
        <Estadistica
          numero={cargando ? '-' : favoritos.length}
          etiqueta="Favoritos"
          activa={pestania === 'favoritos'}
          onPress={() => setPestania('favoritos')}
        />
      </View>

      {/* PESTANIAS */}
      <View style={styles.pestanias}>
        <TouchableOpacity
          style={[styles.pestania, pestania === 'recetas' && styles.pestaniaActiva]}
          onPress={() => setPestania('recetas')}
        >
          <Text
            style={[
              styles.pestaniaTexto,
              pestania === 'recetas' && styles.pestaniaTextoActivo
            ]}
          >
            Mis recetas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pestania, pestania === 'favoritos' && styles.pestaniaActiva]}
          onPress={() => setPestania('favoritos')}
        >
          <Text
            style={[
              styles.pestaniaTexto,
              pestania === 'favoritos' && styles.pestaniaTextoActivo
            ]}
          >
            Favoritos
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO */}
      {cargando ? (
        <View style={styles.cargando}>
          <ActivityIndicator size="small" color={ACENTO} />
          <Text style={styles.cargandoTexto}>Cargando tu perfil...</Text>
        </View>
      ) : error ? (
        <View style={styles.vacio}>
          <Text style={styles.vacioTexto}>
            No se pudieron traer tus datos. {error}
          </Text>
        </View>
      ) : lista.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.vacioTexto}>
            {pestania === 'recetas'
              ? 'Todavia no creaste ninguna receta.'
              : 'Todavia no guardaste ninguna receta en favoritos.'}
          </Text>
          {pestania === 'recetas' ? (
            <TouchableOpacity
              style={styles.botonPrincipal}
              onPress={() => navegarA('CrearReceta')}
            >
              <Text style={styles.botonPrincipalTexto}>Crear una receta</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <View style={styles.grilla}>
          {lista.map((r) => (
            <TarjetaReceta key={r.id} receta={r} onPress={() => abrirReceta(r)} />
          ))}
        </View>
      )}

      {abriendo ? (
        <View style={styles.cargando}>
          <ActivityIndicator size="small" color={ACENTO} />
          <Text style={styles.cargandoTexto}>Abriendo receta...</Text>
        </View>
      ) : null}

      {/* CERRAR SESION */}
      <TouchableOpacity
        style={styles.botonCerrar}
        onPress={() => navegarA('CerrarSesion')}
      >
        <Text style={styles.botonCerrarTexto}>Cerrar sesion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: FONDO
  },
  contenido: {
    paddingBottom: 40
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

  cabecera: {
    backgroundColor: ACENTO,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  avatarIniciales: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTexto: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ACENTO
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center'
  },
  email: {
    fontSize: 14,
    color: '#F3D9CC',
    marginTop: 3
  },
  bio: {
    fontSize: 14,
    color: '#FBEDE5',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20
  },
  botonEditar: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 20,
    marginTop: 16
  },
  botonEditarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14
  },

  estadisticas: {
    flexDirection: 'row',
    backgroundColor: TARJETA,
    marginHorizontal: 20,
    marginTop: -18,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: BORDE,
    elevation: 3
  },
  estadistica: {
    flex: 1,
    alignItems: 'center'
  },
  estadisticaNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXTO
  },
  estadisticaNumeroActiva: {
    color: ACENTO
  },
  estadisticaEtiqueta: {
    fontSize: 12,
    color: TEXTO_SUAVE,
    marginTop: 2
  },
  separadorVertical: {
    width: 1,
    backgroundColor: BORDE,
    marginVertical: 4
  },

  pestanias: {
    flexDirection: 'row',
    marginTop: 22,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDE
  },
  pestania: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent'
  },
  pestaniaActiva: {
    borderBottomColor: ACENTO
  },
  pestaniaTexto: {
    fontSize: 15,
    color: '#999999',
    fontWeight: '600'
  },
  pestaniaTextoActivo: {
    color: ACENTO
  },

  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16
  },
  tarjeta: {
    width: '48%',
    backgroundColor: TARJETA,
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDE,
    elevation: 2
  },
  tarjetaImagen: {
    width: '100%',
    height: 110
  },
  tarjetaSinFoto: {
    backgroundColor: RESPALDO_FOTO,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  tarjetaSinFotoTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center'
  },
  tarjetaNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXTO,
    marginTop: 8,
    marginHorizontal: 10
  },
  tarjetaCategoria: {
    fontSize: 12,
    color: ACENTO,
    marginHorizontal: 10,
    marginTop: 2,
    marginBottom: 10
  },

  cargando: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  cargandoTexto: {
    marginLeft: 10,
    color: TEXTO_SUAVE,
    fontSize: 14
  },
  vacio: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 30
  },
  vacioTexto: {
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
  },
  botonCerrar: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: DESTRUCTIVO,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 18
  },
  botonCerrarTexto: {
    color: DESTRUCTIVO,
    fontSize: 15,
    fontWeight: 'bold'
  }
});
