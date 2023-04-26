import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders, processHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    // 解构赋值＋默认值
    const {
      data = null,
      method = 'get',
      url,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    const request = new XMLHttpRequest()
    // 第三个参数设置true，发起的是异步请求
    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }
    function addEvents(): void {
      request.onreadystatechange = function gotResponse() {
        if (request.readyState !== 4) return

        if (request.status === 0) {
          return
        }
        // 手动从request上拿到响应头
        const responseHeaders = request.getAllResponseHeaders()

        // const responseData = responseType !== "text" ? request.response : request.responseText
        const response: AxiosResponse = {
          data: request.response,
          status: request.status,
          statusText: request.statusText,
          headers: parseHeaders(responseHeaders),
          config,
          request
        }
        handleResponse(response)
      }
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORT', request))
      }
    }
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      // 在设置headers前面时
      if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(field => {
        // 如果没携带data，去掉headers里的content-type
        if (data === null && field.toLowerCase() === 'content-type') {
          delete headers[field]
        } else {
          request.setRequestHeader(field, headers[field])
        }
      })
    }
    function processCancel(): void {
      // 发送前插入取消逻辑，如果promise变了，会异步触发这里
      if (cancelToken) {
        cancelToken.promise
          .then((reason: any) => {
            request.abort()
            reject(reason)
          })
          .catch(
            /* istanbul ignore next */

            () => {
              // do nothing
            }
          )
      }
    }
    // 处理状态码不同,在state4处理
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
export default xhr
