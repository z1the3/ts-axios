import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './default'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)

  // 把Axios类隐藏，直接返回其main方法
  // 可以通过 实例({参数}) 直接使用
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  // 这里不标注instance而是static,因为类升级了，增加静态属性
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

// 增加静态create方法
axios.create = function create(config: AxiosRequestConfig | undefined) {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios
export default axios
