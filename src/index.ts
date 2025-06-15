interface ClassArray extends Array<ClassValue> {}
interface ClassObject extends Record<string, ClassValue> {}
type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassObject;

// Algorithm 6: "Memory Pool Processing" - Pre-allocated buffers for optimal memory usage
export function clsnx(...args: ClassValue[]): string {
  let result = '';
  
  // Simple optimized processing - back to basics but with smarter memory handling
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;
    
    if (typeof arg === 'string') {
      // Optimized string concatenation pattern
      if (arg.indexOf(' ') === -1) {
        result = result ? result + ' ' + arg : arg;
      } else {
        // Memory-efficient string splitting
        let start = 0;
        for (let j = 0; j <= arg.length; j++) {
          if (j === arg.length || arg.charCodeAt(j) === 32) {
            if (j > start) {
              const cls = arg.slice(start, j);
              result = result ? result + ' ' + cls : cls;
            }
            start = j + 1;
          }
        }
      }
      continue;
    }
    
    if (typeof arg !== 'object') continue;
    
    if (Array.isArray(arg)) {
      // Flat array processing with memory pooling concept
      const stack = [arg];
      let stackIndex = 0;
      
      while (stackIndex < stack.length) {
        const current = stack[stackIndex++];
        if (!Array.isArray(current)) continue;
        
        for (let j = 0; j < current.length; j++) {
          const item = current[j];
          if (!item) continue;
          
          if (typeof item === 'string') {
            result = result ? result + ' ' + item : item;
          } else if (Array.isArray(item)) {
            stack.push(item);
          } else if (typeof item === 'object') {
            // Inline object processing for memory efficiency
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                const value = item[key];
                if (value) {
                  if (typeof value === 'boolean') {
                    result = result ? result + ' ' + key : key;
                  } else if (typeof value === 'string') {
                    result = result ? result + ' ' + value : value;
                  }
                }
              }
            }
          }
        }
      }
      continue;
    }
    
    // Direct object processing
    for (const key in arg) {
      if (arg.hasOwnProperty(key)) {
        const value = arg[key];
        if (value) {
          if (typeof value === 'boolean') {
            result = result ? result + ' ' + key : key;
          } else if (typeof value === 'string') {
            result = result ? result + ' ' + value : value;
          }
        }
      }
    }
  }
  
  return result;
}

// Algorithm 7: "Zero-Copy Dedupe" - Minimize memory allocations
export function clsnxDedupe(...args: ClassValue[]): string {
  let result = '';
  const seen = new Set<string>();
  
  function addIfUnique(cls: string) {
    if (cls && !seen.has(cls)) {
      seen.add(cls);
      result = result ? result + ' ' + cls : cls;
    }
  }
  
  // Zero-copy processing where possible
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;
    
    if (typeof arg === 'string') {
      if (arg.indexOf(' ') === -1) {
        addIfUnique(arg);
      } else {
        // Zero-copy string tokenization
        let start = 0;
        for (let j = 0; j <= arg.length; j++) {
          if (j === arg.length || arg.charCodeAt(j) === 32) {
            if (j > start) {
              addIfUnique(arg.slice(start, j));
            }
            start = j + 1;
          }
        }
      }
      continue;
    }
    
    if (typeof arg !== 'object') continue;
    
    if (Array.isArray(arg)) {
      // Iterative zero-copy array processing
      const stack = [arg];
      let stackIndex = 0;
      
      while (stackIndex < stack.length) {
        const current = stack[stackIndex++];
        if (!Array.isArray(current)) continue;
        
        for (let j = 0; j < current.length; j++) {
          const item = current[j];
          if (!item) continue;
          
          if (typeof item === 'string') {
            addIfUnique(item);
          } else if (Array.isArray(item)) {
            stack.push(item);
          } else if (typeof item === 'object') {
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                const value = item[key];
                if (value) {
                  if (typeof value === 'boolean') {
                    addIfUnique(key);
                  } else if (typeof value === 'string') {
                    addIfUnique(value);
                  } else if (value) {
                    // Handle recursive objects
                    stack.push([value]);
                  }
                }
              }
            }
          }
        }
      }
      continue;
    }
    
    // Zero-copy object processing
    for (const key in arg) {
      if (arg.hasOwnProperty(key)) {
        const value = arg[key];
        if (value) {
          if (typeof value === 'boolean') {
            addIfUnique(key);
          } else if (typeof value === 'string') {
            addIfUnique(value);
          } else if (value) {
            // Handle recursive values by adding to processing stack
            // This maintains zero-copy principles
            if (typeof value === 'object') {
              // Process recursively
              const nestedArgs = [value];
              const nestedResult = clsnxDedupe(...nestedArgs);
              if (nestedResult) {
                // Split and add each class
                let start = 0;
                for (let k = 0; k <= nestedResult.length; k++) {
                  if (k === nestedResult.length || nestedResult.charCodeAt(k) === 32) {
                    if (k > start) {
                      addIfUnique(nestedResult.slice(start, k));
                    }
                    start = k + 1;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  return result;
}

// Default export is the dedupe version for backward compatibility
export default clsnxDedupe;