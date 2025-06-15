import { describe, it, expect } from 'vitest'
import { clsnx } from '../src/index'

describe('clsnx', () => {
  describe('string inputs', () => {
    it('should handle single string', () => {
      expect(clsnx('foo')).toBe('foo')
    })

    it('should handle multiple strings', () => {
      expect(clsnx('foo', 'bar')).toBe('foo bar')
    })

    it('should handle space-separated classes in single string', () => {
      expect(clsnx('foo bar')).toBe('foo bar')
    })

    it('should handle empty strings', () => {
      expect(clsnx('', 'foo', '')).toBe('foo')
    })

    it('should handle strings with multiple spaces', () => {
      expect(clsnx('foo  bar   baz')).toBe('foo bar baz')
    })
  })

  describe('boolean inputs', () => {
    it('should ignore falsy values', () => {
      expect(clsnx(false, null, undefined, 0, '')).toBe('')
    })

    it('should handle truthy non-string values', () => {
      expect(clsnx(1, 'foo')).toBe('foo')
    })
  })

  describe('object inputs', () => {
    it('should handle object with boolean values', () => {
      expect(clsnx({ foo: true, bar: false })).toBe('foo')
    })

    it('should handle object with mixed boolean values', () => {
      expect(clsnx({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('should handle object with string values', () => {
      expect(clsnx({ foo: 'active', bar: false })).toBe('active')
    })

    it('should handle empty object', () => {
      expect(clsnx({})).toBe('')
    })

    it('should handle object with falsy values', () => {
      expect(clsnx({ foo: null, bar: undefined, baz: 0 })).toBe('')
    })
  })

  describe('array inputs', () => {
    it('should handle array of strings', () => {
      expect(clsnx(['foo', 'bar'])).toBe('foo bar')
    })

    it('should handle nested arrays', () => {
      expect(clsnx(['foo', ['bar', 'baz']])).toBe('foo bar baz')
    })

    it('should handle array with mixed types', () => {
      expect(clsnx(['foo', { bar: true, baz: false }])).toBe('foo bar')
    })

    it('should handle empty array', () => {
      expect(clsnx([])).toBe('')
    })

    it('should handle deeply nested arrays', () => {
      expect(clsnx(['foo', ['bar', ['baz', 'qux']]])).toBe('foo bar baz qux')
    })
  })

  describe('mixed inputs', () => {
    it('should handle combination of all input types', () => {
      expect(clsnx(
        'foo',
        { bar: true, baz: false },
        ['qux', 'quux'],
        null,
        undefined,
        'corge'
      )).toBe('foo bar qux quux corge')
    })

    it('should handle complex nested structure', () => {
      expect(clsnx(
        'base',
        {
          active: true,
          disabled: false,
          loading: null
        },
        [
          'extra',
          {
            highlight: true,
            hidden: false
          }
        ]
      )).toBe('base active extra highlight')
    })
  })

  describe('deduplication', () => {
    it('should remove duplicate classes', () => {
      expect(clsnx('foo', 'bar', 'foo')).toBe('foo bar')
    })

    it('should deduplicate across different input types', () => {
      expect(clsnx('foo', { foo: true }, ['foo', 'bar'])).toBe('foo bar')
    })

    it('should handle complex deduplication', () => {
      expect(clsnx(
        'foo bar',
        { foo: true, bar: true },
        ['foo', 'baz']
      )).toBe('foo bar baz')
    })
  })

  describe('edge cases', () => {
    it('should handle no arguments', () => {
      expect(clsnx()).toBe('')
    })

    it('should handle only falsy values', () => {
      expect(clsnx(false, null, undefined, 0, '')).toBe('')
    })

    it('should handle object with recursive structure', () => {
      const obj = { foo: true }
      expect(clsnx(obj, { bar: obj })).toBe('foo')
    })

    it('should handle numbers as truthy values', () => {
      expect(clsnx(1, 2, 'foo')).toBe('foo')
    })
  })
})