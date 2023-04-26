import { deepMerge, isPlainObject } from '../helpers/util'
import { AxiosRequestConfig } from '../types'

const strats = Object.create(null)
// 默认有2优先2否则1
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 优先2，没有2则走默认
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 符合优先2的key
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    // 不可合并的对象类型或基础或null
    return val2
  } else if (isPlainObject(val1)) {
    // val2基础类型，val1为对象类型
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    // 不可合并的对象类型或基础或null
    return val1
  }
}

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)
  for (let key in config2) {
    mergeField(key)
  }
  for (let key in config1) {
    // 对于1中有，2没有的字段，添加上1中有的
    if (!config[key]) {
      mergeField(key)
    }
  }
  function mergeField(key: string): void {
    // hashMap,对不同key设置不同的策略，如果没有则采用默认策略
    const strat = strats[key] || defaultStrat
    // 这里 在类型 "AxiosRequestConfig" 上找不到具有类型为 "string" 的参数的索引签名
    // 需要给config的类型加上自定义string签名
    // config2我们通过if已经让它必然是对象，所以可以断言
    config[key] = strat(config1[key], config2![key])
  }
  return config
}
