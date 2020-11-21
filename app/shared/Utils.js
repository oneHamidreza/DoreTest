import NetInfo from "@react-native-community/netinfo"
import Toast from "./Toast"
import Errors from "./Errors"
import {Platform} from "react-native"

export async function isConnected() {
  try {
    if (Platform.OS === 'web')
      return true

    const response = await NetInfo.fetch()
    return response.isConnected && response.isInternetReachable
  } catch {
    return false
  }
}

export async function showErrorIfNotConnected() {
  const hasNetwork = isConnected()
  if (!hasNetwork)
    Toast.show(Errors.NETWORK.message)
  return hasNetwork
}

export function fetchMessageFromRes(res) {
  if (res == null)
    return
  const unknownError = Errors.UNKNOWN.message

  if (res.message)
    return res.message

  let apiMessage
  try {
    apiMessage = res.response.message === '' || res.response.message === undefined ? unknownError : res.response.message
  } catch {
    apiMessage = unknownError
  }
  console.log('apiMessage : ' + apiMessage)

  return apiMessage === '' ? res.message : apiMessage
}

export function warnFromResponse(res) {
  if (!res)
    return Errors.UNKNOWN.message

  let message
  if (res.response && res.response.message && res.response.message !== 'empty')
    message = res.response.message
  else
    message = res.message || Errors.UNKNOWN.message
  Toast.show(message)
  return message
}

export function isOkStatus(response) {
  if (!response)
    return false
  return response.status === 1 || response.status === '1' || response.status === true;

}

