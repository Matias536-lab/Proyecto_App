import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert
} from 'react-native';

import * as Haptics from 'expo-haptics';

// Pantalla de Configuración.
//
// Los valores no viven acá: llegan desde App.js por props. Eso es lo que
// hace que no se pierdan al salir de la pantalla, y lo que permite que
// otras pantallas los usen (por ejemplo el buscador).

const PISTA = { false: '#D8D5CC', true: '#D9B5A6' };
const PERILLA_ENCENDIDA = '#9C4221';
const PERILLA_APAGADA = '#F4F3F4';

export default function ConfigScreen({
  navegarA,
  preferencias,
  cambiarPreferencia,
  restablecerPreferencias
}) {
  const vibrar = () => {
    if (preferencias.vibracion) {
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const cambiar = (clave, valor) => {
    // Se vibra con el valor nuevo, no con el viejo: si el usuario acaba de
    // encender la vibración, tiene que sentirla en ese mismo toque.
    if (clave === 'vibracion' ? valor : preferencias.vibracion) {
      Haptics.selectionAsync().catch(() => {});
    }
    cambiarPreferencia(clave, valor);
  };

  const mostrarAlerta = (titulo, mensaje) => {
    vibrar();
    Alert.alert(titulo, mensaje, [{ text: 'Cerrar' }]);
  };

  const elegirIdioma = () => {
    vibrar();
    Alert.alert('Idioma', 'Elegí el idioma de la aplicación', [
      { text: 'Español', onPress: () => cambiar('idioma', 'Español') },
      { text: 'Inglés', onPress: () => cambiar('idioma', 'Inglés') },
      { text: 'Portugués', onPress: () => cambiar('idioma', 'Portugués') },
      { text: 'Cancelar', style: 'cancel' }
    ]);
  };

  const restablecer = () => {
    vibrar();
    Alert.alert(
      'Restablecer configuración',
      '¿Estás seguro? Todas las preferencias vuelven a como venían de fábrica.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            restablecerPreferencias();
            Alert.alert('Listo', 'Configuración restablecida.', [{ text: 'Cerrar' }]);
          }
        }
      ]
    );
  };

  const filaInterruptor = (titulo, descripcion, clave) => (
    <View style={styles.opcion}>
      <View style={styles.opcionInfo}>
        <Text style={styles.opcionTitulo}>{titulo}</Text>
        <Text style={styles.opcionDescripcion}>{descripcion}</Text>
      </View>
      <Switch
        value={preferencias[clave]}
        onValueChange={(valor) => cambiar(clave, valor)}
        trackColor={PISTA}
        thumbColor={preferencias[clave] ? PERILLA_ENCENDIDA : PERILLA_APAGADA}
      />
    </View>
  );

  const filaBoton = (titulo, valorActual, alTocar) => (
    <TouchableOpacity style={styles.opcion} onPress={alTocar}>
      <View style={styles.opcionInfo}>
        <Text style={styles.opcionTitulo}>{titulo}</Text>
        <Text style={styles.opcionDescripcion}>{valorActual}</Text>
      </View>
      <Text style={styles.flecha}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ---------------- PREFERENCIAS DE LA APP ---------------- */}
      <Text style={styles.tituloSeccion}>Preferencias de la app</Text>

      {filaInterruptor(
        'Notificaciones',
        'Avisos de recetas nuevas. Se activa en una próxima versión',
        'notificaciones'
      )}

      {filaInterruptor('Modo oscuro', 'Cambiar la app a tema oscuro', 'modoOscuro')}

      {filaInterruptor('Vibración', 'Vibrar al tocar los controles', 'vibracion')}

      {/* ---------------- BÚSQUEDA ---------------- */}
      <Text style={styles.tituloSeccion}>Búsqueda</Text>

      {filaInterruptor(
        'Buscar recetas de internet',
        'Sumar resultados de TheMealDB a los de MyKitchen',
        'buscarInternet'
      )}

      {/* ---------------- PREFERENCIAS DE COCINA ---------------- */}
      <Text style={styles.tituloSeccion}>Preferencias de cocina</Text>

      {filaBoton('Idioma', preferencias.idioma, elegirIdioma)}

      {/* ---------------- INFORMACIÓN ---------------- */}
      <Text style={styles.tituloSeccion}>Información</Text>

      {filaBoton('Acerca de MyKitchen', 'Versión 1.0.0', () =>
        mostrarAlerta(
          'MyKitchen 1.0.0',
          'Aplicación de recetas organizadas por las cuatro comidas del día.\n\n' +
            'Proyecto de la materia Plataformas Móviles.\n' +
            'E.E.S.T. N°7 "José Hernández" — 7mo 2da, Programación.\n\n' +
            'Las recetas de internet provienen de TheMealDB.'
        )
      )}

      {filaBoton('Ayuda y soporte', 'Sobre el equipo', () =>
        mostrarAlerta(
          'Equipo de desarrollo',
          'Matías Maldonado\nIago Craveli\nJulián Acosta\n\n' +
            'Profesor: Hernán Ruiz\n\n' +
            'Para consultas, contactanos a través de la escuela.'
        )
      )}

      <TouchableOpacity style={styles.botonPeligro} onPress={restablecer}>
        <Text style={styles.textoPeligro}>Restablecer configuración</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F4EE'
  },
  tituloSeccion: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 4
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E6E4DC'
  },
  opcionApagada: {
    opacity: 0.55
  },
  opcionInfo: {
    flex: 1,
    paddingRight: 12
  },
  opcionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333'
  },
  opcionDescripcion: {
    fontSize: 13,
    color: '#888888',
    marginTop: 3
  },
  flecha: {
    fontSize: 26,
    color: '#CCCCCC'
  },
  botonPeligro: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A8322E'
  },
  textoPeligro: {
    color: '#A8322E',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
