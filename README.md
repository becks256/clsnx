# clsnx

An ultra-light (575B), ESNext focused utility for conditionally joining classNames together.

## Install

```shell
  npm install @becks256/clsnx
```

## Usage - General

The `clsnx` function takes any number of arguments, and while any type of argument can be passed, only objects, arrays and strings will be processed. 

Dimensional arrays are also acceptable and will be recursively processed

```javascript
// strings
clsnx("class1", "class2") // => "class1 class2"

// arrays 
clsnx(["class1", "class2"]) // => "class1 class2"

// objects
  // objects with boolean values will pass the keys as strings to the class names
  clsnx({ class1: false, class2: true }) // => "class2"

  // object with string value will pass the string as a class name. 
  clsnx({ className: "class1 class2 class3" }) // => "class1 class2 class3"

  // objects with dynamic keys will generate as expected
  const variable = "test"
  clsnx({[`my-${variable}-class`]: true}) // => "my-test-class"

// Arguments of mixed types, including dimensional arrays
clsnx(
  {
    className: "class1 class2",
  },
  "thing-1",
  {
    class3: true,
    class4: false,
    class5: null,
    class6: true,
  },
  [
    "class7",
    "class8",
    {
      class9: true,
      class10: false,
    },
    [
      "nestedclass",
      [
        "double-nested-class",
        {
          class11: true,
          class12: false,
        },
      ],
    ],
  ]
) // => "class1 class2 thing-1 class3 class6 class7 class8 class9 nestedclass double-nested-class class11"
```

> [!TIP]
> When passing objects, there are 2 paradigms to consider.  First, if the value in a key / value pair is `true | false`, the key is the target for class name extraction, otherwise the value is the target. This allows for greater flexibility in how strings are assigned and passed to the method. 

## Usage - React

```jsx
  import {clsnx} from '@becks256/clsnx'

  const MyComponent = ({...props}) => {
    return (
        <p className={clsnx({
          'red-text': props.isInvalid,
          'green-text': !props.isInvalid
        })}>
    )
  }
```

## Dedupe

`clsnx` will dedupe class names by default

``` javascript
  clsnx("class1", "class1 class2", {class1: true, class2: true}) // => "class1 class2"

```
