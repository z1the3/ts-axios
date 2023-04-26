import { AxiosTransformer } from '../types/'

export default function AxiosTransformer(
  data: any,
  headers?: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!Array.isArray(fns)) {
    fns = [fns!]
  }
  fns?.forEach(fn => {
    // data被抽离出来，所以随着forEach可以更新
    data = fn(data, headers)
  })
  return data
}
