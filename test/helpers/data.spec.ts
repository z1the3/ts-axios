import { transformData_, transformResponse } from '../../src/helpers/data'

describe('helpers:data', () => {
  describe('transformData', () => {
    test('should transfrom request data to string if data is a PlainOject', () => {
      const a = { a: 1 }
      expect(transformData_(a)).toBe('{"a":1}')
    })

    test('should do nothing if data is not a PlainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformData_(a)).toBe(a)
    })
  })

  describe('transfromResponse', () => {
    test('should transfrom response data to Object if data is a JSON string', () => {
      const a = '{"a": 2}'
      expect(transformResponse(a)).toEqual({ a: 2 })
    })
    test('should do nothing if data is a string but not a JSON string', () => {
      const a = '{a: 2}'
      expect(transformResponse(a)).toBe('{a: 2}')
    })
    test('should do noting if data is not a string', () => {
      const a = { a: 2 }
      expect(transformResponse(a)).toBe(a)
    })
  })
})
