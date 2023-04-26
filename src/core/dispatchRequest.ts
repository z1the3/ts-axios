import { transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import transform from './transform'
import xhr from './xhr'
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancelRequested(config)
  processConfig(config)
  return xhr(config).then(
    res => {
      return transformResponseData(res, config)
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response, config)
      }
      return Promise.reject(e)
    }
  )
}

// 发送前先对config做处理
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transformData(config)
  config.headers = flattenHeaders(config.headers, config.method!)
  if (!config.data) {
    delete config.headers['Content-type']
  }

  // 处理URL

  // 处理 Data, 使用transformRequest
  function transformData(config: AxiosRequestConfig): any {
    return transform(config.data, config.headers, config.transformRequest)
  }
}
export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  // 如果是相对地址，则拼接；如果是绝对地址，什么也不做
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

// 对 res 的处理
function transformResponseData(res: AxiosResponse, config: AxiosRequestConfig): AxiosResponse {
  // 注意headers要占位！！
  res.data = transform(res.data, undefined, config.transformResponse)
  return res
}

// 发送请求前，检测是否
function throwIfCancelRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
