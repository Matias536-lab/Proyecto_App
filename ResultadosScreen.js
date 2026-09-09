import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';

// Traemos las funciones de búsqueda desde api.js.
// Esta pantalla NO sabe de dónde salen las recetas, solo las pide.
import { buscarLocal, recetasPorCategoria, buscarEnInternet } from './api';

// Convierte a texto lo que nos manden, venga como venga.
//
// Esto existe porque la búsqueda puede llegar de dos formas distintas
// según qué versión de App.js esté en uso:
//   - como texto:  "pollo"
//   - como objeto: { busqueda: "pollo" }
// Si intentáramos mostrar el objeto directamente, React se rompe con el error
// "Objects are not valid as a React child". Así nos aseguramos de que
// SIEMPRE terminemos con un texto.
function obtenerTexto(valor) {
    if (!valor) return '';
    if (typeof valor === 'string') return valor;
    if (typeof valor === 'object' && valor.busqueda) return String(valor.busqueda);
    return '';
}

export default function ResultadosScreen({ navegarA, busqueda, route }) {
    // Probamos las dos formas posibles y nos quedamos con la primera que dé texto.
    const textoBuscado =
        obtenerTexto(busqueda) ||
        obtenerTexto(route && route.busqueda) ||
        obtenerTexto(route);

    const categoriaBuscada =
        route && typeof route.categoria === 'string' ? route.categoria : '';

    // --- ESTADOS ---
    // Resultados que vienen de internet
    const [resultadosApi, setResultadosApi] = useState([]);
    // Mientras esperamos la respuesta de la API
    const [cargando, setCargando] = useState(false);
    // Si algo falló, guardamos el mensaje para mostrárselo al usuario
    const [error, setError] = useState('');
    // Para saber si el usuario ya apretó el botón de buscar en internet
    const [yaBusqueEnInternet, setYaBusqueEnInternet] = useState(false);

    // Si cambia la búsqueda, limpiamos lo anterior.
    useEffect(() => {
        setResultadosApi([]);
        setError('');
        setYaBusqueEnInternet(false);
    }, [textoBuscado, categoriaBuscada]);

    // --- BÚSQUEDA EN NUESTRAS RECETAS ---
    // Es instantánea: no necesita internet ni esperar a nadie.
    const resultadosLocales = categoriaBuscada
        ? recetasPorCategoria(categoriaBuscada)
        : buscarLocal(textoBuscado);

    // --- BÚSQUEDA EN INTERNET ---
    const buscarMas = async () => {
        setCargando(true);
        setError('');
        setYaBusqueEnInternet(true);

        try {
            const encontradas = await buscarEnInternet(textoBuscado);
            setResultadosApi(encontradas);
        } catch (e) {
            // Mostramos el mensaje de error en vez de dejar que la app se rompa
            setError(e.message || 'Ocurrió un error al buscar en internet.');
        }

        setCargando(false);
    };

    // Abre la ficha completa de una receta
    const abrirReceta = (receta) => {
        navegarA('DetalleReceta', { receta: receta });
    };

    // Dibuja una tarjeta de receta.
    // Sin emojis ni imágenes: solo información escrita, que es lo que
    // le sirve al usuario para decidir si le interesa el plato.
    const renderTarjeta = (receta) => (
        <TouchableOpacity
            key={receta.id}
            style={styles.card}
            onPress={() => abrirReceta(receta)}
        >
            <View style={styles.cardTextos}>
                <Text style={styles.nombre}>{receta.nombre}</Text>

                {/* Línea de datos: categoría, tiempo y porciones */}
                <View style={styles.filaDatos}>
                    {receta.categoria ? (
                        <Text style={styles.dato}>{receta.categoria}</Text>
                    ) : null}
                    {receta.tiempo ? (
                        <Text style={styles.dato}>· {receta.tiempo}</Text>
                    ) : null}
                    {receta.porciones ? (
                        <Text style={styles.dato}>· {receta.porciones}</Text>
                    ) : null}
                </View>

                {/* Adelanto de la descripción, recortado a 2 renglones */}
                {receta.descripcion ? (
                    <Text style={styles.resumen} numberOfLines={2}>
                        {receta.descripcion}
                    </Text>
                ) : null}

                {/* Cuántos ingredientes y pasos tiene */}
                <Text style={styles.conteo}>
                    {(receta.ingredientes || []).length} ingredientes ·{' '}
                    {(receta.pasos || []).length} pasos
                </Text>
            </View>

            <Text style={styles.flecha}>›</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* ENCABEZADO */}
            <Text style={styles.titulo}>
                {categoriaBuscada ? categoriaBuscada : 'Resultados de búsqueda'}
            </Text>

            {textoBuscado ? (
                <Text style={styles.busqueda}>Buscaste: "{textoBuscado}"</Text>
            ) : null}

            {/* ---------- RESULTADOS PROPIOS ---------- */}
            {resultadosLocales.length > 0 ? (
                <View>
                    <Text style={styles.seccion}>
                        En MyKitchen ({resultadosLocales.length})
                    </Text>
                    {resultadosLocales.map(renderTarjeta)}
                </View>
            ) : (
                <View style={styles.sinResultados}>
                    <Text style={styles.tituloSinResultados}>Sin resultados propios</Text>
                    <Text style={styles.subtitulo}>
                        No encontramos recetas de MyKitchen que coincidan con tu búsqueda.
                    </Text>
                </View>
            )}

            {/* ---------- BOTÓN PARA AMPLIAR CON INTERNET ---------- */}
            {textoBuscado && !yaBusqueEnInternet ? (
                <TouchableOpacity style={styles.botonInternet} onPress={buscarMas}>
                    <Text style={styles.botonInternetTexto}>Buscar más en internet</Text>
                </TouchableOpacity>
            ) : null}

            {/* Mientras carga */}
            {cargando ? (
                <View style={styles.cargando}>
                    <ActivityIndicator size="large" color="#0566b6" />
                    <Text style={styles.cargandoTexto}>Buscando en internet...</Text>
                </View>
            ) : null}

            {/* Si hubo un error */}
            {error ? (
                <View style={styles.errorCaja}>
                    <Text style={styles.errorTitulo}>No se pudo completar la búsqueda</Text>
                    <Text style={styles.errorTexto}>{error}</Text>
                    <TouchableOpacity style={styles.botonReintentar} onPress={buscarMas}>
                        <Text style={styles.botonReintentarTexto}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {/* ---------- RESULTADOS DE INTERNET ---------- */}
            {resultadosApi.length > 0 ? (
                <View>
                    <Text style={styles.seccion}>
                        De internet ({resultadosApi.length})
                    </Text>
                    <Text style={styles.aviso}>
                        Estas recetas vienen de una base internacional, así que están en inglés.
                    </Text>
                    {resultadosApi.map(renderTarjeta)}
                </View>
            ) : null}

            {/* Buscó en internet, no hubo error, pero no encontró nada */}
            {yaBusqueEnInternet && !cargando && !error && resultadosApi.length === 0 ? (
                <Text style={styles.aviso}>
                    Tampoco encontramos resultados en internet para "{textoBuscado}".
                </Text>
            ) : null}

            {/* BOTÓN VOLVER */}
            <TouchableOpacity
                style={styles.botonVolver}
                onPress={() => navegarA('Inicio')}
            >
                <Text style={styles.textoVolver}>Volver al Inicio</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F4EE',
        padding: 20
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5
    },
    busqueda: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15
    },
    seccion: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0566b6',
        marginTop: 15,
        marginBottom: 10
    },
    aviso: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
        marginBottom: 12
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#E6E4DC',
        elevation: 2
    },
    cardTextos: {
        flex: 1
    },
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5
    },
    filaDatos: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 6
    },
    dato: {
        fontSize: 13,
        color: '#0566b6',
        fontWeight: '600',
        marginRight: 5
    },
    resumen: {
        fontSize: 14,
        color: '#666',
        lineHeight: 19,
        marginBottom: 6
    },
    conteo: {
        fontSize: 12,
        color: '#999'
    },
    flecha: {
        fontSize: 24,
        color: '#ccc',
        marginLeft: 5
    },
    sinResultados: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E6E4DC'
    },
    tituloSinResultados: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8
    },
    subtitulo: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center'
    },
    botonInternet: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#0566b6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20
    },
    botonInternetTexto: {
        color: '#0566b6',
        fontSize: 16,
        fontWeight: 'bold'
    },
    cargando: {
        alignItems: 'center',
        marginTop: 25
    },
    cargandoTexto: {
        marginTop: 10,
        color: '#666',
        fontSize: 15
    },
    errorCaja: {
        backgroundColor: '#FDEDEC',
        borderRadius: 12,
        padding: 18,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#F5C6CB'
    },
    errorTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d9534f',
        marginBottom: 6
    },
    errorTexto: {
        fontSize: 14,
        color: '#8a4f4c',
        marginBottom: 12
    },
    botonReintentar: {
        backgroundColor: '#d9534f',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    botonReintentarTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
    botonVolver: {
        backgroundColor: '#0566b6',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 25
    },
    textoVolver: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});