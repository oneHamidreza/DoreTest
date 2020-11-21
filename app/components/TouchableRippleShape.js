import React from 'react'
import {View} from "react-native"
import {TouchableRipple} from "react-native-paper"
import Colors from "../shared/Colors"
import PropTypes from "prop-types"

class TouchableRippleShape extends React.Component {

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const {style, onPress, backgroundColor, borderRadius, borderWidth, borderColor, rippleColor} = this.props

    return <View style={[style, {
      overflow: 'hidden',
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
      borderWidth: borderWidth,
      borderColor: borderColor,
    }]}>
      <TouchableRipple style={{flex: 1}} rippleColor={rippleColor} onPress={onPress}>
        {this.props.children}
      </TouchableRipple>
    </View>
  }
}

TouchableRippleShape.propTypes = {
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  rippleColor: PropTypes.string,
}

TouchableRippleShape.defaultProps = {
  backgroundColor: Colors.TRANSPARENT,
  borderRadius: 8,
  borderWidth: 0,
  borderColor: Colors.SURFACE,
}

export default TouchableRippleShape