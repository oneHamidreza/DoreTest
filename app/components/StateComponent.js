import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Avatar, Button, Subheading} from "react-native-paper"

class StateComponent extends React.Component {

  constructor(props) {
    super(props);
    this.props = props
  }

  render() {
    const {error} = this.props

    return (
      <View style={styles.container}>
        <Avatar.Icon style={styles.icon} size={108} icon={error.icon} elevation={8}
                     color='#0000002F'/>
        <Subheading style={styles.message}>
          {error.message}
        </Subheading>
        {error.canTry ?
          <Button
            style={styles.try}
            onPress={() => this.props.onPressTry()}>تلاش مجدد</Button> : null}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    marginStart: 16,
    marginEnd: 16,
    textAlign: 'center'
  },
  icon: {
    backgroundColor: '#ffffff',
    marginBottom: 24
  },
  try: {
    marginTop: 24
  },
  title: {},
})

export default StateComponent