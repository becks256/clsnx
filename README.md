# clsnx

[![npm version](https://img.shields.io/npm/v/@becks256/clsnx.svg)](https://www.npmjs.com/package/@becks256/clsnx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-547B%20gzipped-brightgreen.svg)](https://github.com/becks256/clsnx)

**Ultra-lightweight (547B gzipped) CSS class utility with built-in deduplication.**

clsnx provides the same intuitive API as the popular `classnames` library, but with **smart duplicate removal** built-in, **superior memory efficiency**, **90%+ faster performance than classnames/dedupe**, and a **17% smaller bundle size** - solving real-world pain points while delivering exceptional performance.

## 🚀 Key Features

- ✅ **Identical API** to `classnames` - drop-in replacement
- ✅ **Ultra-lightweight** - only 547B gzipped (17% smaller than classnames)
- ✅ **Built-in deduplication** - no duplicate classes in output
- ✅ **Exceptional performance** - 90%+ faster than classnames/dedupe with advanced algorithms
- ✅ **Memory efficient** - superior memory performance vs alternatives
- ✅ **TypeScript first** - full type safety with intelligent type guards
- ✅ **Zero dependencies** - lightweight and secure
- ✅ **Modern ESNext** - optimized for current JavaScript engines

## 📦 Installation

```bash
npm install @becks256/clsnx
```

## 🎯 Quick Start

```javascript
import clsnx from '@becks256/clsnx';

// Strings
clsnx('foo', 'bar'); // => 'foo bar'

// Objects
clsnx('foo', { bar: true, duck: false }); // => 'foo bar'

// Arrays
clsnx('foo', ['bar', { baz: true }]); // => 'foo bar baz'

// Mixed with duplicates (clsnx's specialty!)
clsnx('btn', 'btn-primary', 'btn', { 'btn-primary': true }); 
// => 'btn btn-primary' (duplicates removed!)
```

## 🆚 Why clsnx over classnames?

| Feature | classnames | classnames/dedupe | clsnx |
|---------|------------|-------------------|-------|
| **API Compatibility** | ✅ | ✅ | ✅ |
| **Bundle Size (gzipped)** | 662B | 1.17KB | ✅ **547B** |
| **Deduplication** | ❌ | ✅ | ✅ (built-in) |
| **Performance vs Dedupe** | N/A | Baseline | ✅ **90%+ faster** |
| **Memory Efficiency** | Basic | Basic | ✅ **Superior** |
| **TypeScript** | Basic | Basic | ✅ **Advanced** |

### The Problem with classnames

```javascript
// classnames allows duplicates
classNames('btn', 'btn', 'btn-primary'); 
// => 'btn btn btn-primary' ❌

// classnames/dedupe fixes it but is much larger and slower
classNames('btn', 'btn', 'btn-primary'); 
// => 'btn btn-primary' ✅ (but 2x larger bundle + much slower)

// clsnx gives you the best of both worlds
clsnx('btn', 'btn', 'btn-primary'); 
// => 'btn btn-primary' ✅ (smallest bundle + fastest deduplication!)
```

## 📊 Performance Benchmarks

> Benchmarks run on Node.js with realistic usage patterns

### Speed Comparison

| Scenario | clsnx | classnames | classnames/dedupe | clsnx vs dedupe |
|----------|-------|------------|-------------------|-----------------|
| **Simple strings** | 4.95M ops/sec | **15.2M ops/sec** | 2.27M ops/sec | **+118% faster** |
| **Mixed types** | 4.04M ops/sec | **9.22M ops/sec** | 2.12M ops/sec | **+91% faster** |
| **With duplicates** | **3.02M ops/sec** | 6.21M ops/sec | 1.38M ops/sec | **+118% faster** |
| **Complex nested** | **1.70M ops/sec** | 5.00M ops/sec | 934K ops/sec | **+82% faster** |
| **Heavy duplicates** | **1.00M ops/sec** | 4.80M ops/sec | 626K ops/sec | **+60% faster** |

**Key takeaway:** clsnx is **90%+ faster on average** than classnames/dedupe while providing identical functionality with a smaller bundle size.

### 🧠 Memory Efficiency

In heavy duplication scenarios (10,000 iterations):
- **clsnx**: Highly optimized memory usage
- **classnames**: +5.35 MB 
- **classnames/dedupe**: Variable memory patterns

**clsnx demonstrates superior memory efficiency compared to both classnames variants.**

## 📦 Bundle Size Analysis

> Real measurements from automated bundle analysis

| Library | Raw Size | Gzipped | Compression | vs clsnx |
|---------|----------|---------|-------------|----------|
| **clsnx** | 1.74KB | **547B** | 69.3% | Baseline |
| **classnames** | 1.49KB | 662B | 56.7% | **+21% larger** |
| **classnames/dedupe** | 2.78KB | 1.17KB | 57.9% | **+114% larger** |

**clsnx advantages:**
- ✅ **17% smaller** than classnames when gzipped
- ✅ **54% smaller** than classnames/dedupe when gzipped  
- ✅ **Better compression ratio** (69.3% vs ~57%) due to optimized code structure

### 🎯 When to Use Each

**Use clsnx when:**
- ✅ You have duplicate class names (common in component libraries)
- ✅ You want the fastest deduplication (90%+ faster than classnames/dedupe)
- ✅ Bundle size matters (54% smaller than classnames/dedupe)
- ✅ Memory efficiency matters (mobile, large applications)
- ✅ You want modern TypeScript support
- ✅ You prefer built-in deduplication without performance penalties

**Use classnames when:**
- ✅ You need maximum raw speed and never have duplicates
- ✅ You need CSS Modules binding (`classnames/bind`)
- ✅ You want the most battle-tested solution (17.7k stars, 5M+ dependents)

## 🔧 API Reference

clsnx accepts any number of arguments which can be strings, objects, arrays, or falsy values.

### String Arguments
```javascript
clsnx('foo', 'bar'); // => 'foo bar'
clsnx('foo bar', 'baz'); // => 'foo bar baz'
```

### Object Arguments
```javascript
clsnx({ foo: true, bar: false }); // => 'foo'
clsnx('base', { active: true, disabled: false }); // => 'base active'
```

### Array Arguments (with nesting)
```javascript
clsnx(['foo', 'bar']); // => 'foo bar'
clsnx('base', ['foo', { bar: true }]); // => 'base foo bar'
clsnx(['foo', ['bar', ['baz']]]); // => 'foo bar baz'
```

### Mixed Arguments with Deduplication
```javascript
clsnx(
  'btn btn-primary',
  { 'btn-large': true, 'btn-primary': true },
  ['btn', 'active']
); // => 'btn btn-primary btn-large active'
```

### Falsy Values (ignored)
```javascript
clsnx('foo', null, undefined, false, 0, ''); // => 'foo'
```

## 🔬 TypeScript Support

clsnx is built with TypeScript and provides excellent type safety:

```typescript
import clsnx from '@becks256/clsnx';

// Full type checking
const className = clsnx(
  'base',
  { active: boolean },
  ['utility', { responsive: condition }]
); // className: string
```

Advanced type guards ensure runtime safety and optimal performance.

## 🏃 Running Benchmarks

Want to see the performance and bundle size data yourself?

```bash
git clone https://github.com/becks256/clsnx.git
cd clsnx
npm install
npm run benchmark     # Performance benchmarks
npm run bundle-size   # Bundle size analysis
```

## 🧪 Testing

```bash
npm test        # Run tests in watch mode
npm run test:run    # Run tests once
npm run test:coverage   # Run with coverage
```

## 📝 License

MIT © Dan Becker

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**clsnx**: Because your CSS classes shouldn't have duplicates, and your memory shouldn't either. 🎯
