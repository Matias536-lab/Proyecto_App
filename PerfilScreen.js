import { StyleSheet, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.opcion}>
            <Text style={styles.textoEdit}>[Editar perfil]</Text>
          </TouchableOpacity>
      <View style={styles.icono}>
        <ImageBackground
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 100 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Nombre de cuenta</Text>
        <Text style={styles.any}>Descripcion</Text>

        <View style={styles.datos}>
          <TouchableOpacity style={styles.dato}>
            <Text style={styles.numero}>8</Text>
            <Text style={styles.textoDatos}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dato}>
            <Text style={styles.numero}>7</Text>
            <Text style={styles.textoDatos}>Recetas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linea}/>
        <View style={styles.categorias}>
          <Text style={styles.tituloRecetas}>Recetas creadas</Text>
          < TouchableOpacity  style={styles.categoria}>
          < ImageBackground
          source={{ uri: '' }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}>
          < View  style={styles.filtroOscuro}>
          < Text  style={styles.textoCategoria}>Desayunos</ Text >
          <Text style={styles.cantidad}>2</Text>
          </ View >
          </ ImageBackground >
          </ TouchableOpacity >

          
          < TouchableOpacity  style={styles.categoria}>
          < ImageBackground source={{ uri: '' }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}>
          < View  style={styles.filtroOscuro}>
          < Text  style={styles.textoCategoria}>Almuerzos</ Text >
          <Text style={styles.cantidad}>4</Text>
          </ View >
          </ ImageBackground >
          </ TouchableOpacity >


          < TouchableOpacity  style={styles.categoria}>
          < ImageBackground source={{ uri: '' }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}>
          < View  style={styles.filtroOscuro}>
          < Text  style={styles.textoCategoria}>Meriendas</ Text >
          <Text style={styles.cantidad}>0</Text>
          </ View >
          </ ImageBackground >
          </ TouchableOpacity >
          

          < TouchableOpacity  style={styles.categoria}>
          < ImageBackground source={{ uri: '' }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}>
          < View  style={styles.filtroOscuro}>
          < Text  style={styles.textoCategoria}>Cenas</ Text >
          <Text style={styles.cantidad}>1</Text>
          </ View >
          </ ImageBackground >
          </ TouchableOpacity >
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0566b6cb",
  },
  card: {
    backgroundColor: "#fff",
    height: "80%",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
  },
  icono: {
    backgroundColor: "#fff",
    borderRadius: 100,
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    alignSelf: 'center',
  },
  categoria: {
    height: 100,
    width: 300,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  textoCategoria: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",

  },
  filtroOscuro: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  opcion: {
    marginLeft: 30,
  },
  tituloRecetas:{
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333bd",
    marginBottom: 10,
    alignSelf: 'center',
  },
  any: {
    fontSize: 16,
    color: "#666",
  },
  datos: {
    backgroundColor: "#fff",
    width: 370,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  dato: {
    alignItems: "center",
    justifyContent: "center",
  },
  numero: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  cantidad:{
    fontsize:22,
    color: "#fff",
  },
  textoDatos: {
    fontSize: 16,
    color: "#333",
    marginTop: 2,
  },
  textoEdit: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 285,
  },
  linea: {
    height: 1,
    width: 420,
    backgroundColor: "#2218184d",
    marginBottom: 20
  },
});