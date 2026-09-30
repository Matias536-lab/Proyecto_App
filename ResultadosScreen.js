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
// La búsqueda puede llegar de dos formas según qué versión de App.js
// esté en uso: como texto ("pollo") o como objeto ({ busqueda: "pollo" }).
// Si intentáramos mostrar el objeto directamente, React se rompe con
// "Objects are not valid as a React child". Así siempre terminamos con texto.
function obtenerTexto(valor) {
    if (!valor) return '';
    if (typeof valor === 'string') return valor;
    if (typeof valor === 'object' && valor.busqueda) return String(valor.busqueda);
    return '';
}

export default function ResultadosScreen({ navegarA, busqueda, route, buscarInternet }) {
    const textoBuscado =
        obtenerTexto(busqueda) ||
        obtenerTexto(route && route.busqueda) ||
        obtenerTexto(route);

    const categoriaBuscada =
        route && typeof route.categoria === 'string' ? route.categoria : '';

    // --- ESTADOS ---
    const [resultadosApi, setResultadosApi] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    // --- BÚSQUEDA EN NUESTRAS RECETAS ---
    // Es instantánea: no necesita internet ni esperar a nadie.
    const resultadosLocales = categoriaBuscada
        ? recetasPorCategoria(categoriaBuscada)
        : buscarLocal(textoBuscado);

    // --- BÚSQUEDA EN INTERNET, AUTOMÁTICA ---
    //
    // Antes esto lo disparaba un botón. Ahora arranca solo, apenas se
    // entra a la pantalla, y corre EN PARALELO con la búsqueda local.
    // Por eso los resultados propios ya se ven mientras internet responde.
    //
    // Solo se busca en internet cuando el usuario escribió algo.
    // Si entró por una categoría (Desayuno, Cena...) no corresponde:
    // esas categorías son nuestras y la API no las conoce.
    useEffect(() => {
        setResultadosApi([]);
        setError('');

        // Si el usuario apagó la búsqueda en internet desde Configuración,
        // ni siquiera llamamos a la API.
        if (!textoBuscado || buscarInternet === false) return;

        // Si el usuario cambia de búsqueda antes de que llegue la respuesta,
        // esta marca evita que los resultados viejos pisen a los nuevos.
        let cancelado = false;

        setCargando(true);

        buscarEnInternet(textoBuscado)
            .then((encontradas) => {
                if (!cancelado) setResultadosApi(encontradas);
            })
            .catch((e) => {
                if (!cancelado) {
                    setError(e.message || 'No se pudo buscar en internet.');
                }
            })
            .then(() => {
                if (!cancelado) setCargando(false);
            });

        return () => {
            cancelado = true;
        };
    }, [textoBuscado, categoriaBuscada, buscarInternet]);

    // --- UNA SOLA LISTA ---
    // Primero las nuestras (instantáneas y en español) y después las de
    // internet. Para el usuario es un único listado de resultados.
    const todosLosResultados = resultadosLocales.concat(resultadosApi);

    const abrirReceta = (receta) => {
        navegarA('DetalleReceta', { receta: receta });
    };

    const renderTarjeta = (receta) => (
        <TouchableOpacity
            key={receta.id}
            style={styles.card}
            onPress={() => abrirReceta(receta)}
        >
            <View style={styles.cardTextos}>
                <Text style={styles.nombre}>{receta.nombre}</Text>

                {/* La categoría se muestra solo cuando el usuario está buscando.
                    Si ya entró a "Desayuno", repetirlo en cada tarjeta sobra. */}
                {!categoriaBuscada && receta.categoria ? (
                    <Text style={styles.dato}>{receta.categoria}</Text>
                ) : null}

                {receta.descripcion ? (
                    <Text style={styles.resumen} numberOfLines={2}>
                        {receta.descripcion}
                    </Text>
                ) : null}

                {/* Aviso discreto: las recetas de internet están en inglés.
                    Va en la tarjeta y no en un bloque aparte, para que la
                    lista se siga leyendo como una sola. */}
                {receta.origen === 'api' ? (
                    <Text style={styles.avisoIdioma}>Receta en inglés</Text>
                ) : null}
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

            {/* Contador: se actualiza solo cuando llegan las de internet */}
            {todosLosResultados.length > 0 ? (
                <Text style={styles.contador}>
                    {todosLosResultados.length}{' '}
                    {todosLosResultados.length === 1 ? 'receta' : 'recetas'}
                </Text>
            ) : null}

            {/* LISTA ÚNICA */}
            {todosLosResultados.map(renderTarjeta)}

            {/* Mientras esperamos a internet.
                Va al final de la lista para no tapar lo que ya se ve. */}
            {cargando ? (
                <View style={styles.cargando}>
                    <ActivityIndicator size="small" color="#9C4221" />
                    <Text style={styles.cargandoTexto}>Buscando más recetas...</Text>
                </View>
            ) : null}

            {/* Si internet falló: aviso discreto, no un cartel de error.
                Los resultados propios siguen estando, así que no es una falla
                total de la búsqueda. */}
            {error && !cargando ? (
                <Text style={styles.avisoError}>
                    No se pudieron traer resultados de internet. {error}
                </Text>
            ) : null}

            {/* Nada encontrado en ningún lado */}
            {todosLosResultados.length === 0 && !cargando ? (
                <View style={styles.sinResultados}>
                    <Text style={styles.tituloSinResultados}>Sin resultados</Text>
                    <Text style={styles.subtitulo}>
                        No encontramos recetas que coincidan con tu búsqueda.
                        Probá con otra palabra, por ejemplo "pollo" o "torta".
                    </Text>
                </View>
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
        marginBottom: 4
    },
    contador: {
        fontSize: 14,
        color: '#9C4221',
        fontWeight: '600',
        marginBottom: 15
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
    dato: {
        fontSize: 13,
        color: '#9C4221',
        fontWeight: '600',
        marginBottom: 5
    },
    resumen: {
        fontSize: 14,
        color: '#666',
        lineHeight: 19
    },
    avisoIdioma: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 6
    },
    flecha: {
        fontSize: 24,
        color: '#ccc',
        marginLeft: 5
    },
    cargando: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12
    },
    cargandoTexto: {
        marginLeft: 10,
        color: '#777',
        fontSize: 14
    },
    avisoError: {
        fontSize: 13,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 12
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
        textAlign: 'center',
        lineHeight: 21
    },
    botonVolver: {
        backgroundColor: '#9C4221',
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