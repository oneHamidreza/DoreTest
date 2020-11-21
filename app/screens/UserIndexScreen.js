import React from 'react'
import {Animated, Dimensions, Image, StyleSheet, View} from 'react-native'
import {Card, Paragraph, Title} from "react-native-paper"
import Errors from "../shared/Errors"
import IndexComponent from "../components/IndexComponent"
import Colors from "../shared/Colors"
import UserService from "../services/UserService"

export const MARGIN = 16
export const CARD_HEIGHT = 96 + MARGIN * 2
const {height: wHeight} = Dimensions.get("window")
const height = wHeight - 64

class UserIndexScreen extends React.Component {

  constructor(props) {
    super(props)
    this.props = props
    this.state = {}
  }

  render() {
    const {navigation} = this.props

    const avatars = [
      'https://gravatar.com/avatar/7462f2bae9324ee53865e09f9286e94e?s=400&d=robohash&r=x',
      'https://gravatar.com/avatar/f22cd63b3f09df3d2362b2d77b7c23ed?s=400&d=robohash&r=x',
      'https://gravatar.com/avatar/c2e8caf28413455e9fdc27e2e0b03c64?s=400&d=robohash&r=x',
      'https://gravatar.com/avatar/097462e9de56f20254ec7ef953f04973?s=400&d=robohash&r=x',
      'https://gravatar.com/avatar/501967f38d8b79277120273ebe48cfda?s=400&d=robohash&r=x',
      'https://gravatar.com/avatar/26fb452160bb83a3e994804ea3a5c64e?s=400&d=robohash&r=x',
      'https://gravatar.com/avatar/1539959f17a5843f0e511691b5dbc4e4?s=400&d=robohash&r=x',
      'https://gravatar.com/avatar/000a4f209bcc2b82e3685408205d7aa3?s=400&d=robohash&r=x',
    ]
    const y = new Animated.Value(0)
    const onScroll = Animated.event([{nativeEvent: {contentOffset: {y}}}], {
      useNativeDriver: true,
    })

    return (
      <View style={styles.container}>
        <IndexComponent
          isPagination={false}
          onScroll={onScroll}
          getApiPromise={_ => new UserService().getIndex()}
          emptyError={Errors.EMPTY_USER}
          onAfterDataLoad={(_, items) => {
            items.forEach(item => item.avatar = avatars[Math.floor(Math.random() * avatars.length)])
            return items
          }}
          renderItem={({item, index}) =>
            <Item index={index}
                  y={y}
                  imageUrl={item.avatar}
                  name={item.name}
                  username={item.username}
                  email={item.email}
            />}/>
      </View>
    )
  }

}

function Item({index, y, imageUrl, name, username, email}) {
  const position = Animated.subtract(index * CARD_HEIGHT, y)
  const isDisappearing = -CARD_HEIGHT
  const isTop = 0
  const isBottom = height - CARD_HEIGHT
  const isAppearing = height

  const translateY = Animated.add(
    Animated.add(
      y,
      y.interpolate({
        inputRange: [0, 0.00001 + index * CARD_HEIGHT],
        outputRange: [0, -index * CARD_HEIGHT],
        extrapolateRight: "clamp",
      })
    ),
    position.interpolate({
      inputRange: [isBottom, isAppearing],
      outputRange: [0, -CARD_HEIGHT / 4],
      extrapolate: "clamp",
    })
  )
  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
  })
  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.animatedContainer, {opacity, transform: [{translateY}, {scale}]}]}
      key={index}>
      <Card style={styles.itemCard} elevation={2}>
        <Card.Content style={styles.itemContainer}>
          <View style={styles.itemPrimaryContainer}>
            {imageUrl && <Image style={styles.itemImage} source={{uri: imageUrl}}/>}
            <View style={styles.itemAliasContainer}>
              {name && <Title>{name}</Title>}
              {username && <Paragraph>{username}</Paragraph>}
              {email && <Paragraph>{email}</Paragraph>}
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  )
}

export default UserIndexScreen

const styles = StyleSheet.create({
  container: {},
  animatedContainer: {
    flex: 1,
    height: CARD_HEIGHT,
  },
  itemCard: {
    marginVertical: MARGIN,
    borderRadius: 4,
    margin:MARGIN
  },
  itemTouchableRippleShape: {},
  itemContainer: {
    padding: 4,
  },
  itemImage: {
    width: 56,
    height: 56,
    marginEnd: 16,
    alignSelf: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.DIVIDER
  },
  itemPrimaryContainer: {
    marginStart: 8,
    marginEnd: 8,
    flexDirection: 'row'
  },
  itemAliasContainer: {},

})
