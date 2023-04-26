// 工具函数
import { isDate, isObject, isURLSearchParam } from './util'

interface URLOrigin {
  protocol: string
  host: string
}
// 重写encodeURIComponent,把部分encode值换回原值
function encode(val: string) {
  return (
    encodeURIComponent(val)
      .replace(/%40/g, '@')
      // ig,因为可能/%3a/
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      // 把空格换成加号
      .replace(/%20/g, '+')
      .replace(/%5b/gi, '[')
      .replace(/%5d/gi, ']')
  )
}
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) return url
  // 类型别名
  const parts: string[] = []
  let serializedParams = ''
  // 执行自定义规则
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParam(params)) {
    serializedParams = params.toString()
  } else {
    //  否则执行默认规则

    Object.keys(params).map(key => {
      const val = params[key]
      if (val === null || val == 'undefined') return
      let values
      let shouldAddBracket = false
      if (Array.isArray(val)) {
        values = val.slice()
        shouldAddBracket = true
      } else {
        values = [val]
      }
      values.forEach((val: any) => {
        if (isDate(val)) {
          val = val.toISOString().split('')
        } else if (isObject(val)) {
          val = JSON.stringify(val).split('')
        } else {
          // val为基础类型
          val = [val]
        }
        key = encode(key)
        if (shouldAddBracket) {
          key += '[]'
          shouldAddBracket = false
        }
        const encodeVal = []
        for (let v of val) {
          encodeVal.push(encode(v))
        }
        parts.push(`${key}=${encodeVal.join('')}`)
      })
    })
    let mergeParts
    if (parts.length > 1) {
      mergeParts = parts.join('&')
    } else if ((parts.length = 1)) {
      mergeParts = parts[0]
    }
    if (mergeParts) {
      serializedParams = mergeParts
    }
  }
  const markedIndex = url.indexOf('#')
  if (markedIndex > -1) {
    url = url.slice(0, markedIndex)
  }
  if (serializedParams !== '') {
    url += url.indexOf('?') > -1 ? '&' : '?'
    url += serializedParams
  }
  return url as string
}

// 保证是合法url
export function isAbsoluteURL(url: string): boolean {
  return /^(([a-z][a-z\d\+\-\.]*:)*\/\/)/i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string) {
  // 把可能存在的最后一个或多个杠去掉
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

// 判断url
export function isURLSameOrigin(url?: string): boolean {
  if (!url) return false
  const parsedOrigin = resolveURL(url)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')

const currentOrigin = resolveURL(window.location.href)

// 在element上传入href，会自动转化为protocol和host两个部分
// 可以用来解析href

// 而currentOrigin传入window.location.href再解析

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
