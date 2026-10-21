import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { registrarUsuario } from './apiUsuarios';

export default function RegistroScreen({ navegarA, iniciarSesion }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetir, setRepetir] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const crearCuenta = async () => {
    setError('');

    if (!nombre.trim() || !email.trim() || !contrasena) {
      setError('Completa todos los campos.');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (contrasena !== repetir) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);

    try {
      // Si el correo ya existe, la API lo rechaza. Esa validacion la hace la
      // base de datos, asi que no se puede saltear desde la app.
      const usuario = await registrarUsuario(nombre.trim(), email.trim(), contrasena);

      if (iniciarSesion) {
        iniciarSesion(usuario);
      }

      navegarA('Inicio');
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.contenedor} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>
          Tus datos se guardan en la base de datos de MyKitchen.
        </Text>

        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          style={styles.campo}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor="#AAA"
          editable={!cargando}
        />

        <Text style={styles.etiqueta}>Correo electrónico</Text>
        <TextInput
          style={styles.campo}
          value={email}
          onChangeText={setEmail}
          placeholder="tucorreo@ejemplo.com"
          placeholderTextColor="#AAA"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!cargando}
        />

        <Text style={styles.etiqueta}>Contraseña</Text>
        <TextInput
          style={styles.campo}
          value={contrasena}
          onChangeText={setContrasena}
          placeholder="Al menos 6 caracteres"
          placeholderTextColor="#AAA"
          secureTextEntry
          editable={!cargando}
        />

        <Text style={styles.etiqueta}>Repetir contraseña</Text>
        <TextInput
          style={styles.campo}
          value={repetir}
          onChangeText={setRepetir}
          placeholder="Escribila de nuevo"
          placeholderTextColor="#AAA"
          secureTextEntry
          editable={!cargando}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.boton, cargando && styles.botonApagado]}
          onPress={crearCuenta}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.textoBoton}>Registrarme</Text>
          )}
        </TouchableOpacity>

        <View style={styles.separador} />

        <Text style={styles.textoPie}>¿Ya tenés cuenta?</Text>

        <TouchableOpacity
          style={styles.botonSecundario}
          onPress={() => navegarA('Login')}
          disabled={cargando}
        >
          <Text style={styles.textoBotonSecundario}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navegarA('Inicio')} disabled={cargando}>
          <Text style={styles.volver}>Volver al inicio</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F5F4EE',
    padding: 24
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10
  },
  subtitulo: {
    fontSize: 15,
    color: '#777',
    marginTop: 6,
    marginBottom: 26,
    lineHeight: 21
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6
  },
  campo: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E6E4DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#333',
    marginBottom: 18
  },
  error: {
    color: '#A8322E',
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 19
  },
  boton: {
    backgroundColor: '#9C4221',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4
  },
  botonApagado: {
    opacity: 0.7
  },
  textoBoton: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  separador: {
    height: 1,
    backgroundColor: '#E6E4DC',
    marginVertical: 28
  },
  textoPie: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 12
  },
  botonSecundario: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#9C4221',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  textoBotonSecundario: {
    color: '#9C4221',
    fontSize: 16,
    fontWeight: 'bold'
  },
  volver: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 22
  }
});
