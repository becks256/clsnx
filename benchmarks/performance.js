const Benchmark = require('benchmark');
const classNames = require('classnames');
const classNamesDedupe = require('classnames/dedupe');
const { clsnx, clsnxDedupe } = require('../src/index.ts');

const suite = new Benchmark.Suite();

// Test scenarios
const scenarios = {
  // Simple string concatenation
  simple: {
    name: 'Simple strings',
    args: ['foo', 'bar', 'baz']
  },
  
  // Mixed types without duplicates
  mixed: {
    name: 'Mixed types (no duplicates)',
    args: ['foo', { bar: true, qux: false }, ['baz'], null, undefined]
  },
  
  // Scenario with duplicates (common real-world case)
  duplicates: {
    name: 'With duplicates',
    args: ['btn', 'btn-primary', 'btn', { 'btn-large': true, 'btn-primary': true }, ['btn', 'active']]
  },
  
  // Complex nested structure
  complex: {
    name: 'Complex nested',
    args: [
      'base-class',
      {
        'state-active': true,
        'state-disabled': false,
        'theme-dark': true
      },
      [
        'utility-class',
        {
          'responsive-sm': true,
          'responsive-md': false
        },
        ['nested-array', 'deep-nested']
      ],
      null,
      undefined,
      'final-class'
    ]
  },

  // Heavy duplication scenario
  heavyDuplicates: {
    name: 'Heavy duplicates',
    args: [
      'btn btn-primary',
      'btn btn-large',
      { btn: true, 'btn-primary': true, 'btn-large': true },
      ['btn', 'btn-primary', 'btn-large'],
      'btn btn-primary btn-large btn-primary',
      { btn: true }
    ]
  }
};

console.log('🚀 Performance Benchmark: clsnx vs clsnxDedupe vs classnames\n');

// Run benchmarks for each scenario
Object.entries(scenarios).forEach(([key, scenario]) => {
  console.log(`📊 Testing: ${scenario.name}`);
  console.log(`   Input: ${JSON.stringify(scenario.args)}`);
  
  // Test output consistency first
  const clsnxResult = clsnx(...scenario.args);
  const clsnxDedupeResult = clsnxDedupe(...scenario.args);
  const classNamesResult = classNames(...scenario.args);
  const classNamesDedupeResult = classNamesDedupe(...scenario.args);
  
  console.log(`   clsnx output:             "${clsnxResult}"`);
  console.log(`   clsnxDedupe output:       "${clsnxDedupeResult}"`);
  console.log(`   classnames output:        "${classNamesResult}"`);
  console.log(`   classnames/dedupe output: "${classNamesDedupeResult}"`);
  
  if (clsnxResult === classNamesResult) {
    console.log(`   ✅ clsnx matches classnames`);
  } else {
    console.log(`   ⚠️  clsnx differs from classnames (expected for duplicates)`);
  }
  
  if (clsnxDedupeResult === classNamesDedupeResult) {
    console.log(`   ✅ clsnxDedupe matches classnames/dedupe`);
  } else {
    console.log(`   ⚠️  clsnxDedupe differs from classnames/dedupe`);
  }
  
  console.log('');
  
  const testSuite = new Benchmark.Suite();
  
  testSuite
    .add(`clsnx (non-dedupe)`, () => {
      clsnx(...scenario.args);
    })
    .add(`clsnxDedupe`, () => {
      clsnxDedupe(...scenario.args);
    })
    .add(`classnames`, () => {
      classNames(...scenario.args);
    })
    .add(`classnames/dedupe`, () => {
      classNamesDedupe(...scenario.args);
    })
    .on('cycle', (event) => {
      console.log(`   ${event.target}`);
    })
    .on('complete', function() {
      const fastest = this.filter('fastest').map('name');
      const slowest = this.filter('slowest').map('name');
      
      console.log(`   🏆 Fastest: ${fastest.join(', ')}`);
      console.log(`   🐌 Slowest: ${slowest.join(', ')}`);
      
      // Calculate relative performance
      const results = this.slice().sort((a, b) => b.hz - a.hz);
      const fastestHz = results[0].hz;
      
      results.forEach((result, index) => {
        if (index > 0) {
          const ratio = (fastestHz / result.hz);
          console.log(`   📈 ${results[0].name} is ${ratio.toFixed(1)}x faster than ${result.name}`);
        }
      });
      
      console.log('\n' + '─'.repeat(80) + '\n');
    })
    .run({ async: false });
});

// Memory usage test
console.log('🧠 Memory Usage Test\n');

function measureMemory(fn, name, iterations = 10000) {
  if (global.gc) {
    global.gc();
  }
  
  const startMemory = process.memoryUsage();
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  if (global.gc) {
    global.gc();
  }
  
  const endMemory = process.memoryUsage();
  const heapUsed = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024;
  
  console.log(`${name}: ${heapUsed.toFixed(2)} MB heap difference (${iterations} iterations)`);
  return heapUsed;
}

const heavyArgs = scenarios.heavyDuplicates.args;

const clsnxMemory = measureMemory(() => clsnx(...heavyArgs), 'clsnx');
const clsnxDedupeMemory = measureMemory(() => clsnxDedupe(...heavyArgs), 'clsnxDedupe');
const classNamesMemory = measureMemory(() => classNames(...heavyArgs), 'classnames');
const classNamesDedupeMemory = measureMemory(() => classNamesDedupe(...heavyArgs), 'classnames/dedupe');

console.log(`\n📊 Memory efficiency:`);
if (clsnxMemory < classNamesMemory) {
  console.log(`✅ clsnx uses ${((classNamesMemory - clsnxMemory) / classNamesMemory * 100).toFixed(1)}% less memory than classnames`);
}
if (clsnxMemory < classNamesDedupeMemory) {
  console.log(`✅ clsnx uses ${((classNamesDedupeMemory - clsnxMemory) / classNamesDedupeMemory * 100).toFixed(1)}% less memory than classnames/dedupe`);
}
if (clsnxDedupeMemory < classNamesMemory) {
  console.log(`✅ clsnxDedupe uses ${((classNamesMemory - clsnxDedupeMemory) / classNamesMemory * 100).toFixed(1)}% less memory than classnames`);
}
if (clsnxDedupeMemory < classNamesDedupeMemory) {
  console.log(`✅ clsnxDedupe uses ${((classNamesDedupeMemory - clsnxDedupeMemory) / classNamesDedupeMemory * 100).toFixed(1)}% less memory than classnames/dedupe`);
}