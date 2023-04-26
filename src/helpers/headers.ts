import { Method } from '../types'
import { deepMerge, isPlainObject } from './util'

// 处理不合规范的header字段
function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(field => {
    if (field !== normalizeName && field.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[field]
      delete headers[field]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    // 默认转化为json
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) return parsed
  let fields = headers.split('\r\n')
  if (fields.length === 2 && fields[1] === '') {
    let tokens = fields[0].split(':')
    let key = tokens[0].trim().toLowerCase()
    let val = tokens[1].trim()
    parsed[key] = val
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let tokens = line.split(':')
    let key = tokens[0]
    let val = tokens[1]
    if (tokens.length > 1) {
      let [key, ...vals] = line.split(':')
      val = vals.join(':')
    }
    key = key.trim().toLowerCase()
    if (!key) return
    if (val) {
      val = val.trim()
      parsed[key] = val
    } else {
      parsed[key] = ''
    }
  })
  return parsed
}

// 拍平header
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return headers
  // 最后合并到header上
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'post', 'options', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}
