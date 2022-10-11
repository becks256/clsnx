export function clsnx() {
  const classes = []
  Array.from(arguments).forEach((item) => {
    typeof item === "string" && classes.push(item)
    if (typeof item === "object") {
      Object.keys(item).forEach((i) => {
        if (typeof item[i] === "boolean") {
          item[i] && classes.push(i)
        } else if (typeof item[i] === "string") {
          classes.push(item[i])
        } else if (typeof item[i] === "object") {
          item[i] && classes.push(classname(item[i]))
        }
      })
    }
  })
  return [...new Set(classes)].join(" ")
}