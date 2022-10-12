export function clsnx() {
  const classes = []
  Array.from(arguments).forEach((item) => {
    if (typeof item === "string") {
      item.split(/\s/).forEach(classItem => {
        classes.push(classItem)
      })
    } else if (typeof item === "object") {
      Object.keys(item).forEach((i) => {
        if (typeof item[i] === "boolean") {
          item[i] && classes.push(i)
        } else if (typeof item[i] === "string") {
          classes.push(item[i])
        } else if (typeof item[i] === "object") {
          item[i] && classes.push(clsnx(item[i]))
        }
      })
    }
  })
  return [...new Set(classes)].join(" ")
}