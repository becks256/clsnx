interface ClassArray extends Array<ClassValue> {}
interface ClassObject extends Record<string, ClassValue> {}
type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassObject;

export function clsnx(...args: ClassValue[]): string {
  // Strategy 1: Hybrid approach with string building for speed
  let result = '';
  const seen = new Set<string>();
  
  function appendClass(newClass: string) {
    if (!seen.has(newClass)) {
      seen.add(newClass);
      result = result ? result + ' ' + newClass : newClass;
    }
  }
  
  function processValue(arg: ClassValue): void {
    if (!arg) return;
    
    // Fast path for strings (most common case)
    if (typeof arg === 'string') {
      // Ultra-fast single class check
      if (arg.indexOf(' ') === -1) {
        appendClass(arg);
        return;
      }
      
      // Optimized multi-class splitting
      let start = 0;
      for (let i = 0; i <= arg.length; i++) {
        if (i === arg.length || arg[i] === ' ') {
          if (i > start) {
            const cls = arg.slice(start, i);
            appendClass(cls);
          }
          start = i + 1;
        }
      }
      return;
    }
    
    // Skip numbers and other non-object/array types
    if (typeof arg !== 'object') return;
    
    if (Array.isArray(arg)) {
      // Inline array processing for speed
      for (let i = 0; i < arg.length; i++) {
        processValue(arg[i]);
      }
      return;
    }
    
    // Fast object iteration
    for (const key in arg) {
      if (arg.hasOwnProperty(key)) {
        const value = arg[key];
        
        if (typeof value === 'boolean') {
          if (value) {
            appendClass(key);
          }
        } else if (typeof value === 'string') {
          appendClass(value);
        } else if (value) {
          processValue(value);
        }
      }
    }
  }
  
  // Process all arguments
  for (let i = 0; i < args.length; i++) {
    processValue(args[i]);
  }
  
  return result;
}

export default clsnx;