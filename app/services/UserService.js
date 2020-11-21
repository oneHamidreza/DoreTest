import BaseService from './BaseService'

const apiUrl = 'https://jsonplaceholder.typicode.com'

class USerService extends BaseService {

  async getIndex() {
    const method = 'GET'
    const url = `${apiUrl}/users`
    return this.callApi(method, url, null)
  }
}

export default USerService