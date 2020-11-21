import Errors from '../shared/Errors';

class BaseService {
  async callApi(
    method,
    url,
    data,
    errorMessages,
    customOptions,
    customHeaders,
  ) {
    const defaultOptions = {
      isEnabledAutoAuthenticator: true,
      addAuthorizationToHeader: true,
      authenticateTryCount: 0,
      authenticateTryMax: 2,
    };
    const options = {
      ...defaultOptions,
      ...customOptions,
    };
    const headers = [
      // {key: 'Accept', value: 'application/json', condition: null},
    ];
    //additional headers
    if (customHeaders !== null && customHeaders !== undefined) {
      headers.push(...customHeaders);
    }

    function getErrorMessageByStatusCode(statusCode, defaultMessage) {
      if (!errorMessages) {
        return defaultMessage;
      }

      if (statusCode in errorMessages) {
        return errorMessages[statusCode];
      } else {
        return defaultMessage;
      }
    }

    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      //set request headers
      headers.forEach(el => {
        if (el.condition === null || el.condition === undefined) {
          xhr.setRequestHeader(el.key, el.value);
        } else {
          if (el.condition) {
            xhr.setRequestHeader(el.key, el.value);
          }
        }
      });
      xhr.timeout = 30000;

      xhr.onload = async function () {
        const response = JSON.parse(this.responseText);
        try {
          console.log(
            `API Callback Success -> [${method}] (${url}) \n Headers: ${JSON.stringify(
              xhr._headers,
            )} \n\n Body: ${JSON.stringify(data)} \n\n Response: ${
              this.responseText
            } <== (${this.status})`
          );
          if (this.status >= 200 && this.status < 300) {
            resolve({
              status: true,
              statusCode: this.status,
              response: response,
              message: response.message,
            });
          } else if (this.status === 422) {
            //Data Validation Failed.
            resolve({
              status: false,
              statusCode: this.status,
              message: getErrorMessageByStatusCode(
                this.status,
                Errors.HTTP_422.message,
              ),
              response: response,
              error: Errors.HTTP_422,
            });
          } else if (this.status === 401) {
            // UnAuthorized && !SharedConfig.token
            console.log(
              `Auto Authenticate : ${
                options.isEnabledAutoAuthenticator
              } , tryCount : ${options.authenticateTryCount}`
            );
            if (!options.isEnabledAutoAuthenticator) {
              resolve({
                status: false,
                statusCode: this.status,
                message: getErrorMessageByStatusCode(
                  this.status,
                  Errors.HTTP_401.message,
                ),
                response: response,
                error: Errors.HTTP_401,
              });
            } else {
              // if (options.authenticateTryCount > options.authenticateTryMax) {
              //   // await BaseService.signOutAuto();
              // } else if (SharedConfig.auth.refreshToken) {
              //   options.authenticateTryCount++;
              //   // await new AuthService()
              //   //   .refreshAccessToken(options)
              //   //   .then(async res => {
              //   //     if (res.status) {
              //   //       options.isEnabledAutoAuthenticator = false;
              //   //       await AuthService.saveAuthFromResponse(res.response).then(
              //   //         async () => {
              //   //           await that
              //   //             .callApi(method, url, data, errorMessages, options)
              //   //             .then(
              //   //               x => {
              //   //                 resolve(x);
              //   //               },
              //   //               x => {
              //   //                 reject(x);
              //   //               },
              //   //             );
              //   //         },
              //   //       );
              //   //     }
              //   //   });
              // } else {
              //   // await BaseService.signOutAuto();
              // }
            }
          } else {
            let error = {...Errors.HTTP_WITH_CODE};
            error.message = error.message.format(`${this.status}`);
            reject({
              status: false,
              statusCode: this.status,
              statusText: xhr.statusText,
              message: getErrorMessageByStatusCode(
                this.statusCode,
                error.message,
              ),
              response: response,
              error: error,
            });
          }
        } catch (e) {
          console.log(
            `API Callback Error -> [${method}] (${url}) \n Headers: ${JSON.stringify(
              xhr._headers,
            )} \n\n Body: ${JSON.stringify(data)} \n\n ${e}`
          );

          reject({
            status: false,
            message: 'خطای غیر منتظره رخ داده است!',
          })
        }
      };
      xhr.onerror = function () {
        console.log(this);
        reject({
          status: false,
          message: 'خطای غیر منتظره رخ داده است!',
        });
      };
      xhr.send(data);
    });
  }

  static async signOutAuto() {
    // await new AuthService().signOut().then(() => {
    //   Toast.show(Errors.SIGN_OUT_AUTO.message);
    // });
  }
}

export default BaseService;
