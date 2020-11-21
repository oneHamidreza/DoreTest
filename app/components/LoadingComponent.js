import React from "react"
import {StyleSheet, View} from "react-native"
import {ActivityIndicator} from "react-native-paper"
import Colors from "../shared/Colors"

export default function LoadingComponent({style, isAbsolute, isFooter, size, noMargin}) {
  return (
    <View
      style={[{...style}, isAbsolute ? styles.containerAbsolute : styles.container, noMargin ? {margin: 0} : null, !isFooter ? {flex: 1} : null]}>
      <ActivityIndicator size={size || 48} color={Colors.primary()}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerAbsolute: {
    position:'absolute',
    margin:16,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
  }
})
