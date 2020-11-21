import React from "react"
import {Animated,FlatList, StyleSheet, View} from "react-native"
import StateComponent from "./StateComponent"
import LoadingComponent from "./LoadingComponent"
import Toast from "../shared/Toast"
import Errors from "../shared/Errors"
import {isConnected} from "../shared/Utils"
import PropTypes from "prop-types"

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class IndexComponent extends React.Component {

  constructor(props) {
    super(props)
    this.props = props
    this.state = {
      page: 0,
      isLoading: false,
      error: {},
      isSuccess: false,
      reachToEnd: false,
      data: [],
    }
  }

  componentDidMount() {
    if (this.props.callApiWhenMounted)
      this.callApiIndex()
  }

  setLoading(isLoading) {
    this.props.onLoadingApi(isLoading)
    this.setState({
      isLoading: isLoading
    })
  }

  nextPage() {
    if (this.state.reachToEnd)
      return

    let page = this.state.page + 1
    this.setState({page: page})
    this.props.onNextPage(page)
    this.callApiIndex()
  }

  setError(status, error = {}, res = {}) {
    if (status && this.state.page !== 0) {
      Toast.show(error.message)
      return
    }
    error.status = status
    this.setState({
      error: error
    })
    this.props.onErrorApi(this.state.page, res, error)
  }

  firstPage() {
    this.setState({page: 0}, () => {
      this.callApiIndex()
    })
  }

  clear() {
    this.setState({page: 0, data: []})
  }

  refresh() {
    this.firstPage()
  }

  async callApiIndex() {
    this.setError(false)

    if (!await isConnected()) {
      this.setError(true, Errors.NETWORK)
      return
    }
    if (this.props.getApiPromise === undefined || this.props.getApiPromise === null)
      return

    this.setLoading(true)
    await this.props.getApiPromise(this.state.page).then(res => {
      this.setLoading(false)
      if (this.props.hasCustomCallback) {
        this.props.apiCallbackResolve(this.state.page, res)
        return res
      }

      if (res.status) {

        if (this.state.page === 0) {
          this.state.data = []
        }

        let data = this.props.onBeforeDataLoad(this.state.page, this.state.data)

        let arrayFromApi = this.props.customDataHandler(this.state.page, res)
        if (!arrayFromApi && typeof arrayFromApi !== Array)
          arrayFromApi = []

        let newData = data.concat(arrayFromApi)
        newData = this.props.onAfterDataLoad(this.state.page, newData)

        this.setState({isSuccess: true})

        if (this.state.page === 0 && newData.length === 0) {
          this.setError(true, this.props.emptyError || Errors.EMPTY_DEFAULT, res)
          return res
        }
        this.setState({data: newData})
        this.props.onSuccessApi(this.state.page, data, res)

        if (arrayFromApi.length === 0)
          this.setState({reachToEnd: true})
        else if (this.state.page === 0 && this.props.isPagination) {
          if (!this.state.isLoading && this.props.isPagination) {
            this.nextPage()
          }
        }
      } else {
        this.setError(true, res.error, res)
      }

      this.props.apiCallbackResolve(this.state.page, res)
      return res
    }, res => {
      this.setLoading(false)
      this.setError(true, res.error, res)
      this.props.apiCallbackReject(this.state.page, res)
      return res
    }).catch(err => {
      console.log(err)
      this.setLoading(false)
      this.setError(true, Errors.UNKNOWN)
      this.props.onCatch(this.state.page, err)
    })
  }

  render() {
    return (<View style={styles.root}>
      {this.state.error.status ?
        <StateComponent error={this.state.error} onPressTry={() => this.callApiIndex()}/> : null}
      {!this.state.error.status && this.state.isLoading && (!this.props.isPagination || this.state.page === 0) && !this.state.isSuccess && this.props.isEnabledLoading ?
        <View style={styles.loadingContainer}><LoadingComponent/></View> : null}
      {!this.state.error.status ?
        <AnimatedFlatList
          scrollEventThrottle={16}
          bounces={false}
          {...this.props}
          data={this.state.data}
          refreshing={this.state.isLoading && this.state.page === 0}
          onRefresh={this.props.hasSwipeRefresh ? () => this.refresh() : null}
          keyExtractor={(_, index) => (index + '')}
          onEndReachedThreshold={0.5}
          ListFooterComponent={!this.state.reachToEnd && this.props.isPagination ? <LoadingComponent isFooter/> : null}
          extraData={this.state}
          onEndReached={({_}) => {
            if (!this.state.isLoading && this.props.isPagination) {
              this.nextPage()
            }
          }}/> : null}

    </View>)
  }

}

export default IndexComponent

IndexComponent.propTypes = {
  getApiPromise: PropTypes.func.isRequired,
  isPagination: PropTypes.bool,
  isEnabledLoading: PropTypes.bool,
  hasSwipeRefresh: PropTypes.bool,
  callApiWhenMounted: PropTypes.bool,
  emptyError: PropTypes.object,
  hasCustomCallback: PropTypes.bool,
  customDataHandler: PropTypes.func,
  onBeforeDataLoad: PropTypes.func,
  onAfterDataLoad: PropTypes.func,
  apiCallbackResolve: PropTypes.func,
  apiCallbackReject: PropTypes.func,
  onLoadingApi: PropTypes.func,
  onSuccessApi: PropTypes.func,
  onErrorApi: PropTypes.func,
  onNextPage: PropTypes.func,
  onCatch: PropTypes.func,
}

IndexComponent.defaultProps = {
  isPagination: false,
  isEnabledLoading: true,
  hasSwipeRefresh: true,
  callApiWhenMounted: true,
  emptyError: Errors.EMPTY_DEFAULT,
  hasCustomCallback: false,
  customDataHandler: (page, res) => res.response,
  onBeforeDataLoad: (page, data) => data,
  onAfterDataLoad: (page, data) => data,
  apiCallbackResolve: (page, res) => {
  },
  apiCallbackReject: (page, res) => {
  },
  onLoadingApi: (page, isLoading) => {
  },
  onSuccessApi: (page, data, res) => {
  },
  onErrorApi: (page, res, error) => {
  },
  onNextPage: (page) => {
  },
  onCatch: (page, error) => {
  },
}

const styles = StyleSheet.create({
  root: {},
  loadingContainer: {
    alignSelf: 'center'
  },
})
