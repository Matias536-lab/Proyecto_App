import AsyncStorage from '@react-native-async-storage/async-storage';

// Guarda y lee las preferencias en el telefono.
//
// Los valores viven en App.js mientras la app esta abierta, pero eso se
// pierde al cerrarla. AsyncStorage los escribe en el disco del celular,
// asi que la proxima vez que se abra la app siguen como el usuario los dejo.

const CLAVE = 'mykitchen:preferencias';

export const PREFERENCIAS_INICIALES = {
  notificaciones: true,
  modoOscuro: false,
  vibracion: true,
  buscarInternet: true,
  idioma: 'Español'
};

export async function cargarPreferencias() {
  try {
    const texto = await AsyncStorage.getItem(CLAVE);
    if (!texto) return PREFERENCIAS_INICIALES;

    // Se mezcla con las iniciales por si en una version nueva agregamos
    // una preferencia que el telefono todavia no tiene guardada.
    return Object.assign({}, PREFERENCIAS_INICIALES, JSON.parse(texto));
  } catch (e) {
    return PREFERENCIAS_INICIALES;
  }
}

export async function guardarPreferencias(preferencias) {
  try {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(preferencias));
  } catch (e) {
    // Si no se puede escribir, la app sigue funcionando con los valores
    // en memoria. No vale la pena molestar al usuario con un error.
  }
}
