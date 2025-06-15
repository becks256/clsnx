interface ClassArray extends Array<ClassValue> {}
interface ClassObject extends Record<string, ClassValue> {}
type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassObject;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isObject(value: unknown): value is ClassObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isArray(value: unknown): value is ClassArray {
  return Array.isArray(value);
}

export function clsnx(...args: ClassValue[]): string {
  const classes: string[] = [];
  const seen = new Set<string>();
  
  function processItem(item: ClassValue) {
    if (!item) return;
    
    if (isString(item)) {
      // Split and add non-empty classes, maintaining order
      const itemClasses = item.split(/\s+/);
      for (let i = 0; i < itemClasses.length; i++) {
        const cls = itemClasses[i];
        if (cls && !seen.has(cls)) {
          seen.add(cls);
          classes.push(cls);
        }
      }
    } else if (isArray(item)) {
      // Process array items in order
      for (let i = 0; i < item.length; i++) {
        processItem(item[i]);
      }
    } else if (isObject(item)) {
      const keys = Object.keys(item);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key) { // Truthiness check for key
          const value = item[key];
          
          if (isBoolean(value)) {
            if (value && !seen.has(key)) {
              seen.add(key);
              classes.push(key);
            }
          } else if (isString(value)) {
            if (!seen.has(value)) {
              seen.add(value);
              classes.push(value);
            }
          } else if (value) {
            processItem(value);
          }
        }
      }
    }
  }
  
  // Process all arguments in order
  for (let i = 0; i < args.length; i++) {
    processItem(args[i]);
  }
  
  return classes.join(" ");
}

export default clsnx