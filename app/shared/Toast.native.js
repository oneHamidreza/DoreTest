import SimpleToast from 'react-native-simple-toast'

export default class Toast {

  static show(message, duration, viewControllerBlacklist) {
    SimpleToast.show(message,duration,viewControllerBlacklist)
  }

}
