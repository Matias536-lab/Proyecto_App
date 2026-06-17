import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Borrador() {
  return (
    <View style={styles.contenedorCentrado}>
      <Text>Borrador</Text>
      <Text>Hola</Text>
      <Text>Are you sure?</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedorCentrado: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
})
