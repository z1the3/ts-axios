const toStr = Object.prototype.toString

// 类型保护，该函数的返回结果为true后，val会被ts认定为Date
export function isDate(val: any): val is Date {
  return toStr.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

// 判断是不是对象字面量形式的object
export function isPlainObject(val: any): val is Object {
  return toStr.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 深拷贝并合并
// 传入参数化为数组
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        // 如果要合并的是对象
        if (isPlainObject(val)) {
          // 被合并也是对象，递归进入下一层
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            // 被合并的是基础类型，进入下一层时被忽略
            result[key] = deepMerge(val)
          }
        } else {
          // 后面是基础类型直接覆盖
          result[key] = val
        }
      })
    }
  })

  return result
}

// 判断post..请求携带的data是不是formData类型
export function isFormData(val: any): val is Object {
  return typeof val !== 'undefined' && val instanceof FormData
}

// 判断是不是url参数类型
export function isURLSearchParam(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
